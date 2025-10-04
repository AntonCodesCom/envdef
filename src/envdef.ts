import { parseDefItem } from './parseDefItem';
import { EnvDefError, type EnvDefErrorMessage } from './errors';
import { EnvDefItem, type HasDuplicates } from './types';

export function envdef<
  T extends readonly EnvDefItem<string>[],
  Names = T[number]['name'],
  D extends boolean = HasDuplicates<T>,
>(
  defs: D extends true
    ? ["❌ Duplicate 'name' values are not allowed"] & T // error if duplicates
    : T,
  source: object = process.env,
): { [K in Names & string]: string } {
  const errorMessages: EnvDefErrorMessage[] = [];
  const keyValue = defs.map((x) => {
    try {
      const result = parseDefItem(x, source);
      return {
        name: x.name,
        result,
      };
    } catch (err) {
      const message =
        err instanceof Error
          ? err.message
          : 'Unexpected error occurred while parsing environment variables.';
      errorMessages.push({
        name: x.name,
        message,
      });
      return {
        name: x.name,
        result: 'ERROR',
      };
    }
  });
  if (errorMessages.length > 0) {
    throw new EnvDefError(errorMessages);
  }
  return keyValue.reduce<{ [K in T[number]['name']]: string }>(
    (acc, x) => {
      return { ...acc, [x.name]: x.result };
    },
    {} as { [K in T[number]['name']]: string },
  );
}
