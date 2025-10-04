// Recursive duplicate-checker
export type HasDuplicates<
  T extends readonly any[],
  Seen extends string = never,
> = T extends readonly [infer First, ...infer Rest]
  ? First extends { name: infer N extends string }
    ? N extends Seen
      ? true
      : HasDuplicates<Rest extends readonly any[] ? Rest : [], Seen | N>
    : false
  : false;

export interface EnvDefItem<Name extends string = string> {
  name: Name;
  optional?: boolean;
  default?: string;
  nonProdDefault?: string;
  validate?: (value: string | undefined) => boolean;
}
