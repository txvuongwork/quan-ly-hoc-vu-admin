export interface IResponseError {
  message: string;
  status: number;
}

export type IResponse<T> =
  | {
      body: T;
      ok: true;
    }
  | {
      ok: false;
      error: IResponseError;
    };

export interface IListResponse<T> {
  totalPages: number;
  totalElements: number;
  items: T[];
  pageSize: number;
  currentPage: number;
}
