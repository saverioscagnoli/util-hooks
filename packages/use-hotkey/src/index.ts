import { DependencyList } from "react";
import { Modifier, Key } from "./enums";
import { Target, useEvent } from "@util-hooks/use-event";

function deburr(str: string) {
  return str.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
}

function useHotkey(
  mods: Modifier[],
  key: Key,
  cb: (evt: KeyboardEvent) => void,
  deps?: DependencyList
): void;

function useHotkey<U extends Element, T extends Target<U>>(
  target: T,
  mods: Modifier[],
  key: Key,
  cb: (evt: KeyboardEvent) => void,
  deps?: DependencyList
): void;

function useHotkey(
  key: Key,
  cb: (evt: KeyboardEvent) => void,
  deps?: DependencyList
): void;

function useHotkey<U extends Element, T extends Target<U>>(
  modsOrTargetOrKey: T | Modifier[] | Key,
  keyOrModsOrCb: Key | Modifier[] | ((evt: KeyboardEvent) => void),
  cbOrKeyOrDeps?: ((evt: KeyboardEvent) => void) | Key | DependencyList,
  depsOrCbOrNothing?: DependencyList | ((evt: KeyboardEvent) => void)
) {
  let mods: Modifier[],
    key: Key,
    cb: (evt: KeyboardEvent) => void,
    deps: DependencyList | undefined;
  let target: T | Document;

  if (typeof modsOrTargetOrKey === "string") {
    mods = [];
    key = modsOrTargetOrKey;
    cb = keyOrModsOrCb as (evt: KeyboardEvent) => void;
    deps = cbOrKeyOrDeps as DependencyList;
    target = document;
  } else if (Array.isArray(modsOrTargetOrKey)) {
    mods = modsOrTargetOrKey;
    key = keyOrModsOrCb as Key;
    cb = cbOrKeyOrDeps as (evt: KeyboardEvent) => void;
    deps = depsOrCbOrNothing as DependencyList;
    target = document;
  } else {
    target = modsOrTargetOrKey;
    mods = keyOrModsOrCb as Modifier[];
    key = cbOrKeyOrDeps as Key;
    cb = depsOrCbOrNothing as (evt: KeyboardEvent) => void;
  }

  useEvent(
    target,
    "keydown",
    e => {
      if (mods.every(mod => e[mod]) && deburr(e.key.toLowerCase()) === key) {
        cb(e);
        return true;
      }
    },
    deps
  );
}

export { useHotkey, Modifier, Key };
