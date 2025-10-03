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
