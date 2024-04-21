import { KeyboardEventHandler } from "react";
import {  Modifier ,Key} from "./enums";

function useHotkey<T extends Element>(
  modifiers: Modifier[],
  key: Key,
  cb: KeyboardEventHandler<T>
) {

    document.addEventListener("keydown", (e) => {
        e.
    });

}
