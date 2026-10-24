import type { WorkerRequest, WorkerResponse } from "./worker-types";

type ExposeContext<P> = { progress: (value: P) => void };

// Runs inside the worker: answers each request from `useWorker` with the result of `fn`.
// `self` is typed as Window under the dom lib, but onmessage/postMessage line up.
function expose<T, R, P = unknown>(
  fn: (payload: T, ctx: ExposeContext<P>) => R | Promise<R>
) {
  self.onmessage = async (e: MessageEvent<WorkerRequest<T>>) => {
    const { id, payload } = e.data;

    const progress = (value: P) => {
      let msg: WorkerResponse<R, P> = { id, progress: value };
      self.postMessage(msg);
    };

    let msg: WorkerResponse<R, P>;

    try {
      msg = { id, result: await fn(payload, { progress }) };
    } catch (err) {
      msg = { id, error: err instanceof Error ? err.message : String(err) };
    }

    self.postMessage(msg);
  };
}

export { expose };
export type { ExposeContext };
