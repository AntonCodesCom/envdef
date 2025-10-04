# envdef

Node.js environment variable parser & validator.

## Usage

```typescript
import { envdef, type EnvDefItem } from 'envdef';

const defs = [
  {
    name: 'API_URL',
  },
  {
    name: 'BASE_URL',
    default: 'http://localhost:5173',
  },
  {
    name: 'SESSION_COOKIE_SECRET',
    nonProdDefault: '__INSECURE__session_cookie_secret_dev',
  },
] as const satisfies EnvDefItem[]; // for best type safety

// // `process.env`:
// {
//   NODE_ENV: "development",
//   API_URL: "http://localhost:3000",
// }

const envs = envdef(defs);
envs.API_URL; // TypeScript knows it exists!
console.log(JSON.stringify(envs, null, 2));

// output:
// {
//   API_URL: 'http://localhost:3000',
//   BASE_URL: 'http://localhost:5173',
//   SESSION_COOKIE_SECRET: '__INSECURE__session_cookie_secret_dev',
// }
```

## API

### envdef

Environment variable parser.

Params:

- `defs: EnvDevItem[]` - array of environment variable definitions;
- `source: object` - set to `process.env` by default.

Returns: environment variable name-value object.

Throws an error when actual environment variables don't satisfy the definitions.

### EnvDefItem

Environment variable definition schema.

Properties:

- `name: string` - environment variable name.
- `optional: boolean` - if `true`, the parser will not throw an error if the variable of `name` is absent. Default: `false`.
- `default: string` - when the variable of `name` is absent, sets its value as a fallback. Overrides `optional`.
- `nonProdDefault: string` - when the variable of `name` is absent within production enviroment, sets the varible value as a fallback. Overrides `default` for production environment (see [Production environment](#production-environment) below).
- `validate: (raw: string) => boolean` - custom validator. If returns `false`, an error is thrown. Is executed after all built-in validations. The `raw` argument contains the environment variable value.

### Production environment

The environment is considered as production when the `NODE_ENV` environment variable is either empty or is set to `production`.

## Author

Anton "AntonCodes" Bahurinsky

[antoncodes.com](https://antoncodes.com)
