import {PersistentClient} from '../persistentClient'
import {generateSourceId, launchAppAndGetTransportId} from './application'

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

export const join = async ({client}: {client: PersistentClient}): Promise<Dashcast> => {
  const transportId = await launchAppAndGetTransportId(client, '5C3F0A3C')
  const channel = client.createChannel(generateSourceId(), transportId, 'urn:x-cast:es.offd.dashcast')

  return {
    loadUrl: ({url, force = false, reload = false, reloadTime = 0}) =>
      channel.send({url, force, reload, reload_time: reloadTime}),
  }
}
