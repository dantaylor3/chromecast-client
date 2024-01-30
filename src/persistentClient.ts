import {EventEmitter} from 'events'
import {clearInterval} from 'node:timers'

import {Client} from 'castv2'
import Debug from 'debug'

import {createChannel} from './channel'
import {withTimeout} from './utils'
const debug = Debug('persistent-client')

export interface PersistentClientOptions {
  host: string
  client?: Client
  retryDelay?: number
  port?: number
  timeout?: number
}

export class PersistentClient extends EventEmitter {
  client: Client
  send: Client['send']
  createChannel: ReturnType<typeof createChannel>
  shouldReconnect: boolean
  connected: boolean
  private interval?: number
  private options: Required<Omit<PersistentClientOptions, 'client'>>

  constructor(options: PersistentClientOptions) {
    super()
    const {host, client = new Client(), retryDelay = 5000, port = 8009, timeout = 3000} = options
    this.options = {
      host,
      retryDelay,
      port,
      timeout,
    }
    this.client = client
    this.client.on('close', () => {
      this.connected = false
      this.emit('close')
    })
    this.client.on('error', err => {
      this.emit('error', err)
    })
    this.send = this.client.send.bind(this.client)
    this.createChannel = createChannel(this.client)
    this.shouldReconnect = true
    this.connected = false
  }

  heartbeat() {
    this.interval = setInterval(function (self) {
      return async () => {
        if (self.connected) {
          self.send('sender-0', 'receiver-0', 'urn:x-cast:com.google.cast.tp.heartbeat', JSON.stringify({type: 'PING'}))
        } else if (self.shouldReconnect) {
          debug(`client reconnecting in ${self.options.retryDelay}ms`)
          try {
            await self.connect()
          } catch (e) {
            self.emit('error', e)
          }
        } else {
          clearInterval(self.interval)
          self.interval = undefined
        }
      }
    }, this.options.retryDelay)
  }

  connect = async () => {
    if (this.connected) {
      return
    }
    this.shouldReconnect = true
    // eslint-disable-next-line no-useless-catch
    try {
      await withTimeout({timeout: this.options.timeout})(
        new Promise<void>(resolve => {
          this.client.connect({host: this.options.host, port: this.options.port}, () => {
            this.emit('connect')
            this.connected = true
            if (this.interval === undefined) {
              this.heartbeat()
            }
            resolve()
          })
        })
      )
    } catch (e) {
      throw e
    }
  }

  close = () => {
    debug('permanently closing client...')
    this.shouldReconnect = false
    this.client.close()
    clearInterval(this.interval)
    this.interval = undefined
  }
}

export const connect = async (options: PersistentClientOptions) => {
  const client = new PersistentClient(options)
  await client.connect()
  return client
}
