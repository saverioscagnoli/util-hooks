/// <reference lib="webworker" />

import type { WorkerRequest, WorkerResponse } from "./worker-types";

type In = number[];
type Out = number;

self.onmessage = (e: MessageEvent<WorkerRequest<In>>) => {
  const { id, payload } = e.data;

  let msg: WorkerResponse<Out>;

  try {
    msg = { id, result: payload.reduce((a, b) => a + b, 0) };
  } catch (err) {
    msg = { id, error: String(err) };
  }

  self.postMessage(msg);
};

export {};
