import { ElementHandle, Page } from 'puppeteer';
import { pause } from './small';

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
  await pause(300);
  return await isElementInteractable(page, selector);
};

export const isElementInteractable = async (
  page: Page,
  selector: string,
): Promise<boolean> => {
  try {
    const found = await isElementFound(page, selector);
    if (!found) {
      return false;
    }
    const visible = await isElementVisible(page, selector);
    if (!visible) {
      return false;
    }
  } catch (error) {
    return false;
  }
  return true
};
