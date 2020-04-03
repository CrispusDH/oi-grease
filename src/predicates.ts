import { ElementHandle, Page } from 'puppeteer';
import { pause } from './small';

export const isElementFound = async (
  page: Page,
  selector: string,
): Promise<boolean> => {
  const element = await page.$(selector);
  return element !== null;
};

export const isElementVisible = async (
  page: Page,
  selector: string,
): Promise<boolean> => {
  const element = await page.$(selector);
  const style = await page.evaluate(
    node => window.getComputedStyle((node as unknown) as Element),
    element,
  );
  const hasVisible = await hasVisibleBoundingBox(element);
  return style && style.visibility !== 'hidden' && hasVisible;
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
) => {
  const url = await page.url();
  await fn();
  await pause(500);
  const newUrl = await page.url();
  return url !== newUrl;
};
