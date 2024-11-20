import { ILoginRequest, ILoginResponse } from "../dto/auth";


export interface PAuth {
    /**
     * @params req
     */
    login(req: ILoginRequest): Promise<ILoginResponse>
}