import { google } from "googleapis";

export default function auth(creds, scopes): Promise<{
  jwt;
  tokens;
}> {
  const jwt = new google.auth.JWT(creds.client_email, null, creds.private_key, scopes);

  return new Promise((resolve, reject) => {
    jwt.authorize((err, tokens) => {
      if (err) {
        reject(err);
      } else {
        google.options({
          auth: jwt,
        });
        resolve({
          jwt,
          tokens,
        });
      }
    });
  });
}
