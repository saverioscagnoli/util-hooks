import { DependencyList } from "react";
import { Modifier, Key } from "./enums";
// @ts-ignore
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

function useHotkey<U extends Element, T extends Target<U>>(
  modsOrTarget: T | Modifier[],
  keyOrMods: Key | Modifier[],
  cbOrKey: ((evt: KeyboardEvent) => void) | Key,
  depsOrCb?: DependencyList | ((evt: KeyboardEvent) => void)
) {
  const [mods, key, cb, deps] = Array.isArray(modsOrTarget)
    ? [
        modsOrTarget,
        keyOrMods as Key,
        cbOrKey as (evt: KeyboardEvent) => void,
        depsOrCb as DependencyList
      ]
    : [
        keyOrMods as Modifier[],
        cbOrKey as (evt: KeyboardEvent) => void,
        depsOrCb as DependencyList
      ];

  const target = Array.isArray(modsOrTarget) ? 
  document : modsOrTarget;

  useEvent(
    target,
    "keydown",
    // @ts-ignore
    e => {
      if (mods.every(mod => e[mod]) && deburr(e.key.toLowerCase()) === key) {
        cb(e);
      }
    },
    deps
  );
}

export { useHotkey, Modifier, Key };
