# React useEvent hook

With this hook, you can easily access events on any desired target in the DOM, and provide a custom callback to execute all of your misdeeds.

## Usage

You can pass any target you want, but in case you don't, the default target is the `document` element.

```tsx
import { useRef } from "react";
import { useEvent } from "@util-hooks/use-event";

const App = () => {
  // This will trigger any time the DOM is clicked.
  useEvent("click", evt => {
    evt.preventDefault();
    console.log("clicked on the document!");
  });

  return <div>Hello world!</div>;
};

export default App;
```

Usage with a target (ref):

```tsx
import { useRef } from "react";
import { useEvent } from "@util-hooks/use-event";

const App = () => {
  const wrapperRef = useRef<HTMLDivElement>(null);

  // This will trigger any time the orange div is clicked.
  useEvent(wrapperRef, "click", evt => {
    evt.preventDefault();
    console.log("clicked on the orange div!");
  });

  return (
    <div
      ref={wrapperRef}
      style={{
        width: "100px",
        height: "100px",
        backgroundColor: "orange"
      }}
    >
      Hello world!
    </div>
  );
};

export default App;
```

Or you can use the window:

```ts
// ...

useEvent(window, "beforeunload", evt => {
  console.log("The app is about to reload!!!!");
});

// ...
```

### Effect dependencies

Since this hook uses `useEffect` under the hood, if you have a state variable that you need to track, to prevent stale state,
you can pass a dependency list as you would do with a normal `useEffect`:

```tsx
import { useState, useRef } from "react";
import { useEvent } from "@util-hooks/use-event";

const App = () => {
  const [count, setCount] = useState<number>(0);
  const wrapperRef = useRef<HTMLDivElement>(null);

  const target = wrapperRef.current;

  // This will trigger any time the orange div is clicked.
  useEvent(
    target,
    "click",
    evt => {
      evt.preventDefault();
      setCount(count + 1);
      // Or, even better
      setCount(prev => prev + 1);
    },
    [count]
  );

  return (
    <div
      ref={wrapperRef}
      style={{
        width: "100px",
        height: "100px",
        backgroundColor: "orange"
      }}
    >
      {count}
    </div>
  );
};
```

## Types

| Type                                                                                                            | Description                                                                                                                                                 |
| --------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `Target<T extends Element>`                                                                                     | A union type that can be `Document`, `Window`, `Element`, or `RefObject<T>`.                                                                                |
| `EventMap<U extends Element, T extends Target<U>>`                                                              | A conditional type that maps to `DocumentEventMap` if `T` extends `Document`, `WindowEventMap` if `T` extends `Window`, or `HTMLElementEventMap` otherwise. |
| `Callback<U extends Element, T extends Target<U>, K extends keyof EventMap<U, T>, E extends EventMap<U, T>[K]>` | A function type that takes an event of type `E` and returns `void`. `E` is an event type from `EventMap<U, T>`.                                             |
| `DependencyList`                                                                                                | An array of dependencies for the `useEffect` hook. This is imported from `react`.                                                                           |
| `RefObject<T>`                                                                                                  | An object with a `current` property of type `T`. This is imported from `react`.                                                                             |
| `useEvent`                                                                                                      | A function that takes a target, event name, callback, and optional dependencies, and sets up an event listener on the target for the specified event.       |

## Thanks

the [tsup](https://www.npmjs.com/package/tsup) team, for making an awesome tool.

## License

MIT License © Saverio Scagnoli 2024.
