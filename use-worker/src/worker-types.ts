export type WorkerRequest<T> = { id: number; payload: T };
export type WorkerResponse<R, P = unknown> =
  | { id: number; result: R; error?: undefined; progress?: undefined }
  | { id: number; error: string; result?: undefined; progress?: undefined }
  | { id: number; progress: P; result?: undefined; error?: undefined };
