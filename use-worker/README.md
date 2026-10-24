# useWorker

A React hook to run heavy computations in a Web Worker and get the result back as a promise.

Moving work off the main thread usually means wiring up `postMessage`, matching responses to requests and cleaning up the worker by hand; this hook handles all of that, so calling a worker feels like calling an async function.

## Features

- Promise-based `run` function, with a `busy` flag for pending tasks
- Concurrent calls are matched to their own responses
- Errors thrown in the worker reject the matching promise
- Worker is created lazily on the first `run` and terminated on unmount
- Restarts automatically if the worker crashes
- Supports `Transferable` objects for zero-copy messages
- `expose` helper to write the worker side without boilerplate

## Installation

```sh
npm i @util-hooks/use-worker
```

```sh
yarn add @util-hooks/use-worker
```

```sh
pnpm add @util-hooks/use-worker
```

```sh
bun add @util-hooks/use-worker
```

## Usage

First, write the worker. `expose` takes a function (sync or async) and answers every `run` call with its result.

```ts
// sum.worker.ts
import { expose } from "@util-hooks/use-worker/worker";

export const sum = (nums: number[]) => nums.reduce((a, b) => a + b, 0);

expose(sum);
```

Then, call it from a component:

```tsx
import { useState } from "react";
import { useWorker } from "@util-hooks/use-worker";

function App() {
  const [total, setTotal] = useState<number>();

  // The generics are the payload type and the result type.
  // The `new URL(..., import.meta.url)` form is what lets bundlers
  // like Vite, webpack 5 and Parcel bundle the worker file.
  const { run, busy } = useWorker<number[], number>(
    () =>
      new Worker(new URL("./sum.worker.ts", import.meta.url), {
        type: "module"
      })
  );

  const onClick = async () => {
    try {
      setTotal(await run(Array.from({ length: 1e7 }, (_, i) => i)));
    } catch (err) {
      // Rejects if the worker throws, crashes or the component unmounts
      console.error(err);
    }
  };

  return (
    <div>
      <button onClick={onClick} disabled={busy}>
        {busy ? "Computing..." : "Sum 10 million numbers"}
      </button>
      <p>Total: {total ?? "-"}</p>
    </div>
  );
}
```

With transferables, to move large buffers without copying them:

```tsx
const { run } = useWorker<ArrayBuffer, number>(createWorker);

const buffer = new ArrayBuffer(1024 * 1024);

// `buffer` is moved to the worker and becomes unusable here
await run(buffer, [buffer]);
```

`expose` lives in its own `@util-hooks/use-worker/worker` entry, so React never ends up in the worker bundle.

A full example is available in the [`examples`](https://github.com/saverioscagnoli/util-hooks/tree/master/use-worker/examples) folder.

## License

MIT
