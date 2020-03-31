import { pollTime, timeout } from './constants';

export const waitFor = async (
  predicate: Predicate,
  options?: Partial<WaitOptions>,
) => {
  const defaultOptions: WaitOptions = {
    timeout,
    message: '',
    pollTime,
  };
  const mergedOptions = { ...defaultOptions, ...options };
  const start = now();
  await evaluatePredicate(predicate, start, mergedOptions);
};

const evaluatePredicate = async (
  predicate: Predicate,
  start: number,
  { timeout, pollTime, message }: WaitOptions,
) => {
  const elapsed = now() - start;
  try {
    const result = await predicate();
    if (result) {
      return;
    }
  } catch (error) {
    if (elapsed >= timeout) {
      error.message = `${error.message}. ${message}`;
      throw error;
    }
    await tick(pollTime, evaluatePredicate, predicate, start, {
      timeout,
      pollTime,
      message,
    });
  }
  if (elapsed >= timeout) {
    throw new Error(`Wait timed out after ${elapsed}ms. ${message}`);
  }
  await tick(pollTime, evaluatePredicate, predicate, start, {
    timeout,
    pollTime,
    message,
  });
};

const tick = async (pollTime, fn, ...args): Promise<void> => {
  await pause(pollTime);
  await fn(...args);
};

const now = (): number => Date.now();
const pause = async (ms: bigint): Promise<void> => {
  return new Promise(resolve => setTimeout(resolve, Number(ms)));
};

type Predicate = () => boolean | Promise<boolean>;

export interface WaitOptions {
  timeout: number;
  message: string;
  pollTime: number;
}
