import { DependencyList, RefObject } from "react";
import { useEvent } from "@util-hooks/use-event";

/**
 * Function to remove diacritics from a string.
 * @param str The string to be deburred
 */
function deburr(str: string) {
  return str.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
}

/**
 * Lowercase typed keys.
 */
type Key =
  | "a"
  | "b"
  | "c"
  | "d"
  | "e"
  | "f"
  | "g"
  | "h"
  | "i"
  | "j"
  | "k"
  | "l"
  | "m"
  | "n"
  | "o"
  | "p"
  | "q"
  | "r"
  | "s"
  | "t"
  | "u"
  | "v"
  | "w"
  | "x"
  | "y"
  | "z"
  | "0"
  | "1"
  | "2"
  | "3"
  | "4"
  | "5"
  | "6"
  | "7"
  | "8"
  | "9"
  | "enter"
  | "escape"
  | "backspace"
  | "tab"
  | "space"
  | "insert"
  | "delete"
  | "home"
  | "end"
  | "pageup"
  | "pagedown"
  | "arrowup"
  | "arrowdown"
  | "arrowleft"
  | "arrowright"
  | "f1"
  | "f2"
  | "f3"
  | "f4"
  | "f5"
  | "f6"
  | "f7"
  | "f8"
  | "f9"
  | "f10"
  | "f11"
  | "f12"
  | "!"
  | "@"
  | "#"
  | "$"
  | "%"
  | "^"
  | "&"
  | "*"
  | "("
  | ")"
  | "-"
  | "_"
  | "="
  | "+"
  | "{"
  | "}"
  | "["
  | "]"
  | ";"
  | ":"
  | "'"
  | '"'
  | "<"
  | ">"
  | ","
  | "."
  | "/"
  | "?"
  | "\\"
  | "|"
  | "`"
  | "~";

/**
 * All the possible modifier keys.
 */
type Modifier = "alt" | "ctrl" | "meta" | "shift";

const MODIFIER_KEYS: Modifier[] = ["alt", "ctrl", "meta", "shift"];

/**
 * The target type for the event listener.
 * This is used to determine the type of the target element
 * while writing the function.
 */
type Target<T extends Element> =
  | Document
  | Window
  | HTMLElement
  | SVGElement
  | RefObject<T | null>;

/**
 *
 * @param target The target element to listen to events on. This can be a Document, Window, HTMLElement, SVGElement, or a RefObject pointing to one of these types.
 * @param modifiers The array of modifier keys to listen for. This should be an array of strings representing the modifier keys (e.g., ["ctrl", "shift"]).
 * @param key The key to listen for. This should be a string representing the key (e.g., "a", "enter").
 * @param callback The callback function to be executed when the event is triggered. This function receives the event object as its argument.
 * @param dependencies An optional array of dependencies that will trigger the effect to re-run when changed. This is similar to the dependency array in React's useEffect hook.
 */
function useHotkey<E extends Element, T extends Target<E>>(
  target: T,
  modifiers: Modifier[],
  key: Key,
  callback: (event: KeyboardEvent) => void,
  dependencies: DependencyList = []
) {
  useEvent(
    target,
    "keydown",
    event => {
      if (
        // Ensure that all specified modifiers are pressed
        modifiers.every(mod => event[`${mod}Key`]) &&
        // Ensure that no other modifiers are pressed
        // If this was not present, if the specified modifiers were `Ctrl`,
        // Then `Ctrl + Shift + A` would also trigger the callback
        MODIFIER_KEYS.every(
          mod => modifiers.includes(mod) || !event[`${mod}Key`]
        ) &&
        // Check if the key pressed matches the specified key
        deburr(event.key.toLowerCase()) === key
      ) {
        callback(event);
        return true;
      }
    },
    dependencies
  );
}

export { useHotkey };
