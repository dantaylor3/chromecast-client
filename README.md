# Chromecast Client
[![NPM Version][npm-version-image]][npm-url]
[![Build][github-actions-ci-image]][github-actions-ci-url]
![Types][types-image]
[![Patreon][patreon-image]][patreon-url]

### A Typescript based Chromecast client
This module is a mid-level library which uses [castv2](https://github.com/thibauts/node-castv2) as a basis for communicating with a Chromecast to provide a fully typed, promise-based api for interacting with the Chromecast. It provides
* a persistent client that will keep your client connected to the Chromecast
* controllers for common namespaces used by the Chromecast
* a Platform implementing basic features of the Chromecast
* a DefaultMedia application implementation to control Chromecast media
* a Dashcast application implementation as another application example
* TODO: a Youtube application implementation

This module is intended to be composable and reusable for other use cases outside of those implemented and wouldn't have been possible without both [castv2](https://github.com/thibauts/node-castv2) and [nodecastor](https://github.com/vincentbernat/nodecastor)

[github-actions-ci-image]: https://badgen.net/github/checks/dantaylor3/chromecast-client/main?label=build
[github-actions-ci-url]: https://github.com/dantaylor3/chromecast-client/actions/workflows/release-please.yml
[patreon-image]: https://img.shields.io/badge/Patreon-donate-lightgray?logo=patreon
[patreon-url]: https://www.patreon.com/dantaylor
[npm-url]: https://npmjs.org/package/chromecast-client
[npm-version-image]: https://img.shields.io/npm/v/chromecast-client
[types-image]: https://img.shields.io/npm/types/chromecast-client