import { useState } from "react";
import { useWorker } from "@util-hooks/use-worker";

function App() {
  const [total, setTotal] = useState<number>();
  const [error, setError] = useState<string>();

  // The URL form lets Vite, webpack 5 and Parcel bundle the worker file.
  const { run, busy } = useWorker<number[], number>(
    () =>
      new Worker(new URL("./sum.worker.ts", import.meta.url), {
        type: "module"
      })
  );

  const onClick = async () => {
    setError(undefined);

    try {
      setTotal(await run(Array.from({ length: 1e7 }, (_, i) => i)));
    } catch (err) {
      setError(String(err));
    }
  };

  return (
    <div>
      <button onClick={onClick} disabled={busy}>
        {busy ? "Computing..." : "Sum 10 million numbers"}
      </button>
      <p>Total: {total ?? "-"}</p>
      {error && <p>Error: {error}</p>}
    </div>
  );
}

export default App;
