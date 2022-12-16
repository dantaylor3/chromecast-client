import {ReceiverStatus} from '../cast-types'
import {createMediaController} from '../controllers/media'
import {createReceiver, Receiver} from '../controllers/receiver'
import {PersistentClient} from '../persistentClient'
import {generateSourceId} from './application'

const _getJoinableTransportId = (status: ReceiverStatus) =>
  status.applications.find(a => a.namespaces.map(e => e.name).includes('urn:x-cast:com.google.cast.media'))?.transportId

const _join = async (client: PersistentClient, transportId: string) =>
  createMediaController({client, sourceId: generateSourceId(), destinationId: transportId})

const _launch = async (receiver: Receiver) => receiver.launch('CC1AD845')

export const launchAndJoin = async ({client}: {client: PersistentClient}) => {
  const receiver = createReceiver({
    client,
    sourceId: 'sender-0',
    destinationId: 'receiver-0',
  })
  try {
    const status = await _launch(receiver)
    const transportId = _getJoinableTransportId(status)
    if (transportId === undefined) throw new Error('failed to find joinable application')
    return _join(client, transportId)
  } finally {
    receiver.dispose()
  }
}

export const join = async ({client}: {client: PersistentClient}) => {
  const receiver = createReceiver({
    client,
    sourceId: 'sender-0',
    destinationId: 'receiver-0',
  })
  try {
    const status = await receiver.getStatus()
    const transportId = _getJoinableTransportId(status)
    if (transportId === undefined) throw new Error('failed to find joinable application')
    return _join(client, transportId)
  } finally {
    receiver.dispose()
  }
}
