import { HttpClient } from './internal/httpClient';
import { WatchService } from './watchService';
import { ContentService } from './contentService';
import { ProjectService } from './projectService';
import { RepositoryService } from './repositoryService';

export class CentralDogma {
    private readonly httpClient: HttpClient;
    projectService: ProjectService;
    repositoryService: RepositoryService;
    contentService: ContentService;
    watchService: WatchService;

    constructor(opts: CentralDogmaClientOptions) {
        this.httpClient = new HttpClient(opts);
        this.projectService = new ProjectService(this.httpClient);
        this.repositoryService = new RepositoryService(this.httpClient);
        this.contentService = new ContentService(this.httpClient);
        this.watchService = new WatchService(
            this.httpClient,
            this.contentService
        );
    }

    get project() {
        return this.projectService;
    }

    get repository() {
        return this.repositoryService;
    }

    get content() {
        return this.contentService;
    }

    get watch() {
        return this.watchService;
    }
}

export type CentralDogmaClientOptions = {
    baseURL: string;
    token?: string;
};
