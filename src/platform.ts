import {createReceiver, Receiver} from './controllers/receiver'
import {PersistentClient} from './persistentClient'

export const createPlatform = (client: PersistentClient) => {
  const receiver = createReceiver({client})

  return {
    getStatus: (...args: Parameters<Receiver['getStatus']>) => receiver.getStatus(...args),
    setVolume: (...args: Parameters<Receiver['setVolume']>) => receiver.setVolume(...args),
    isAppAvailable: (...args: Parameters<Receiver['isAppAvailable']>) => receiver.isAppAvailable(...args),
    stopRunningApp: (...args: Parameters<Receiver['stop']>) => receiver.stop(...args),
    launchApp: (...args: Parameters<Receiver['launch']>) => receiver.launch(...args),
    createChannel: (...args: Parameters<PersistentClient['createChannel']>) => client.createChannel(...args),
    close: () => receiver.dispose(),
  }
}
