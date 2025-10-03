import type { EnvDefItem } from './types';

function inner(
  item: EnvDefItem,
  source: object = process.env,
): string | undefined {
  const { name, default: _default, nonProdDefault, optional } = item;
  const value = (source as any)[name];
  if (!value) {
    const nodeEnv = (source as any).NODE_ENV;
    if (nonProdDefault && !!nodeEnv && nodeEnv !== 'production') {
      return nonProdDefault;
    }
    if (_default) {
      return _default;
    }
    if (optional) {
      return undefined;
    }
    throw new Error(`${name} environment variable is required.`);
  }
  return value;
}

export default function parseDefItem(
  item: EnvDefItem,
  source: object = process.env,
): string | undefined {
  const { name, validate } = item;
  const value = inner(item, source);
  const validateResult = validate ? validate(value) : true;
  if (!validateResult) {
    throw new Error(`${name} environment variable custom validation failed.`);
  }
  return value;
}
