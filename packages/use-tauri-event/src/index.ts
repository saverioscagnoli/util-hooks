import { EventName, listen } from "@tauri-apps/api/event";
import { DependencyList, useEffect } from "react";

function useTauriEvent<T>(
  name: EventName,
  cb: (payload: T) => void,
  deps: DependencyList = []
) {
  useEffect(() => {
    const promise = listen<T>(name, evt => cb(evt.payload));

    return () => {
      promise.then(unlisten => unlisten());
    };
  }, deps);
}

type CombinedEventMap<T> = T & { [K in EventName]?: unknown };

function buildMappedTauriEventHook<T extends object>() {
  return <K extends keyof CombinedEventMap<T>>(
    name: K,
    cb: (payload: CombinedEventMap<T>[K]) => void,
    deps: DependencyList = []
  ) => {
    useTauriEvent<CombinedEventMap<T>>(
      name.toString(),
      cb as (payload: T) => void,
      deps
    );
  };
}

export { useTauriEvent, buildMappedTauriEventHook };
