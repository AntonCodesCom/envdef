import parseDefItem from './parseDefItem';
import { EnvDefError, type EnvDefErrorMessage, type EnvDefItem } from './types';

export default function envdef<const T extends readonly EnvDefItem<string>[]>(
  defs: T,
  source: object = process.env,
): { [K in T[number]['name']]: string } {
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
