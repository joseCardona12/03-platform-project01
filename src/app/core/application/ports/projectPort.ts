import { IProjectPaginationRequest } from "../dto/common";
import { IResponseProjects } from "../dto/common/projectResponseDto";

export interface PProject{
    findAll({page,size}: IProjectPaginationRequest): Promise<IResponseProjects>
}