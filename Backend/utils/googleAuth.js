import { OAuth2Client } from "google-auth-library";

const client = new OAuth2Client("644106811818-6m86me71bp5moe8huhfmj85302accnlq.apps.googleusercontent.com");

async function verifyToken(token) {
  try {
    const ticket = await client.verifyIdToken({
      idToken: token,
      audience: "644106811818-6m86me71bp5moe8huhfmj85302accnlq.apps.googleusercontent.com",
    });
    console.log(ticket.getPayload());
  } catch (err) {
    console.error("Token invalid:", err);
  }
}
