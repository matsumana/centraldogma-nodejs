import express, { Request, Response } from 'express';
import {
    CentralDogma,
    Entry,
    WatchResult,
} from '@matsumana/centraldogma-nodejs';

const baseURL = 'http://localhost:36462';
const project = 'project2';
const repo = 'repo2';
const filePath = '/test6.json';

// setup CentralDogma client
const centralDogma = new CentralDogma({
    baseURL,
});

// get a latest file from CentralDogma
let latestEntry: Entry;
(async () => {
    const [entry] = await centralDogma.content.getFile(project, repo, filePath);
    console.log(`entry=${JSON.stringify(entry)}`);
    latestEntry = entry;
})();

// start watching the file in CentralDogma
const emitter = centralDogma.watch.watchFile(project, repo, filePath);
emitter.on('data', (watchResult: WatchResult) => {
    console.log(`entry=${JSON.stringify(watchResult)}`);
    latestEntry = watchResult.entry;
});

// setup express
const port = process.env.PORT ?? 8080;
const app = express();
app.get('/', (_req: Request, res: Response) => {
    res.send('It works!');
});
app.get('/content', (_req: Request, res: Response) => {
    console.log(`latestEntry=${JSON.stringify(latestEntry)}`);
    res.send(latestEntry.content);
});
app.listen(port, () => {
    console.log(`Started (port=${port})`);
});
