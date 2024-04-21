import { DependencyList, RefObject, useEffect } from "react";

type Target<T extends Element> = Document | Window | Element | RefObject<T>;

function isRefObject(target: any): target is RefObject<HTMLElement> {
  return target && target.current !== undefined;
}

type EventMap<U extends Element, T extends Target<U>> = T extends Document
  ? DocumentEventMap
  : T extends Window
  ? WindowEventMap
  : HTMLElementEventMap;

type Callback<
  U extends Element,
  T extends Target<U>,
  K extends keyof EventMap<U, T>,
  E extends EventMap<U, T>[K]
> = (evt: E) => void;

function useEvent<
  U extends Element,
  T extends Target<U>,
  K extends keyof EventMap<U, T>,
  E extends EventMap<U, T>[K]
>(
  target: T,
  name: K,
  cb: Callback<U, T, K, E>,
  deps?: DependencyList
): Target<U>;

function useEvent<U extends Element, K extends keyof DocumentEventMap>(
  name: K,
  cb: (evt: DocumentEventMap[K]) => void,
  deps?: DependencyList
): Target<U>;

function useEvent<U extends Element, K extends keyof WindowEventMap>(
  name: K,
  cb: (evt: WindowEventMap[K]) => void,
  deps?: DependencyList
): Target<U>;

function useEvent<U extends Element, K extends keyof HTMLElementEventMap>(
  name: K,
  cb: (evt: HTMLElementEventMap[K]) => void,
  deps?: DependencyList
): Target<U>;

function useEvent<
  U extends Element,
  T extends Target<U>,
  K extends keyof EventMap<U, T>,
  E extends EventMap<U, T>[K]
>(
  targetOrName: T | K | null,
  nameOrCb: K | Callback<U, T, K, E>,
  cbOrDeps?: Callback<U, T, K, E> | DependencyList,
  deps?: DependencyList
) {
  let target: T | Document;
  let name: K;
  let cb: Callback<U, T, K, E>;
  let dependencies: DependencyList;

  if (deps !== undefined) {
    target = targetOrName as T;
    name = nameOrCb as K;
    cb = cbOrDeps as Callback<U, T, K, E>;
    dependencies = deps;
  } else if (typeof nameOrCb === "function") {
    target = document;
    name = targetOrName as K;
    cb = nameOrCb as Callback<U, T, K, E>;
    dependencies = (cbOrDeps as DependencyList) || [];
  } else {
    target = targetOrName as T;
    name = nameOrCb as K;
    cb = cbOrDeps as Callback<U, T, K, E>;
    dependencies = [];
  }

  useEffect(() => {
    if (isRefObject(target) && target.current !== null) {
      target.current.addEventListener(name as string, cb as EventListener);

      return () => {
        if (target.current !== null) {
          target.current.removeEventListener(
            name as string,
            cb as EventListener
          );
        }
      };
    }
  }, [target, ...dependencies]);

  return target;
}

export { useEvent };
export type { Target, EventMap, Callback };
