import { Page, ElementHandle } from 'puppeteer-core';
import { pause } from './small';
import { Predicate, waitFor } from './wait-for';
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
      (node) => window.getComputedStyle((node as unknown) as Element),
      element,
    );
    const hasVisible = await hasVisibleBoundingBox(element);
    return style?.visibility !== 'hidden' && style?.display !== 'none' && style?.opacity !== '0' && hasVisible;
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

export const isElementInteractableAfterFn = async (
  page: Page,
  selector: string,
  fn: () => Promise<void>
): Promise<boolean> => {
  await fn();
  try {
    await waitFor(
      () => isElementInteractable(page, selector),
      {
        timeout: 3000,
      }
    );
    return true;
  } catch {
    return false;
  }
};

export const isPredicateResolveAfterFn = async (predicate: Predicate, fn: () => Promise<void>): Promise<boolean> => {
  await fn();
  try {
    await waitFor(
      predicate,
      {
        timeout: 3000,
      }
    );
    return true;
  } catch {
    return false;
  }
};

export const isElementInteractable = async (
  page: Page,
  selector: string,
): Promise<boolean> => {
  const isFound = await isElementFound(page, selector);
  if (!isFound) {
    return false;
  }
  const isVisible = await isElementVisible(page, selector);
  if (!isVisible) {
    return false;
  }
  const isDisabled = await isElementNotDisabled(page, selector);
  if (!isDisabled) {
    return false;
  }
  return true;
};

export const isElementNotDisabled = async (
  page: Page,
  selector: string,
): Promise<boolean> => {
  return page.$eval(
    selector,
    (node) => {
      const hasAttribute = node.hasAttribute('disabled');
      return !hasAttribute;
    });
};

export const isElementDisabled = async (
  page: Page,
  selector: string,
): Promise<boolean> => {
  return page.$eval(
    selector,
    (node) => {
      return node.hasAttribute('disabled');
    });
};

export const isReturnValueFromFindNotEmptyArray: <T>(
  input: () => PromiseLike<Iterable<T | PromiseLike<T>>>,
  filterer: (element: T, index: number) => boolean | PromiseLike<boolean>,
  options?: pFilter.Options,
) => Promise<boolean> = async <T> (
  input: () => PromiseLike<Iterable<T | PromiseLike<T>>>,
  filterer: (element: T, index: number) => boolean | PromiseLike<boolean>,
  options?: pFilter.Options,
): Promise<boolean> => {
  const array = await input();
  const result = await pFilter(array, filterer, options);
  return result[0] !== undefined;
};
