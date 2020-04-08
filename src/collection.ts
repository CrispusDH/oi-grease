import * as pFilter from 'p-filter';
import { isReturnValueFromFindNotEmptyArray } from './predicates';
import { waitFor } from './wait-for';

export const filterWithWaiting = async <T>(
  input: () => PromiseLike<Iterable<T | PromiseLike<T>>>,
  filterer: (element: T, index: number) => boolean | PromiseLike<boolean>,
  options?: pFilter.Options,
): Promise<Array<T>> => {
  await waitFor(
    () => isReturnValueFromFindNotEmptyArray(input, filterer, options),
    {
      message: 'findWithWaiting does not match any item',
    },
  );
  const array = await input();
  return pFilter(array, filterer, options);
};

export const findWithWaiting = async <T>(
  input: () => PromiseLike<Iterable<T | PromiseLike<T>>>,
  filterer: (element: T, index: number) => boolean | PromiseLike<boolean>,
  options?: pFilter.Options,
): Promise<T> => {
  await waitFor(
    () => isReturnValueFromFindNotEmptyArray(input, filterer, options),
    {
      message: 'findWithWaiting does not match any item',
    },
  );
  const array = await input();
  const result = await pFilter(array, filterer, options);
  return result[0];
};
