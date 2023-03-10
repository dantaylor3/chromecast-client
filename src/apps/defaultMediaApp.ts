import {createMediaController, MediaController} from '../controllers/media'
import {PersistentClient} from '../persistentClient'
import {Result} from '../utils'
import * as Application from './application'

export const launchAndJoin = ({client}: {client: PersistentClient}): Promise<Result<MediaController>> =>
  Application.launchAndJoin({
    client,
    appId: 'CC1AD845',
    factory: async (sourceId, destinationId) => createMediaController({client, sourceId, destinationId}),
  })

export const join = ({client}: {client: PersistentClient}): Promise<Result<MediaController>> =>
  Application.join({
    client,
    factory: async (sourceId, destinationId) => createMediaController({client, sourceId, destinationId}),
  })
