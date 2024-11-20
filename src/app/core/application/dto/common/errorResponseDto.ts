export interface IErrorResponse {
  status: string;
  code: number;
  errors: IFieldError[] | { message: string }[];
}

export interface IFieldError {
  field: string;
  error: string;
}