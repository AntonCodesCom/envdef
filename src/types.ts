export interface EnvDefItem<T extends string = string> {
  name: T;
  optional?: boolean;
  default?: string;
  nonProdDefault?: string;
  validate?: (value: string | undefined) => boolean;
}

export interface EnvDefErrorMessage {
  name: string;
  message: string;
}

export class EnvDefError extends Error {
  constructor(public messages: EnvDefErrorMessage[]) {
    super(
      `Error occurred while parsing environment variables\n${JSON.stringify(messages, null, 2)}`,
    );
  }
}
