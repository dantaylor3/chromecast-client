import {ReceiverStatus} from '../cast-types'
import {createReceiver} from '../controllers/receiver'
import {PersistentClient} from '../persistentClient'
import {generateRandomSourceId, Result} from '../utils'

const _getJoinableTransportId = (status: ReceiverStatus): Result<string> => {
  const app = status.applications.find(a => a.namespaces.map(e => e.name).includes('urn:x-cast:com.google.cast.media'))
  return app === undefined ? Result.Err(new Error('failed to find joinable application')) : Result.Ok(app.transportId)
}

const _join = async <T>(
  status: Promise<Result<ReceiverStatus>>,
  factory: (sourceId: string, destinationId: string) => T
): Promise<Result<T>> => {
  const transportIdMaybe = await status.then(Result.flatMap(_getJoinableTransportId)).then(r => r.unwrapWithErr())

  return transportIdMaybe.isOk
    ? Result.Ok(factory(generateRandomSourceId(), transportIdMaybe.value))
    : Result.Err(transportIdMaybe.value)
}

export const launchAndJoin = async <T>({
  client,
  factory,
}: {
  client: PersistentClient
  factory: (sourceId: string, destinationId: string) => T
}): Promise<Result<T>> => {
  const receiver = createReceiver({
    client,
    sourceId: 'sender-0',
    destinationId: 'receiver-0',
  })
  try {
    return await _join(receiver.launch('CC1AD845'), (sourceId, destinationId) => factory(sourceId, destinationId))
  } finally {
    receiver.dispose()
  }
}

export const join = async <T>({
  client,
  factory,
}: {
  client: PersistentClient
  factory: (sourceId: string, destinationId: string) => T
}): Promise<Result<T>> => {
  const receiver = createReceiver({
    client,
    sourceId: 'sender-0',
    destinationId: 'receiver-0',
  })
  try {
    return await _join(receiver.getStatus(), (sourceId, destinationId) => factory(sourceId, destinationId))
  } finally {
    receiver.dispose()
  }
}
