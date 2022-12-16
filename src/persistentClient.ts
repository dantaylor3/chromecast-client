import {Client} from 'castv2'
import Debug from 'debug'
import {createChannel} from './channel'
import {withTimeout} from './utils'
const debug = Debug('persistent-client')

export type PersistentClient = {
  close: () => void
  send: Client['send']
  createChannel: ReturnType<typeof createChannel>
}

export const connect = ({
  host,
  client = new Client(),
  retryDelay = 5000,
  port = 8009,
  timeout = 3000,
}: {
  host: string
  client?: Client
  retryDelay?: number
  port?: number
  timeout?: number
}): Promise<PersistentClient> => {
  let shouldReconnect = true
  let isConnected = false

  const close = () => {
    debug('permanently closing client...')
    shouldReconnect = false
    client.close()
  }

  const sendHeartbeat = () =>
    client.send('sender-0', 'receiver-0', 'urn:x-cast:com.google.cast.tp.heartbeat', JSON.stringify({type: 'PING'}))

  const send = client.send.bind(client)

  return withTimeout({timeout})(
    new Promise(resolve => {
      if (isConnected) return resolve({close, send, createChannel: createChannel(client)})

      client.connect({host, port}, () => {
        isConnected = true

        sendHeartbeat()
        const timer = setInterval(sendHeartbeat, 5000)

        client.once('close', () => {
          isConnected = false
          clearInterval(timer)

          if (shouldReconnect) {
            debug(`client reconnecting in ${retryDelay}ms`)
            setTimeout(() => {
              connect({host, client, retryDelay, port, timeout})
            }, retryDelay)
          }
        })

        resolve({close, send, createChannel: createChannel(client)})
      })
    })
  )
}
