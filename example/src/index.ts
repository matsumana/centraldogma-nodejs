import express, { Request, Response } from 'express';
import {
    CentralDogma,
    Entry,
    WatchResult,
} from '@matsumana/centraldogma-nodejs';

const RECEIVE_DATA_CHECK_INTERVAL = 100;
const STARTUP_TIMEOUT = 3_000;

const CENTRAL_DOGMA_BASE_URL = 'http://localhost:36462';
const CENTRAL_DOGMA_PROJECT = 'project2';
const CENTRAL_DOGMA_REPO = 'repo2';
const CENTRAL_DOGMA_PATH = '/test6.json';

// setup CentralDogma client
const centralDogma = new CentralDogma({
    baseURL: CENTRAL_DOGMA_BASE_URL,
});

let entry: Entry;

// start watching the file in CentralDogma
const emitter = centralDogma.watch.watchFile({
    project: CENTRAL_DOGMA_PROJECT,
    repo: CENTRAL_DOGMA_REPO,
    filePath: CENTRAL_DOGMA_PATH,
});
emitter.on('data', (watchResult: WatchResult) => {
    console.log(`received entry=${JSON.stringify(watchResult)}`);
    entry = watchResult.entry;
});
emitter.on('error', (e) => {
    console.log(`error=${JSON.stringify(e)}`);
    throw e;
});

// setup express
const port = process.env.PORT ?? 8080;
const app = express();
app.get('/', (_req: Request, res: Response) => {
    res.send('It works!');
});
app.get('/content', (_req: Request, res: Response) => {
    console.log(`current entry=${JSON.stringify(entry)}`);
    res.send(entry.content);
});

// listen
let waiting = 0;
const listen = () => {
    console.log(`current entry=${JSON.stringify(entry)}`);
    if (entry) {
        app.listen(port, () => {
            console.log(`Started (port=${port})`);
        });
    } else {
        if (waiting > STARTUP_TIMEOUT) {
            throw Error('Could not receive data from Central Dogma');
        }

        console.log('waiting for receiving data from Central Dogma');

        waiting += RECEIVE_DATA_CHECK_INTERVAL;
        setTimeout(() => listen(), RECEIVE_DATA_CHECK_INTERVAL);
    }
};
setImmediate(() => {
    listen();
});
