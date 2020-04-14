import * as pFilter from 'p-filter';
import { isReturnValueFromFindNotEmptyArray } from './predicates';
import { waitFor } from './wait-for';

export const filterWithWaiting = async <T>(
  input: () => PromiseLike<Iterable<T | PromiseLike<T>>>,
  filterer: (element: T, index: number) => boolean | PromiseLike<boolean>,
  filterOptions?: FilterOptions,
): Promise<Array<T>> => {
  await waitFor(
    () => isReturnValueFromFindNotEmptyArray(input, filterer, filterOptions),
    {
      message: 'findWithWaiting does not match any item',
      timeout: filterOptions?.timeout,
    },
  );
  const array = await input();
  return pFilter(array, filterer, filterOptions);
};

export const findWithWaiting = async <T>(
  input: () => PromiseLike<Iterable<T | PromiseLike<T>>>,
  filterer: (element: T, index: number) => boolean | PromiseLike<boolean>,
  filterOptions?: FilterOptions,
): Promise<T> => {
  await waitFor(
    () => isReturnValueFromFindNotEmptyArray(input, filterer, filterOptions),
    {
      message: 'findWithWaiting does not match any item',
      timeout: filterOptions?.timeout,
    },
  );
  const array = await input();
  const result = await pFilter(array, filterer, filterOptions);
  return result[0];
};

interface FilterOptions  extends pFilter.Options{
  timeout: number
}
