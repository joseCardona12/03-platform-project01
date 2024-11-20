export interface IRegisterResponse {
    statusCode: number;
    message:    string;
    data:       DataRegister;
}

export interface DataRegister {
    email: string;
    name:  string;
    role:  string;
    photo: string | null;
    id:    number;
}