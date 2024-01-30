import {PersistentClient, ReceiverController} from '../src'
;(async () => {
  // create a persistent client connected on a given host
  const client = new PersistentClient({host: '192.168.1.150'})
  await client.connect()

  // launch the media app on the Chromecast and join the session (so we can control the CC)
  const controller = ReceiverController.createReceiver({client})

  // get the volume from the chromecast and unwrap the result
  const volume = (await controller.getVolume()).unwrapAndThrow()

  // log the volume level since there weren't any errors (or it would've thrown)
  console.log(volume)

  // dispose of the controller and close the client
  controller.dispose()
  client.close()
})()
