export interface EnvDefItem<T extends string = string> {
  name: T;
  optional?: boolean;
  default?: string;
  nonProdDefault?: string;
  validate?: (value: string | undefined) => boolean;
}
