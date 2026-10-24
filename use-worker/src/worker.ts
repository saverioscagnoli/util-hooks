import type { WorkerRequest, WorkerResponse } from "./worker-types";

// Runs inside the worker: answers each request from `useWorker` with the result of `fn`.
// `self` is typed as Window under the dom lib, but onmessage/postMessage line up.
function expose<T, R>(fn: (payload: T) => R | Promise<R>) {
  self.onmessage = async (e: MessageEvent<WorkerRequest<T>>) => {
    const { id, payload } = e.data;

    let msg: WorkerResponse<R>;

    try {
      msg = { id, result: await fn(payload) };
    } catch (err) {
      msg = { id, error: err instanceof Error ? err.message : String(err) };
    }

    self.postMessage(msg);
  };
}

export { expose };
