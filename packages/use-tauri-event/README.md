# useTauriEvent hook

Define custom events and handlers for [Tauri](https://tauri.app/) events in React.

Tauri is a Rust - JS framework for building custom desktop and mobile apps using a Rust backend with a JS frontend.

Events in Tauri work as they do in the dom, or electron. Rust can emit events from the backend to the frontend, and you can handle them with this custom hook.

## Usage

```tsx
import { useTauriEvent } from "@util-hooks/use-tauri-event";
import { invoke } from "@tauri-apps/api";

const App = () => {
  const onClick = () => {
    // Invoke a method that will emit the event from the backend
    invoke("ping");
  };

  useTauriEvent<string>("pong", msg => {
    console.log("pong!");
  });

  return <button onClick={onClick}>Click to emit event!</button>;
};
```

Or you can pass any state variable to update the event when the state changes, as you would do in a `useEffect` hook.

```tsx
import { useTauriEvent } from "@util-hooks/use-tauri-event";
import { invoke } from "@tauri-apps/api";
import { useState } from "react";

const App = () => {
  const [count, setCount] = useState<number>(0);

  const onClick = () => {
    // Invoke a method that will emit the event from the backend
    invoke("ping");
  };

  useTauriEvent<string>(
    "pong",
    msg => {
      console.log("pong!");
    },
    [count]
  );

  return <button onClick={onClick}>Click to emit event!</button>;
};
```

## Custom type map

This package provides a builder method to create a custom `useTauriEvent` hook, that will follow the types that you pass it whiile building it.

- First, you have to define the custom type map like this:

```tsx
type CustomEventMap = {
  ping: { pongMessage: string };
  calcSize: number;
  // ...
};
```

- Then you can build the hook with the `buildMappedTauriEventHook`:

```tsx
import { buildMappedTauriEventHook } from "@util-hooks";

// You can choose a shorter name :)
const useCustomTauriHook = buildMappedTauriHook<CustomEventMap>();

const App = () => {
  // Here, "ping" and "calcSize" will be inferred, and the payload will have the value from the custom map
  useCustomTauriHook(
    "ping",
    payload => {
      // This will be valid
      console.log(payload.pongMessage); // => pong!
    },
    [
      /* you can still define state variables */
    ]
  );

  return <div>Hello, world!</div>;
};
```

## Thanks
the [tsup](https://www.npmjs.com/package/tsup) and the [tauri](https://tauri.app) teams, for making awesome Projects

## License

MIT License © Saverio Scagnoli 2024.
