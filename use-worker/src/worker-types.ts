export type WorkerRequest<T> = { id: number; payload: T };
export type WorkerResponse<R> =
  | { id: number; result: R; error?: undefined }
  | { id: number; error: string; result?: undefined };
