import { Injectable, UnauthorizedException } from '@nestjs/common';
import { google } from 'googleapis';
import { SERVICE_ACCOUNT_CLIENT as serviceAccountClient } from '../auth-guard/googleOauth.client';

@Injectable()
export class UserService {
  async listUsers(): Promise<any> {
    try {
      const admin = google.admin({
        version: 'directory_v1',
        auth: serviceAccountClient,
      });
      const users = await admin.users.list({ domain: 'chimps.line.pm' });
      return users?.data?.users;
    } catch (error) {
      throw new UnauthorizedException(error);
    }
  }

  async getUser(userId: string): Promise<any> {
    const admin = google.admin({
      version: 'directory_v1',
      auth: serviceAccountClient,
    });
    const user = await admin.users.get({ userKey: userId });
    return user.data;
  }

  async enableWatch(event: string, requestBody: any): Promise<any> {
    const admin = google.admin({
      version: 'directory_v1',
      auth: serviceAccountClient,
    });
    const watchResponse = await admin.users.watch({
      domain: 'chimps.line.pm',
      event,
      requestBody,
    });
    return watchResponse.data;
  }

  handleUserEvent(event: any) {
    if (event.eventType === 'USER_ADDED') {
      console.log(`User added: ${event.primaryEmail}`);
    } else if (event.eventType === 'USER_DELETED') {
      console.log(`User deleted: ${event.primaryEmail}`);
    } else {
      console.log('Unknown event type', event);
    }
  }
}
