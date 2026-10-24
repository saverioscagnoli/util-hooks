import { expose } from "@util-hooks/use-worker/worker";

// Deliberately heavy work that would freeze the UI on the main thread.
export const sum = (nums: number[]) => nums.reduce((a, b) => a + b, 0);

expose(sum);
