declare module 'castv2' {
  import {EventEmitter} from 'events'

  export class Client extends EventEmitter {
    constructor()

    connect(options: {host: string; port: number} | string, cb: () => void): void
    close(): void
    send(sourceId: string, destinationId: string, namespace: string, data: Buffer | string): void
    createChannel(sourceId: string, destinationId: string, namespace: string, encoding?: string): Channel
    on(event: 'connect', handler: () => void): this
    on(event: 'close', handler: () => void): this
    on(event: 'error', handler: (err: Error) => void): this
    on(
      event: 'message',
      handler: (sourceId: string, destinationId: string, namespace: string, data: Buffer | string) => void
    ): this
  }

  export class Channel extends EventEmitter {
    constructor(bus: Client, sourceId: string, destinationId: string, namespace: string, encoding?: string)

    send(data: Buffer | string | Record<string, unknown>): void
    close(): void
    on(event: 'close', handler: () => void): this
    on(event: 'message', handler: (data: Record<string, unknown> | string, isBroadcast: boolean) => void): this
  }
}
