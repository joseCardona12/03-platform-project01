import { IRegisterResponse } from "@/app/core/application/dto/auth/registerResponseDto";
import HttpClientUtils from "../utils/httpClient";

export class RegisterService {
    private clientHttp: HttpClientUtils;

    constructor() {
        this.clientHttp = new HttpClientUtils();
    }

    public async register(req: FormData): Promise<IRegisterResponse>{
        const formData = true;
        return await this.clientHttp.post<IRegisterResponse, FormData>(
            "users",
            req,
            formData
        )
    }
}
  