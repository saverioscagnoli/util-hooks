import { useCallback, useEffect, useRef, useState } from "react";
import type { WorkerRequest, WorkerResponse } from "./worker-types";

type Pending<R> = { resolve: (v: R) => void; reject: (e: unknown) => void };

function useWorker<T, R>(createWorker: () => Worker) {
  const workerRef = useRef<Worker | null>(null);
  const pending = useRef(new Map<number, Pending<R>>());
  const nextId = useRef<number>(0);
  const [running, setRunning] = useState<number>(0);

  useEffect(() => {
    let worker = createWorker();
    workerRef.current = worker;
    let map = pending.current;

    worker.onmessage = (e: MessageEvent<WorkerResponse<R>>) => {
      const { id } = e.data;
      let p = map.get(id);

      if (!p) return;

      map.delete(id);
      setRunning(n => n - 1);

      if (e.data.error !== undefined) p.reject(new Error(e.data.error));
      else p.resolve(e.data.result as R);
    };

    worker.onerror = e => {
      map.forEach(p => p.reject(e));
      map.clear();
      setRunning(0);
    };

    return () => {
      worker.terminate();
      map.forEach(p => p.reject(new Error("Worker terminated")));
      map.clear();
      workerRef.current = null;
    };
  }, []);

  const run = useCallback(
    (payload: T, transfer: Transferable[] = []): Promise<R> =>
      new Promise<R>((resolve, reject) => {
        let worker = workerRef.current;
        if (!worker) return reject(new Error("Worker not ready"));

        let id = nextId.current++;

        pending.current.set(id, { resolve, reject });
        setRunning(n => n + 1);

        let msg: WorkerRequest<T> = { id, payload };
        worker.postMessage(msg, transfer);
      }),
    []
  );

  return { run, busy: running > 0 } as const;
}

export { useWorker };
