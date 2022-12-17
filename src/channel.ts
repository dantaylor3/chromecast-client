import {Client} from 'castv2'
import {tryParseJSON} from './utils'

export type Channel = {
  send: (data: Record<string, unknown>) => void
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  sendWithResponse: (data: Record<string, unknown>, timeout?: number) => Promise<Record<string, any>>
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
    const channel = client.createChannel(sourceId, destinationId, namespace, 'JSON')
    client.send(sourceId, destinationId, 'urn:x-cast:com.google.cast.tp.connection', JSON.stringify({type: 'CONNECT'}))
    channel.on('message', (data, isBroadcast) => {
      if (typeof data === 'object') return onMessage(data, isBroadcast)

      const json = tryParseJSON(data)
      if (json !== undefined) return onMessage(json, isBroadcast)
    })

    const send = (data: Record<string, unknown>) =>
      client.send(sourceId, destinationId, namespace, JSON.stringify(data))

    const sendWithResponse = (data: Record<string, unknown>, timeout = 5000) =>
      new Promise<Record<string, unknown>>((resolve, reject) => {
        const requestId = ++lastRequestId

        client.on('message', function onMessage(sid, dit, ns, data) {
          const json = tryParseJSON(data)
          if (
            json !== undefined &&
            json.requestId === requestId &&
            sid === destinationId &&
            (dit === sourceId || dit === '*') &&
            namespace === ns
          ) {
            client.removeListener('message', onMessage)
            return resolve(json)
          }
        })

        setTimeout(() => {
          client.removeListener('message', onMessage)
          reject(new Error(`timed out for request ${requestId}`))
        }, timeout)

        send({...data, requestId})
      })

    return {
      send,
      sendWithResponse,
      close: () => {
        channel.close()
        channel.removeAllListeners()
      },
    }
  }
