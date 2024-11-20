import { PAuth } from "@/app/core/application/ports/auth.port";
import HttpClientUtils from "../utils/httpClient";
import { ILoginRequest, ILoginResponse } from "@/app/core/application/dto/auth";

export default class AuthService implements PAuth {
    private clientHttp: HttpClientUtils
    private basePath: string = "auth";

    constructor(){
        this.clientHttp = new HttpClientUtils();

    }
    public register(formData: FormData) {
        throw new Error("Method not implemented.");
    }
 
    public async login(req: ILoginRequest): Promise<ILoginResponse> {
        return this.clientHttp.post<ILoginResponse, ILoginRequest> (
            `${this.basePath}/login`,
            req
        )
    }
}