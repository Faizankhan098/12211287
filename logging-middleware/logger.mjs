import fetch from 'node-fetch';

const LOG_API = 'http://20.244.56.144/evaluation-service/logs';
const ACCESS_TOKEN = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJNYXBDbGFpbXMiOnsiYXVkIjoiaHR0cDovLzIwLjI0NC41Ni4xNDQvZXZhbHVhdGlvbi1zZXJ2aWNlIiwiZW1haWwiOiJtcmZhaXphbmtoYW4wNDlAZ21haWwuY29tIiwiZXhwIjoxNzUyNDcyMzk1LCJpYXQiOjE3NTI0NzE0OTUsImlzcyI6IkFmZm9yZCBNZWRpY2FsIFRlY2hub2xvZ2llcyBQcml2YXRlIExpbWl0ZWQiLCJqdGkiOiJmN2Y2MDAxMS0zYjViLTRjM2MtYThjMS01MTc0MWU4YjI1ZjEiLCJsb2NhbGUiOiJlbi1JTiIsIm5hbWUiOiIga2hhbiBtb2hkIGZhaXphbiBpemhhciIsInN1YiI6IjFlYjQ3YjM4LWEwZTItNDBjYS05YzUyLTZkOTA5M2U2ODc2NyJ9LCJlbWFpbCI6Im1yZmFpemFua2hhbjA0OUBnbWFpbC5jb20iLCJuYW1lIjoiIGtoYW4gbW9oZCBmYWl6YW4gaXpoYXIiLCJyb2xsTm8iOiIxMjIxMTI4NyIsImFjY2Vzc0NvZGUiOiJDWnlwUUsiLCJjbGllbnRJRCI6IjFlYjQ3YjM4LWEwZTItNDBjYS05YzUyLTZkOTA5M2U2ODc2NyIsImNsaWVudFNlY3JldCI6InRVYmRYSnVLdGhQYmdzVFkifQ._x2LBadINv852V8Ne2xR47ULA7hQBc4CNSyQolSSs1c'; // your actual token
const AUTH_TOKEN = `Bearer ${ACCESS_TOKEN}`;

const VALID_STACKS = ['backend', 'frontend'];
const VALID_LEVELS = ['debug', 'info', 'warn', 'error', 'fatal'];
const VALID_BACKEND_PACKAGES = [
  'cache', 'controller', 'cron_job', 'db', 'domain',
  'handler', 'repository', 'route', 'service'
];
const VALID_FRONTEND_PACKAGES = [
  'api', 'component', 'hook', 'page', 'state', 'style'
];
const SHARED_PACKAGES = ['auth', 'config', 'middleware', 'utils'];

export async function log(stack, level, pkg, message) {
  try {
    if (!VALID_STACKS.includes(stack)) throw new Error(`Invalid stack: ${stack}`);
    if (!VALID_LEVELS.includes(level)) throw new Error(`Invalid level: ${level}`);

    const isValidPackage =
      (stack === 'backend' && VALID_BACKEND_PACKAGES.includes(pkg)) ||
      (stack === 'frontend' && VALID_FRONTEND_PACKAGES.includes(pkg)) ||
      SHARED_PACKAGES.includes(pkg);

    if (!isValidPackage) throw new Error(`Invalid package '${pkg}' for stack '${stack}'`);

    const payload = { stack, level, package: pkg, message };

    const res = await fetch(LOG_API, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': AUTH_TOKEN
      },
      body: JSON.stringify(payload)
    });

    const result = await res.json();
    if (!res.ok) {
      console.error('Log API error:', result);
    } else {
      console.log('Log submitted:', result.logID);
    }
  } catch (err) {
    console.error('Logger error:', err.message);
  }
}
