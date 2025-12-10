import { OAuth2Client } from 'google-auth-library';

const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID || process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || '';
const client = new OAuth2Client(GOOGLE_CLIENT_ID);

export async function verifyIdToken(idToken) {
  if (!idToken) throw new Error('ID token is required');
  try {
    const ticket = await client.verifyIdToken({ idToken, audience: GOOGLE_CLIENT_ID });
    const payload = ticket.getPayload();
    return payload;
  } catch (err) {
    const e = new Error('Invalid Google ID token');
    e.originalError = err;
    throw e;
  }
}

export default { verifyIdToken };
