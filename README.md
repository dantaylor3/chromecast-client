# Chromecast Client
[![NPM Version][npm-version-image]][npm-url]
[![Build][github-actions-ci-image]][github-actions-ci-url]
![Types][types-image]
[![Patreon][patreon-image]][patreon-url]

## A Typescript based Chromecast client
This module is a mid-level library which uses [castv2](https://github.com/thibauts/node-castv2) as a basis for communicating with a Chromecast to provide a fully typed, promise-based api for interacting with the Chromecast. It provides
* a persistent client that will keep your client connected to the Chromecast
* controllers for common namespaces used by the Chromecast
* a Platform implementing basic features of the Chromecast
* a DefaultMedia application implementation to control Chromecast media
* a Dashcast application implementation as another application example
* TODO: a spotify application implementation

This module is intended to be composable and reusable for other use cases outside of those implemented and wouldn't have been possible without both [castv2](https://github.com/thibauts/node-castv2) and [nodecastor](https://github.com/vincentbernat/nodecastor)

## Installation
**Install with Yarn**
```sh
yarn add chromecast-client
```

**Install with NPM**
```sh
npm install chromecast-client
```

## Usage

### Platform
The platform provides basic controls for the Chromecast like changing the volume and launching applications.

```ts
import {createPlatform, connect} from 'chromecast-client'

const client = await connect({host: '192.168.1.150'})
const platform = await createPlatform(client)
const status = await platform.getStatus()
console.log('current status', status)
platform.close()
client.close()
```

<details><summary>Sample Status Response</summary>

```json
{
    "applications": [
        {
            "appId": "E8C28D3C",
            "appType": "WEB",
            "displayName": "Backdrop",
            "iconUrl": "",
            "isIdleScreen": true,
            "launchedFromCloud": false,
            "namespaces": [
                { "name": "urn:x-cast:com.google.cast.debugoverlay" },
                { "name": "urn:x-cast:com.google.cast.cac" },
                { "name": "urn:x-cast:com.google.cast.sse" },
                { "name": "urn:x-cast:com.google.cast.remotecontrol" }
            ],
            "sessionId": "########-####-####-####-############",
            "statusText": "",
            "transportId": "########-####-####-####-############",
            "universalAppId": "E8C28D3C"
        }
    ],
    "userEq": {},
    "volume": {
        "controlType": "attenuation",
        "level": 1,
        "muted": false,
        "stepInterval": 0.05000000074505806
    }
}
```
</details>

### Using a Controller Directly
We're going to use the Media controller to get the current volume of the Chromecast.

```ts
import {connect, ReceiverController} from 'chromecast-client'

const client = await connect({host: '192.168.1.150'})

// launch the media app on the Chromecast and join the session (so we can control the CC)
const controller = ReceiverController.createReceiver({client})

// get the volume from the chromecast and unwrap the result
const volume = (await controller.getVolume()).unwrapAndThrow()

// log the volume level since there weren't any errors (or it would've thrown)
console.log(volume)

// dispose of the controller and close the client
controller.dispose()
client.close()
```

<details><summary>Sample Volume Response</summary>

```json
{
    "controlType": "attenuation",
    "level": 1,
    "muted": false,
    "stepInterval": 0.05000000074505806
}
```
</details>

### Using an Application
An application is an abstraction on top of one or more controllers that provides a friendly interface to work with. This way, you don't have to work directly with controllers, look up documentation on what commands the protocol supports, etc.

We're going to use the DefaultMediaApp to launch the media app on the chromecast, play some content, control the playback of that content, then stop playing the content

```ts
import {DefaultMediaApp, connect, Result} from 'chromecast-client'

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
```

### Error Handling
This library uses an implementation of `Result` to encapsulate either a successful value or an error. This is similar to [std::result](https://doc.rust-lang.org/std/result/) in Rust, [LanguageExt.Common.Result](https://louthy.github.io/language-ext/LanguageExt.Core/Common/Result/index.html) in C#, [FSharp.Core.Result](https://fsharp.github.io/fsharp-core-docs/reference/fsharp-core-fsharpresult-2.html) in F#, and many more.

There is an awesome Typescript library implementing functional programming concepts called [fp-ts](https://www.npmjs.com/package/fp-ts) which I use extensively. I chose not to use fp-ts in this project to make the library more approachable for those without FP experience.

For those who understand FP concepts, the Result class is roughly equivalent to the Either monad and can be easily integrated with fp-ts. For those who don't understand FP concepts or find it cumbersome in Typescript, simply call `Result.unwrapWithErr` or `Result.unwrapAndThrow` depending on how you'd like to handle errors.

## Discovering Chromecasts on the Network
This library doesn't support chromecast discovery directly because it is well supported by other libraries. Any library that supports multicast DNS discovery will work (such as [bonjour-service](), [mdns](), or [multicast-dns]()).

### Example using bonjour-service
```ts
import Bonjour from 'bonjour-service'

const bonjour = new Bonjour()
bonjour.find({ type: 'googlecast' }, (service) => {
  console.log(`found chromecast named "${service.name}" at ${service.addresses?.[0]}`)
  bonjour.destroy()
})
```

[github-actions-ci-image]: https://badgen.net/github/checks/dantaylor3/chromecast-client/main?label=build
[github-actions-ci-url]: https://github.com/dantaylor3/chromecast-client/actions/workflows/release-please.yml
[patreon-image]: https://img.shields.io/badge/Patreon-donate-lightgray?logo=patreon
[patreon-url]: https://www.patreon.com/dantaylor
[npm-url]: https://npmjs.org/package/chromecast-client
[npm-version-image]: https://img.shields.io/npm/v/chromecast-client
[types-image]: https://img.shields.io/npm/types/chromecast-client
