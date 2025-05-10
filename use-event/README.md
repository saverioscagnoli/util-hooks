# useEvent

A React hook to add and remove event listeners without the boilerplate.

Very often I found myself to write some sort of hook to use event listeners associated with
the window, document, or refs; so I decide to write a little but useful hook that combines the logic for most of the elements.

## Features

- Type-safe event mapping based on target element
- Supports `Document`, `Window`, `HTMLElement`, `SVGElement`, or `RefObject`
- Automatically cleans up with `AbortController`
- Dependency-aware reactivity (like `useEffect`)

## Installation

Choose your package manager:

```sh
npm i @util-hooks/use-event
```

```sh
yarn add @util-hooks/use-event
```

```sh
pnpm add @util-hooks/use-event
```

```sh
bun add @util-hooks/use-event
```

## Usage

First, you need to decide the target element.

```tsx
import { useEvent } from "@util-hooks/use-event";

function App() {
  // This will prevent the browser context menu from showing
  // Useful for creating custom menus
  useEvent(window, "contextmenu", event => {
    event.preventDefault();
  });

  return (
    <div>
      <p>...</p>
    </div>
  );
}
```

With effect dependencies:

```tsx
import { useState } from "react";
import { useEvent } from "@util-hooks/use-event";

function App() {
  const [count, setCount] = useState<number>(0);
  const buttonRef = useRef<HTMLButtonElement>(null);

  // The `count` dependency ensure that the count value inside the callback
  // stays up-to-date; if not inserted, it will log the first value even when increased,
  // becoming stagnant.
  useEvent(
    buttonRef,
    "click",
    () => {
      console.log(count);
    },
    [count]
  );

  return (
    <div>
      <button onClick={() => setCount(c => c + 1)}>
        Click to increase: {count}
      </button>
    </div>
  );
}
```

## License

MIT
