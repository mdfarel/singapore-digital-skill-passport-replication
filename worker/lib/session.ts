// Demonstration session handling. The real Careers & Skills Passport authenticates
// with Singpass; this platform models the same contract with a signed cookie so the
// authorisation logic around it can be exercised end to end.
const enc = new TextEncoder();

async function key(secret: string) {
  return crypto.subtle.importKey('raw', enc.encode(secret), { name: 'HMAC', hash: 'SHA-256' }, false, ['sign', 'verify']);
}

const b64 = (buf: ArrayBuffer) =>
  btoa(String.fromCharCode(...new Uint8Array(buf))).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');

export async function sign(payload: string, secret: string) {
  const sig = await crypto.subtle.sign('HMAC', await key(secret), enc.encode(payload));
  return `${payload}.${b64(sig)}`;
}

export async function verify(token: string, secret: string): Promise<string | null> {
  const i = token.lastIndexOf('.');
  if (i < 0) return null;
  const payload = token.slice(0, i);
  const expected = await sign(payload, secret);
  return expected === token ? payload : null;
}

export function cookie(name: string, value: string, maxAge: number) {
  return `${name}=${value}; Path=/; HttpOnly; SameSite=Lax; Max-Age=${maxAge}`;
}

export function readCookie(header: string | null, name: string): string | null {
  if (!header) return null;
  for (const part of header.split(';')) {
    const [k, ...v] = part.trim().split('=');
    if (k === name) return v.join('=');
  }
  return null;
}
