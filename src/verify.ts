import { Page } from 'puppeteer';
import { waitFor } from './wait-for';
import { isElementNotDisabled, isElementFound, isElementVisible } from './predicates';

export const checkElementIsInteractable = async (
  page: Page,
  selector: string,
): Promise<void> => {
  await waitFor(() => isElementFound(page, selector), {
    message: `Element with selector: "${selector}" was not found`,
  });
  await waitFor(() => isElementVisible(page, selector), {
    message: `Element with selector: "${selector}" was not visible, but found`,
  });
  await waitFor(() => isElementNotDisabled(page, selector), {
    message: `Element with selector: "${selector}" was disabled, but found and visible`,
  });
};
