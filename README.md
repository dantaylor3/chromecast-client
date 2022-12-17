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
const client = await connect({host: '192.168.1.150'})
const platform = createPlatform(client)
const status = await platform.getStatus()
console.log(status)
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
const controller = ReceiverController.createReceiver({ client })
const volume = await controller.getVolume()
console.log(volume)
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

We're going to use the DefaultMediaApp to launch the media app on the chromecast, play some content, and control the playback of that content.

```ts
import {connect, DefaultMediaApp} from 'chromecast-client'

// create a persistent client connected on a given host
const client = await connect({host: '192.168.1.150'})

// launch the media app on the Chromecast and join the session (so we can control the CC)
const mediaApp = await DefaultMediaApp.launchAndJoin({client})

// queue up a couple of videos
await mediaApp.queueLoad({
    items: [{
        media: {
            contentId: 'http://commondatastorage.googleapis.com/gtv-videos-bucket/big_buck_bunny_1080p.mp4',
            contentType: 'video/mp4',
            streamType: 'BUFFERED',
        },
    }, {
        media: {
            contentId: 'http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4',
            contentType: 'video/mp4',
            streamType: 'BUFFERED',
        },
    }],
})

// after 10 seconds of playing video, forward the video by 60 seconds
setTimeout(() => mediaApp.seek({relativeTime: 60}), 10000)
```

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
