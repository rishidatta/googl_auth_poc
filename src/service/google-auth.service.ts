import { Injectable } from '@nestjs/common';
import { O_AUTH_CLIENT as oauth2Client } from '../auth-guard/googleOauth.client';
import * as dotenv from 'dotenv';
dotenv.config();

const scopes = process.env.SCOPES.split(',');

@Injectable()
export class GoogleAuthService {
  getAuthUrl(): string {
    return oauth2Client.generateAuthUrl({
      access_type: 'offline',
      scope: scopes,
    });
  }

  async getAccessToken(code: string): Promise<any> {
    const { tokens } = await oauth2Client.getToken(code);
    oauth2Client.setCredentials(tokens);
    return tokens;
  }

  async refreshAccessToken(refreshToken: string): Promise<any> {
    oauth2Client.setCredentials({ refresh_token: refreshToken });
    const { credentials } = await oauth2Client.refreshAccessToken();
    oauth2Client.setCredentials(credentials);
    return credentials;
  }
}
