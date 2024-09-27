import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { google } from 'googleapis';
import { Request } from 'express';
import { O_AUTH_CLIENT as oauth2Client } from './googleOauth.client';

@Injectable()
export class GoogleCustomBearerStratergy implements CanActivate {
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request: Request = context.switchToHttp().getRequest();
    const authHeader = request.headers.authorization;

    if (!authHeader) {
      throw new UnauthorizedException('Authorization header is missing');
    }

    const token = this.extractTokenFromHeader(authHeader);
    if (!token) {
      throw new UnauthorizedException('Bearer token is missing');
    }

    try {
      const userInfo = await this.validateToken(token);
      request['user'] = userInfo; // Attach user info to request object
      return true;
    } catch (error) {
      console.error('Token validation error', error);
      throw new UnauthorizedException('Invalid or expired token');
    }
  }

  private extractTokenFromHeader(authHeader: string): string {
    if (authHeader.startsWith('Bearer ')) {
      return authHeader.split(' ')[1];
    }
    return null;
  }

  private async validateToken(token: string): Promise<any> {
    oauth2Client.setCredentials({ access_token: token });
    const oauth2 = google.oauth2({ auth: oauth2Client, version: 'v2' });
    try {
      // Fetch user info from Google using the access token
      const response = await oauth2.userinfo.get();
      return response.data; // Return user data
    } catch (error) {
      throw new UnauthorizedException(
        'Failed to fetch user info: ' + error.message,
      );
    }
  }
}
