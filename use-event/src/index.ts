import { useEffect, RefObject, DependencyList } from "react";

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
 * Decides the type of the event in the callback function
 * based on the target element.
 * i.e. if the target is a window, it will have the `beforeunload` event
 * and if the target is a document, it will have the `visibilitychange` event.
 */
type EventMap<E extends Element, T extends Target<E>> = T extends Document
  ? DocumentEventMap
  : T extends Window
  ? WindowEventMap
  : T extends SVGElement
  ? SVGElementEventMap
  : HTMLElementEventMap;

/**
 * Glue type to combine the first two types
 */
type Callback<
  E extends Element,
  T extends Target<E>,
  K extends keyof EventMap<E, T>
> = (event: EventMap<E, T>[K]) => void;

/**
 *
 * A custom React hook that allows you to listen to events on a target element.
 * It can be used to listen to events on the document, window, or any HTML/SVG element.
 * @param target The target element to listen to events on. This can be a Document, Window, HTMLElement, SVGElement, or a RefObject pointing to one of these types.
 * @param name The name of the event to listen for. This should be a string representing the event type (e.g., "click", "keydown").
 * @param callback The callback function to be executed when the event is triggered. This function receives the event object as its argument.
 * @param dependencies An optional array of dependencies that will trigger the effect to re-run when changed. This is similar to the dependency array in React's useEffect hook.
 */
function useEvent<
  E extends Element,
  T extends Target<E>,
  K extends keyof EventMap<E, T>
>(
  target: T,
  name: K,
  callback: Callback<E, T, K>,
  dependencies: DependencyList = []
) {
  useEffect(() => {
    // Use an AbortController to clean up the event listener
    let controller = new AbortController();
    let signal = controller.signal;

    /// Check if the target is valid
    let element: EventTarget | null =
      target instanceof Element ||
      target instanceof Document ||
      target instanceof Window
        ? target
        : target.current;

    if (!element) {
      return;
    }

    (element as EventTarget).addEventListener(
      name as string,
      callback as EventListener,
      {
        signal
      }
    );

    // Cleanup
    return () => {
      controller.abort();
    };
  }, [target, name, callback, ...dependencies]);
}

export { useEvent };
