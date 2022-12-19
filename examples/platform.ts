import {createPlatform, connect} from '../src'
;(async () => {
  const client = await connect({host: '192.168.1.150'})
  const platform = await createPlatform(client)
  const status = await platform.getStatus()
  console.log('current status', status)
  platform.close()
  client.close()
})()
