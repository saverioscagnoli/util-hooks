# useHotkey

A React hook for registering keyboard shortcuts with optional modifier keys.

This hook builds on top of [`useEvent`](https://www.npmjs.com/package/@util-hooks/use-event) to provide a clean and declarative way to handle hotkeys across elements, supporting key modifiers and cleanup out of the box.

## Features

- Modifier hotkey handling (`Ctrl`, `Shift`, `Alt`, `Meta`)
- Type-enhanced keys and modifiers
- Supports `Document`, `Window`, `HTMLElement`, `SVGElement`, or `RefObject`
- Deburrs accented keys for consistent matching
- Dependency-aware reactivity (like `useEffect`)

## Installation

```sh
npm i @util-hooks/use-hotkey
```

```sh
yarn add @util-hooks/use-hotkey
```

```sh
pnpm add @util-hooks/use-hotkey
```

```sh
bun add @util-hooks/use-hotkey
```

## Usage

Basic usage with `window`:

```tsx
import { useHotkey } from "@util-hooks/use-hotkey";

function App() {
  useHotkey(window, ["ctrl", "shift"], "k", event => {
    event.preventDefault();
    alert("You pressed Ctrl + Shift + K!");
  });

  return <p>Press Ctrl + Shift + K</p>;
}
```

Using with `ref` and dependencies:

```tsx
import { useRef, useState } from "react";
import { useHotkey } from "@util-hooks/use-hotkey";

function App() {
  const divRef = useRef<HTMLDivElement>(null);
  const [count, setCount] = useState(0);

  // The `count` dependency ensure that the count value inside the callback
  // stays up-to-date; if not inserted, it will log the first value even when increased,
  // becoming stagnant.
  useHotkey(
    divRef,
    ["alt"],
    "arrowup",
    () => {
      setCount(count + 1);
    },
    [count]
  );

  return (
    <div ref={divRef} tabIndex={0} style={{ outline: "none" }}>
      <p>Press Alt + ↑ inside this box</p>
      <p>Count: {count}</p>
    </div>
  );
}
```

## Supported Keys

Includes alphanumerics, punctuation, and common control keys like:

- `"enter"`, `"escape"`, `"tab"`, `"backspace"`
- `"arrowup"`, `"arrowdown"`, `"arrowleft"`, `"arrowright"`
- `"f1"` to `"f12"`, `"delete"`, `"home"`, `"end"`, etc.
- Symbols: `"!"`, `"@"`, `"#"`, etc.

## License

MIT
