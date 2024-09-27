import { google } from 'googleapis';
import * as dotenv from 'dotenv';
dotenv.config();
export const O_AUTH_CLIENT = new google.auth.OAuth2(
  process.env.O_AUTH_CLIENT_ID,
  process.env.O_AUTH_CLIENT_SECRET,
  process.env.O_AUTH_REDIRECT_URI,
);

export const SERVICE_ACCOUNT_CLIENT = new google.auth.JWT({
  email: process.env.CLIENT_EMAIL,
  key: process.env.PRIVATE_KEY.replace(/\\n/g, '\n'),
  scopes: process.env.SCOPES.split(','),
  subject: process.env.ADMIN_EMAIL,
});
