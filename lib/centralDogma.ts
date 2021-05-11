import {
    CentralDogmaClient,
    CentralDogmaClientOptions,
} from './centralDogmaClient';
import { WatchService } from './watchService';
import { ContentService } from './contentService';
import { ProjectService } from './projectService';
import { RepositoryService } from './repositoryService';

export class CentralDogma {
    centralDogmaClient: CentralDogmaClient;
    projectService: ProjectService;
    repositoryService: RepositoryService;
    contentService: ContentService;
    watchService: WatchService;

    constructor(opts: CentralDogmaClientOptions) {
        this.centralDogmaClient = new CentralDogmaClient(opts);
        this.projectService = new ProjectService(this.centralDogmaClient);
        this.repositoryService = new RepositoryService(this.centralDogmaClient);
        this.contentService = new ContentService(this.centralDogmaClient);
        this.watchService = new WatchService(
            this.centralDogmaClient,
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
