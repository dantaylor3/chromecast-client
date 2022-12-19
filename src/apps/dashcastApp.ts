import {PersistentClient} from '../persistentClient'
import {Result} from '../utils'
import * as Application from './application'

export interface Dashcast {
  loadUrl: ({
    url,
    force,
    reload,
    reloadTime,
  }: {
    url: string
    force?: boolean
    reload?: boolean
    reloadTime?: number
  }) => void
}

const createDashcast =
  (client: PersistentClient) =>
  async (sourceId: string, destinationId: string): Promise<Dashcast> => {
    const channel = client.createChannel(sourceId, destinationId, 'urn:x-cast:es.offd.dashcast')

    return {
      loadUrl: ({url, force = false, reload = false, reloadTime = 0}) =>
        channel.send({url, force, reload, reload_time: reloadTime}),
    }
  }

export const launchAndJoin = ({client}: {client: PersistentClient}): Promise<Result<Dashcast>> =>
  Application.launchAndJoin({
    client,
    appId: 'CC1AD845',
    factory: createDashcast(client),
  })

export const join = async ({client}: {client: PersistentClient}): Promise<Result<Dashcast>> =>
  Application.join({
    client,
    factory: createDashcast(client),
  })
