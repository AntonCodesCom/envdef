import envdef, { EnvDefItem } from ".";

const defs: EnvDefItem[] = [
  {
    name: 'BASE_URL',
    default: 'http://localhost:5173',
  },
  {
    name: 'API_URL',
    default: 'http://localhost:3000',
  },
  {
    name: 'SESSION_COOKIE_SECRET',
    nonProdDefault: '__INSECURE__session_cookie_secret_dev',
  },
];

const envs = envdef(defs) 
console.log(JSON.stringify(envs, null, 2))
