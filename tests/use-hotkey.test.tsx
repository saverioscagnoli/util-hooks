import { expect, it, describe, vitest } from "vitest";
import { renderHook } from "@testing-library/react";
import { act } from "react";
import { Key, Modifier, useHotkey } from "../packages/use-hotkey/dist";

describe("useHotkey", () => {
  it("should be fired when the hotkey is pressed", () => {
    const mockFn = vitest.fn();

    renderHook(() => useHotkey([Modifier.Ctrl], Key.KeyA, mockFn));

    act(() => {
      const hotkey = new KeyboardEvent("keydown", {
        key: "a",
        ctrlKey: true
      });

      document.dispatchEvent(hotkey);
    });

    expect(mockFn).toHaveBeenCalled();

    act(() => {
      const hotkey = new KeyboardEvent("keydown", {
        key: "a",
        ctrlKey: false
      });

      document.dispatchEvent(hotkey);
    });

    expect(mockFn).toHaveBeenCalledTimes(1);

    act(() => {
      const hotkey = new KeyboardEvent("keydown", {
        key: "a",
        ctrlKey: true
      });

      document.dispatchEvent(hotkey);
    });

    expect(mockFn).toHaveBeenCalledTimes(2);
  });

  it("should be fired when the hotkey is pressed without modifiers", () => {
    const mockFn = vitest.fn();

    renderHook(() => useHotkey(Key.KeyA, mockFn));

    act(() => {
      const hotkey = new KeyboardEvent("keydown", {
        key: "a"
      });

      document.dispatchEvent(hotkey);
    });

    expect(mockFn).toHaveBeenCalled();
  });

  it("should be fired where there is a hotkey that includes another hotkey", () => {
    const mockFn = vitest.fn();

    renderHook(() => {
      useHotkey([Modifier.Ctrl], Key.KeyA, mockFn);
      useHotkey([Modifier.Ctrl, Modifier.Shift], Key.KeyA, mockFn);
      useHotkey(
        [Modifier.Ctrl, Modifier.Shift, Modifier.Alt],
        Key.KeyA,
        mockFn
      );
    });

    act(() => {
      const hotkey = new KeyboardEvent("keydown", {
        key: "a",
        ctrlKey: true,
        shiftKey: true
      });

      document.dispatchEvent(hotkey);
    });

    expect(mockFn).toHaveBeenCalledTimes(1);
  });

  it("should handle complex hotkeys", () => {
    const mockFn = vitest.fn();

    renderHook(() => {
      useHotkey([Modifier.Ctrl], Key.KeyA, mockFn);
      useHotkey([Modifier.Ctrl, Modifier.Shift], Key.KeyA, mockFn);
      useHotkey(
        [Modifier.Ctrl, Modifier.Shift, Modifier.Alt],
        Key.KeyA,
        mockFn
      );
    });

    act(() => {
      const hotkey = new KeyboardEvent("keydown", {
        key: "a",
        ctrlKey: true,
        shiftKey: true,
        altKey: true
      });

      const hotkey2 = new KeyboardEvent("keydown", {
        key: "a",
        ctrlKey: true,
        shiftKey: true
      });

      document.dispatchEvent(hotkey);
      document.dispatchEvent(hotkey2);
    });

    expect(mockFn).toHaveBeenCalledTimes(2);
  });

  it("should handle multiple hotkeys instances", () => {
    const mockFn = vitest.fn();

    renderHook(() => {
      useHotkey([Modifier.Ctrl], Key.KeyA, mockFn);
      useHotkey([Modifier.Ctrl], Key.KeyA, mockFn);
    });

    act(() => {
      const hotkey = new KeyboardEvent("keydown", {
        key: "a",
        ctrlKey: true
      });

      document.dispatchEvent(hotkey);
    });

    expect(mockFn).toHaveBeenCalledTimes(2);
  });

  it("should handle accented characters", () => {
    const mockFn = vitest.fn();

    renderHook(() => useHotkey(Key.KeyA, mockFn));

    act(() => {
      const hotkey = new KeyboardEvent("keydown", {
        key: "á"
      });

      document.dispatchEvent(hotkey);
    });

    expect(mockFn).toHaveBeenCalled();
  });

  it("should handle uppercase characters", () => {
    const mockFn = vitest.fn();

    renderHook(() => useHotkey(Key.KeyA, mockFn));

    act(() => {
      const hotkey = new KeyboardEvent("keydown", {
        key: "A"
      });

      document.dispatchEvent(hotkey);
    });

    expect(mockFn).toHaveBeenCalled();
  });
});
