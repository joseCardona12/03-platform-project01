
import { IResponseProjects } from "@/app/core/application/dto/common/projectResponseDto";
import { HttpClientUtils } from "../utils";
import { IProjectPaginationRequest } from "@/app/core/application/dto/common";
import { PProject } from "@/app/core/application/ports/projectPort";

export class ProjectsService implements PProject {
    private httpClient: HttpClientUtils;

    constructor() {
        this.httpClient = new HttpClientUtils();
    }

    async findAll({page,size}: IProjectPaginationRequest): Promise<IResponseProjects> {
        return this.httpClient.get<IResponseProjects>(`projects?page=${page}`);
    }
}