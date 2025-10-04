import { parseDefItem } from './parseDefItem';
import { EnvDefError, type EnvDefErrorMessage } from './errors';

// Recursive duplicate-checker
type HasDuplicates<
  T extends readonly any[],
  Seen extends string = never,
> = T extends readonly [infer First, ...infer Rest]
  ? First extends { name: infer N extends string }
    ? N extends Seen
      ? true
      : HasDuplicates<Rest extends readonly any[] ? Rest : [], Seen | N>
    : false
  : false;

/**
 * Environment variable definition schema.
 */
export interface EnvDefItem<Name extends string = string> {
  name: Name;
  optional?: boolean;
  default?: string;
  nonProdDefault?: string;
  validate?: (value: string | undefined) => boolean;
}

/**
 * Parses environment variables in accordance with definitions.
 *
 * @param defs env var definition array
 * @param source `process.env` by default
 * @returns {object} environment variable name-value map
 * @throws {EnvDefError} on environment variable validation fail
 */
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
