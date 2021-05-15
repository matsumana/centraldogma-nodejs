import express, { Request, Response } from 'express';
import {
    CentralDogma,
    Entry,
    WatchResult,
} from '@matsumana/centraldogma-nodejs';

const baseURL = 'http://localhost:36462';
const project = 'project2';
const repo = 'repo2';
const path = '/test6.json';

// setup CentralDogma client
const centralDogma = new CentralDogma({
    baseURL,
});

let entry: Entry;

// start watching the file in CentralDogma
const emitter = centralDogma.watch.watchFile(project, repo, path);

emitter.on('data', (watchResult: WatchResult) => {
    console.log(`entry=${JSON.stringify(watchResult)}`);
    entry = watchResult.entry;
});

// setup express
const port = process.env.PORT ?? 8080;
const app = express();
app.get('/', (_req: Request, res: Response) => {
    res.send('It works!');
});
app.get('/content', (_req: Request, res: Response) => {
    console.log(`entry=${JSON.stringify(entry)}`);
    res.send(entry.content);
});

// listen
const listen = () => {
    console.log(`entry=${JSON.stringify(entry)}`);
    if (entry) {
        app.listen(port, () => {
            console.log(`Started (port=${port})`);
        });
    } else {
        console.log('waiting for receiving config from Central Dogma');
        setTimeout(() => listen(), 100);
    }
};
setImmediate(() => {
    listen();
});
