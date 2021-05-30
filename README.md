# Central Dogma client for Node.js

[
![npm version](https://img.shields.io/npm/v/@matsumana/centraldogma-nodejs)
![npm bundle size](https://img.shields.io/bundlephobia/min/@matsumana/centraldogma-nodejs)
![Dependencies](https://img.shields.io/david/matsumana/centraldogma-nodejs)
![npm downloads](https://img.shields.io/npm/dm/@matsumana/centraldogma-nodejs)
](https://www.npmjs.com/package/@matsumana/centraldogma-nodejs)

[
![CircleCI](https://circleci.com/gh/matsumana/centraldogma-nodejs/tree/main.svg?style=shield)
](https://app.circleci.com/pipelines/github/matsumana/centraldogma-nodejs?branch=main)
[
![Known Vulnerabilities](https://snyk.io/test/github/matsumana/centraldogma-nodejs/badge.svg)
](https://snyk.io/test/github/matsumana/centraldogma-nodejs)

This is a client library for Central Dogma.

## What is Central Dogma?

Central Dogma is an open-source, highly-available and version-controlled service configuration repository

Please visit [the official web site](https://line.github.io/centraldogma/) for more information.

<br>

In Central Dogma, there are various use cases.

e.g.

- Service discovery
- Managing Rate limit configuration
- Managing A/B testing configuration
- etc

If you refer to a Central Dogma server via client library, an app can get a change immediately.

It means that no need to restart your app for applying that changes.

Configure something that you want to apply changes without restarting your server application.

## How to use this client library

### How to install

```
$ npm i @matsumana/centraldogma-nodejs
```

### How to watch a file managed by Central Dogma

You can get changes via EventEmitter continuously.

Please refer to the [example](./example/src/index.ts) for more details.

```typescript
import { CentralDogma } from '@matsumana/centraldogma-nodejs';

const centralDogma = new CentralDogma({
    baseURL: 'http://localhost:36462',
});

const emitter = centralDogma.watch.watchFile({
    project: 'project1',
    repo: 'repo1',
    filePath: '/example_config.json',
});
```

### If you want to develop admin application to change configurations managed by Central Dogma

#### get a file

```typescript
import { CentralDogma } from '@matsumana/centraldogma-nodejs';

const centralDogma = new CentralDogma({
    baseURL: 'http://localhost:36462',
});

const entry = await centralDogma.content.getFile({
    project: 'project1',
    repo: 'repo1',
    query: {
        path: '/example_config.json',
        type: QueryTypes.Identity,
    },
});
```

#### register or change files

```typescript
import { CentralDogma } from '@matsumana/centraldogma-nodejs';

const centralDogma = new CentralDogma({
    baseURL: 'http://localhost:36462',
});

const result = await centralDogma.content.push({
    project: 'project1',
    repo: 'repo1',
    baseRevision: 'HEAD',
    commitMessage: {
        summary: 'Add /config1.json and /config2.json',
        detail: 'You can write a detail for changes',
    },
    changes: [
        {
            path: '/config1.json',
            type: ChangeTypes.UpsertJson,
            content: { field1: 'foo' },
        },
        {
            path: '/config2.json',
            type: ChangeTypes.UpsertJson,
            content: { field1: 'bar' },
        },
    ],
});
```

### Other APIs

There are some more APIs.

Please refer to the [sources](./lib/service) and [tests](./test/service) for more details.
