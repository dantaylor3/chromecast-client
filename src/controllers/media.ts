import {Media, Messages} from '../cast-types'
import {PersistentClient} from '../persistentClient'

export type MediaController = ReturnType<typeof createMediaController>
export const createMediaController = ({
  client,
  sourceId = 'sender-0',
  destinationId = 'receiver-0',
}: {
  client: PersistentClient
  sourceId?: string
  destinationId?: string
}) => {
  let mediaSessionId = 0

  const channel = client.createChannel(
    sourceId,
    destinationId,
    'urn:x-cast:com.google.cast.media',
    (data, isBroadcast) => {
      if (data.type === 'MEDIA_STATUS' && isBroadcast) {
        if (Array.isArray(data.status) && data.status.length > 0) {
          mediaSessionId = data.status[0].mediaSessionId
        }
      }
    }
  )

  return {
    getStatus: async (): Promise<Media.MediaStatus> =>
      (await channel.sendWithResponse({type: 'GET_STATUS'}, 5000)).status[0],
    load: async (data: Omit<Messages.LoadRequestData, 'requestId' | 'type'>) => {
      const r = await channel.sendWithResponse({...data, type: 'LOAD'})
      if (r.type === 'LOAD_FAILED') return [new Error('load failed')]
      if (r.type === 'LOAD_CANCELLED') return [new Error('load cancelled')]
      return [undefined, r.status?.[0]]
    },
    play: () => channel.sendWithResponse({mediaSessionId, type: 'PLAY'}),
    pause: () => channel.sendWithResponse({mediaSessionId, type: 'PAUSE'}),
    stop: () => channel.sendWithResponse({mediaSessionId, type: 'STOP'}),
    seek: (data: Omit<Messages.SeekRequestData, 'requestId' | 'type'>) =>
      channel.sendWithResponse({...data, mediaSessionId, type: 'SEEK'}),
    queueLoad: async (data: Omit<Messages.QueueLoadRequestData, 'requestId' | 'type'>) => {
      const r = await channel.sendWithResponse({...data, type: 'QUEUE_LOAD'})
      if (r.type === 'LOAD_FAILED') return [new Error('load failed')]
      if (r.type === 'LOAD_CANCELLED') return [new Error('load cancelled')]
      return [undefined, r.status?.[0]]
    },
    queueInsert: async (data: Omit<Messages.QueueInsertRequestData, 'requestId' | 'type'>) =>
      channel.sendWithResponse({...data, type: 'QUEUE_INSERT'}),
    queueRemove: async (data: Omit<Messages.QueueInsertRequestData, 'requestId' | 'type'>) =>
      channel.sendWithResponse({...data, type: 'QUEUE_REMOVE'}),
    queueReorder: async (data: Omit<Messages.QueueInsertRequestData, 'requestId' | 'type'>) =>
      channel.sendWithResponse({...data, type: 'QUEUE_REORDER'}),
    queueUpdate: async (data: Omit<Messages.QueueInsertRequestData, 'requestId' | 'type'>) =>
      channel.sendWithResponse({...data, type: 'QUEUE_UPDATE'}),
    dispose: () => channel.close(),
  }
}
