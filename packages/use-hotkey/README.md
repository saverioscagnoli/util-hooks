# React useHotkey hook

With this hook, you can easily define custom hotkeys, even targeted ones, with ease.

## Usage

You can pass any target you want, but in case you don't, the default target is the `document` element.

```tsx
import { useHotkey, Modifier, Key } from "@util-hooks/use-hotkey";

const App = () => {
  // This will trigger when ctrl + a is pressed anywhere.
  useHotkey([Modifier.Ctrl], Key.KeyA, evt => {
    evt.preventDefault();
    console.log("ctrl + a pressed!!");
  });

  return <div>Hello world!</div>;
};

export default App;
```

Usage with a target (ref). The callback fires only if the element is focused.

```tsx
import { useRef } from "react";
import { useHotkey, Modifier, Key } from "@util-hooks/use-hotkey";

const App = () => {
  const wrapperRef = useRef<HTMLDivElement>(null);

  // This will trigger if the orange div is focused, and ctrl + shift + f is pressed.
  useHokey(wrapperRef, [Modifier.Ctrl, Modifier.Shift], Key.KeyF, evt => {
    evt.preventDefault();
    console.log("ctrl + shift + f pressed!! (wrapperRef is focused)");
  });

  return (
    <div
      ref={wrapperRef}
      style={{
        width: "100px",
        height: "100px",
        backgroundColor: "orange"
      }}
      tabIndex={-1}
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
// Only F2 is pressed.
useHotkey(window, [], Key.F2, evt => {
  console.log("Do you want to rename something?");
});

// ...
```

### Effect dependencies

Since this hook uses `useEffect` under the hood, if you have a state variable that you need to track, to prevent stale state,
you can pass a dependency list as you would do with a normal `useEffect`:

```tsx
import { useHotkey, Modifier, Key } from "@util-hooks/use-hotkey";

const App = () => {
  const [count, setCount] = useState<number>(0);

  // This will trigger when ctrl + arrowup is pressed.
  useHotkey(
    [Modifier.Ctrl],
    Key.ArrowUp
    evt => {
      evt.preventDefault();

      setCount(count + 1);
      // Or, even better
      setCount(prev => prev + 1);
    },
    [count]
  );

  // This will trigger when ctrl + arrowdown is pressed.
  useHotkey(
    [Modifier.Ctrl],
    Key.ArrowDown
    evt => {
      evt.preventDefault();

      setCount(count - 1);
      // Or, even better
      setCount(prev => prev - 1);
    },
    [count]
  );


  return (
    <div
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

You can import the Modifier and Key enums, which are basically the string representation of the keys.

## Thanks

the [tsup](https://www.npmjs.com/package/tsup) team, for making an awesome tool.

## License

MIT License © Saverio Scagnoli 2024.
