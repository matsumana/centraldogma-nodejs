import { HttpClient } from './internal/httpClient';
import { WatchService } from './service/watchService';
import { ContentService } from './service/contentService';
import { ProjectService } from './service/projectService';
import { RepositoryService } from './service/repositoryService';

export class CentralDogma {
    private readonly httpClient: HttpClient;
    private readonly projectService: ProjectService;
    private readonly repositoryService: RepositoryService;
    private readonly contentService: ContentService;
    private readonly watchService: WatchService;

    constructor(opts: CentralDogmaOptions) {
        this.httpClient = new HttpClient(opts);
        this.projectService = new ProjectService(this.httpClient);
        this.repositoryService = new RepositoryService(this.httpClient);
        this.contentService = new ContentService(this.httpClient);
        this.watchService = new WatchService(
            this.httpClient,
            this.contentService,
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

export type CentralDogmaOptions = {
    baseURL: string;
    token?: string;
};
