import {DefaultMediaApp, connect, Result} from '../src'
;(async () => {
  // create a persistent client connected on a given host
  const client = await connect({host: '192.168.1.150'})

  // launch the media app on the Chromecast and join the session (so we can control the CC)
  const media = await DefaultMediaApp.launchAndJoin({client}).then(Result.unwrapWithErr)

  // if the media app failed to load, log the error
  if (!media.isOk) return console.error(media.value)

  // queue up a couple of videos
  await media.value.queueLoad({
    items: [
      {
        media: {
          contentId: 'http://commondatastorage.googleapis.com/gtv-videos-bucket/big_buck_bunny_1080p.mp4',
          contentType: 'video/mp4',
          streamType: 'BUFFERED',
        },
      },
      {
        media: {
          contentId: 'http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4',
          contentType: 'video/mp4',
          streamType: 'BUFFERED',
        },
      },
    ],
  })

  // after 8 seconds of playing video, forward the video by 60 seconds
  setTimeout(() => media.value.seek({relativeTime: 60}), 8000)

  // after 20 seconds of playing video, stop playing and close client
  setTimeout(() => {
    media.value.stop() // stop playing video
    media.value.dispose() // clean up media app event handlers
    client.close()
  }, 20000)
})()
