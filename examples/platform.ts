import {createPlatform, PersistentClient} from '../src'
;(async () => {
  const client = new PersistentClient({host: '192.168.1.150'})
  await client.connect()
  const platform = await createPlatform(client)
  const status = await platform.getStatus()
  console.log('current status', status)
  platform.close()
  client.close()
})()
