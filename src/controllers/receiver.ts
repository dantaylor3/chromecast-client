import {ReceiverStatus, Volume} from '../cast-types'
import {PersistentClient} from '../persistentClient'

export type Receiver = ReturnType<typeof createReceiver>
export const createReceiver = ({
  client,
  sourceId = 'sender-0',
  destinationId = 'receiver-0',
}: {
  client: PersistentClient
  sourceId?: string
  destinationId?: string
}) => {
  const channel = client.createChannel(sourceId, destinationId, 'urn:x-cast:com.google.cast.receiver')

  const getStatus = async (): Promise<ReceiverStatus> =>
    (await channel.sendWithResponse({type: 'GET_STATUS'}, 5000)).status

  return {
    getStatus,
    isAppAvailable: async (appId: string) => {
      const r = await channel.sendWithResponse({type: 'GET_APP_AVAILABILITY', appId: [appId]}, 5000)
      return r?.availability?.[appId] === 'APP_AVAILABLE'
    },
    getVolume: () => getStatus().then(r => r.volume),
    setVolume: async (options: {level?: number; mute?: boolean}): Promise<Volume> => {
      if (options.level !== undefined && (options.level < 0 || options.level > 1))
        throw new Error('level must be between 0 and 1')
      const r = await channel.sendWithResponse({type: 'SET_VOLUME', volume: options}, 5000)
      return r.status?.volume
    },
    stop: (sessionId: string): Promise<ReceiverStatus> =>
      channel.sendWithResponse({type: 'STOP', sessionId}, 5000).then(r => r.status),
    launch: (appId: string): Promise<ReceiverStatus> =>
      channel.sendWithResponse({type: 'LAUNCH', appId}, 10000).then(r => r?.status),
    dispose: () => channel.close(),
  }
}
