import {z} from 'zod'

import {ReceiverStatus, ReceiverStatus$} from '../cast-types'
import {PersistentClient} from '../persistentClient'
import {Result} from '../utils'

const StatusResponse$ = z.object({status: ReceiverStatus$})

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

  const getStatus = async (): Promise<Result<ReceiverStatus>> =>
    channel.sendWithResponse({data: {type: 'GET_STATUS'}, type: StatusResponse$}).then(Result.map(r => r.status))

  return {
    getStatus,
    isAppAvailable: (appId: string) =>
      channel
        .sendWithResponse({
          data: {type: 'GET_APP_AVAILABILITY', appId: [appId]},
          type: z.object({availability: z.record(z.union([z.literal('APP_AVAILABLE'), z.literal('APP_UNAVAILABLE')]))}),
        })
        .then(Result.map(e => e.availability[appId] === 'APP_AVAILABLE')),
    getVolume: () => getStatus().then(Result.map(r => r.volume)),
    setVolume: async (options: {level?: number; mute?: boolean}) => {
      if (options.level !== undefined && (options.level < 0 || options.level > 1))
        throw new Error('level must be between 0 and 1')

      return channel
        .sendWithResponse({
          data: {type: 'SET_VOLUME', volume: options},
          type: StatusResponse$,
        })
        .then(Result.map(e => e.status.volume))
    },
    stop: (sessionId: string) =>
      channel
        .sendWithResponse({data: {type: 'STOP', sessionId}, type: StatusResponse$})
        .then(Result.map(r => r.status)),
    launch: (appId: string) =>
      channel.sendWithResponse({data: {type: 'LAUNCH', appId}, type: StatusResponse$}).then(Result.map(r => r.status)),
    dispose: () => channel.close(),
  }
}
