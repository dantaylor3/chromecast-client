import {Client} from 'castv2'
import {z, ZodTypeDef} from 'zod'

import {Result, tryParseJSON} from './utils'

export type Channel = {
  send: (data: Record<string, unknown>) => void
  sendWithResponse: <T = unknown>({
    data,
    type,
    timeout,
  }: {
    data: Record<string, unknown>
    type?: z.ZodType<T, ZodTypeDef, unknown>
    timeout?: number
  }) => Promise<Result<T>>
  close: () => void
}

export const createChannel =
  (client: Client) =>
  (
    sourceId: string,
    destinationId: string,
    namespace: string,
    onMessage: (data: Record<string, unknown>, isBroadcast: boolean) => void = () => {}
  ): Channel => {
    let lastRequestId = 0
    const channel = client.createChannel(sourceId, destinationId, namespace)
    client.send(sourceId, destinationId, 'urn:x-cast:com.google.cast.tp.connection', JSON.stringify({type: 'CONNECT'}))
    channel.on('message', (data, isBroadcast) => {
      if (typeof data === 'object') return onMessage(data, isBroadcast)

      const json = tryParseJSON(data)
      if (json !== undefined) return onMessage(json, isBroadcast)
    })

    const send = (data: Record<string, unknown>) =>
      client.send(sourceId, destinationId, namespace, JSON.stringify(data))

    return {
      send: data => client.send(sourceId, destinationId, namespace, JSON.stringify(data)),
      sendWithResponse: ({data, type = z.any(), timeout = 5000}) =>
        new Promise(resolve => {
          const requestId = ++lastRequestId

          channel.on('message', function onMessage(data) {
            const json = typeof data === 'string' ? tryParseJSON(data) : data
            if (json !== undefined && json.requestId === requestId) {
              channel.removeListener('message', onMessage)
              const parsed = type.safeParse(json)
              resolve(
                parsed.success
                  ? Result.Ok(parsed.data)
                  : Result.Err(new Error(`response had unexpected shape: ${parsed.error}`))
              )
            }
          })

          setTimeout(() => {
            channel.removeListener('message', onMessage)
            resolve(Result.Err(new Error(`timed out for request ${requestId}`)))
          }, timeout)

          send({...data, requestId})
        }),
      close: () => {
        channel.close()
        channel.removeAllListeners()
      },
    }
  }
