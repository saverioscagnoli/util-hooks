import { useCallback, useEffect, useRef, useState } from "react";
import type { WorkerRequest, WorkerResponse } from "./worker-types";

type Pending<R> = { resolve: (v: R) => void; reject: (e: unknown) => void };

function useWorker<T, R>(createWorker: () => Worker) {
  const workerRef = useRef<Worker | null>(null);
  const pending = useRef(new Map<number, Pending<R>>());
  const nextId = useRef(0);
  const factory = useRef(createWorker);
  const [running, setRunning] = useState(0);

  factory.current = createWorker;

  const failAll = useCallback((err: Error) => {
    pending.current.forEach(p => p.reject(err));
    pending.current.clear();
    setRunning(0);
  }, []);

  const getWorker = useCallback(() => {
    if (workerRef.current) return workerRef.current;

    let worker = factory.current();
    let map = pending.current;

    worker.onmessage = (e: MessageEvent<WorkerResponse<R>>) => {
      let p = map.get(e.data.id);
      if (!p) return;

      map.delete(e.data.id);
      setRunning(n => n - 1);

      if (e.data.error !== undefined) p.reject(new Error(e.data.error));
      else p.resolve(e.data.result as R);
    };

    worker.onerror = e => {
      worker.terminate();
      workerRef.current = null;
      failAll(new Error(e.message || "Worker error"));
    };

    worker.onmessageerror = () =>
      failAll(new Error("Failed to deserialize worker message"));

    workerRef.current = worker;
    return worker;
  }, [failAll]);

  useEffect(
    () => () => {
      workerRef.current?.terminate();
      workerRef.current = null;
      failAll(new Error("Worker terminated"));
    },
    [failAll]
  );

  const run = useCallback(
    (payload: T, transfer: Transferable[] = []): Promise<R> =>
      new Promise<R>((resolve, reject) => {
        let id = nextId.current++;
        let msg: WorkerRequest<T> = { id, payload };

        pending.current.set(id, { resolve, reject });
        setRunning(n => n + 1);

        try {
          getWorker().postMessage(msg, transfer);
        } catch (err) {
          pending.current.delete(id);
          setRunning(n => n - 1);
          reject(err);
        }
      }),
    [getWorker]
  );

  return { run, busy: running > 0 } as const;
}

export { useWorker };
export * from "./worker-types";
