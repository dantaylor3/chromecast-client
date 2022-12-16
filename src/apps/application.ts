import {createReceiver} from '../controllers/receiver'
import {PersistentClient} from '../persistentClient'

export const generateSourceId = () => `sender-${Math.ceil(Math.random() * 10e5)}`

export const launchAppAndGetTransportId = async (client: PersistentClient, appId: string): Promise<string> => {
  const receiver = createReceiver({
    client,
    sourceId: 'sender-0',
    destinationId: 'receiver-0',
  })
  const getTransportId = () => receiver.getStatus().then(s => s.applications.find(a => a.appId === appId)?.transportId)

  try {
    const tid = await getTransportId()
    if (tid) return tid

    await receiver.launch(appId)

    const tid2 = await getTransportId()
    if (!tid2) throw new Error('failed to find application to join')

    return tid2
  } finally {
    receiver.dispose()
  }
}
