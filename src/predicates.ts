import { ElementHandle, Page } from 'puppeteer';
import { pause } from './small';
import { waitFor } from './wait-for';
import * as pFilter from 'p-filter';

export const isElementFound = async (
  page: Page,
  selector: string,
): Promise<boolean> => {
  try {
    const element = await page.$(selector);
    return element !== null;
  } catch (error) {
    error.message = `Element with ${selector} is not found. Because of: ${error.message}`;
    throw error;
  }
};

export const isElementVisible = async (
  page: Page,
  selector: string,
): Promise<boolean> => {
  try {
    const element = await page.$(selector);
    const style = await page.evaluate(
      node => window.getComputedStyle((node as unknown) as Element),
      element,
    );
    const hasVisible = await hasVisibleBoundingBox(element);
    return style?.visibility !== 'hidden' && hasVisible;
  } catch (error) {
    error.message = `Element with ${selector} is not visible. Because of: ${error.message}`;
    throw error;
  }
};

export const hasVisibleBoundingBox = async (
  element: ElementHandle,
): Promise<boolean> => {
  const rect = await element.boundingBox();
  return rect !== null;
};

export const isUrlChangedAfterFn = async (
  page: Page,
  fn: () => Promise<void>,
): Promise<boolean> => {
  const url = await page.url();
  await fn();
  await pause(500);
  const newUrl = await page.url();
  return url !== newUrl;
};

export const isElementInteractableAfterFn = async (page: Page, selector: string, fn: () => Promise<void>) => {
  await fn();
  return await isElementInteractable(page, selector);
};

const isElementInteractable = async (
  page: Page,
  selector: string,
): Promise<boolean> => {
  try {
    await waitFor(
      () => isElementFound(page, selector),
      {
        timeout: 3000
      }
    );
    await waitFor(
      () => isElementVisible(page, selector),
      {
        timeout: 3000
      }
    );
  } catch (error) {
    return false;
  }
  return true
};

export const isReturnValueFromFindNotEmptyArray = async <T>(
  input: () => PromiseLike<Iterable<T | PromiseLike<T>>>,
  filterer: (element: T, index: number) => boolean | PromiseLike<boolean>,
  options?: pFilter.Options,
): Promise<boolean> => {
  const array = await input();
  const result = await pFilter(array, filterer, options);
  return result[0] !== undefined;
};
