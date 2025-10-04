import { envdef, type EnvDefItem } from '.';

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
