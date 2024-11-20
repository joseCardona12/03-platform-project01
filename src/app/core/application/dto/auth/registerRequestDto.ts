export interface IRegisterRequest {
    email: string;
    password: string;
    name: string;
    role: string;
    photo?: File | null;
  }