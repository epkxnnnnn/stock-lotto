/**
 * Signed request tokens for internal data endpoint
 * Short-lived JWT-like tokens bound to session
 */

const TOKEN_EXPIRY_MS = 5 * 60 * 1000; // 5 minutes

interface TokenPayload {
  iat: number;
  exp: number;
  sid: string; // session ID
}

async function hmacSign(data: string, secret: string): Promise<string> {
  const encoder = new TextEncoder();
  const key = await crypto.subtle.importKey(
    'raw',
    encoder.encode(secret),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign']
  );
  const signature = await crypto.subtle.sign('HMAC', key, encoder.encode(data));
  return btoa(String.fromCharCode(...new Uint8Array(signature)));
}

async function hmacVerify(data: string, signature: string, secret: string): Promise<boolean> {
  const expected = await hmacSign(data, secret);
  return signature === expected;
}

export async function createToken(sessionId: string): Promise<string> {
  const secret = process.env.HMAC_SECRET || 'dev-hmac-secret';
  const now = Date.now();
  const payload: TokenPayload = {
    iat: now,
    exp: now + TOKEN_EXPIRY_MS,
    sid: sessionId,
  };

  const encodedPayload = btoa(JSON.stringify(payload));
  const signature = await hmacSign(encodedPayload, secret);

  return `${encodedPayload}.${signature}`;
}

export async function verifyToken(
  token: string
): Promise<{ valid: true; payload: TokenPayload } | { valid: false; error: string }> {
  const secret = process.env.HMAC_SECRET || 'dev-hmac-secret';
  const parts = token.split('.');

  if (parts.length !== 2) {
    return { valid: false, error: 'Invalid token format' };
  }

  const [encodedPayload, signature] = parts;
  const isValid = await hmacVerify(encodedPayload, signature, secret);

  if (!isValid) {
    return { valid: false, error: 'Invalid signature' };
  }

  const payload: TokenPayload = JSON.parse(atob(encodedPayload));

  if (Date.now() > payload.exp) {
    return { valid: false, error: 'Token expired' };
  }

  return { valid: true, payload };
}
