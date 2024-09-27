import {
  Controller,
  Get,
  Post,
  Body,
  Query,
  Res,
  UseGuards,
} from '@nestjs/common';
import { GoogleAuthService } from '../service/google-auth.service';
import { Response } from 'express';
import { GoogleCustomBearerStratergy } from '../auth-guard/google-oauth.guard';

@Controller('auth')
export class GoogleAuthController {
  constructor(private readonly googleAuthService: GoogleAuthService) {}

  @Get('login-url')
  getAuthUrl(@Res() res: Response) {
    const url = this.googleAuthService.getAuthUrl();
    return res.send(url);
  }

  @Get('validate-token')
  @UseGuards(GoogleCustomBearerStratergy)
  validateAccessToken(@Res() res: Response) {
    return res.send(200);
  }

  @Get('access-token')
  async getAccessToken(@Query('code') code: string, @Res() res: Response) {
    if (!code) {
      return res.status(400).send('Missing code parameter');
    }
    try {
      const tokens = await this.googleAuthService.getAccessToken(code);
      console.log('Access token: ', tokens.access_token);
      return res.status(200).send(tokens.access_token);
    } catch (error) {
      console.error('Error handling callback:', error);
      return res.status(500).send('An error occurred');
    }
  }

  @Post('refresh-token')
  async refreshAccessToken(
    @Body('refreshToken') refreshToken: string,
    @Res() res: Response,
  ) {
    if (!refreshToken) {
      return res.status(400).send('Missing refresh token');
    }
    try {
      const credentials =
        await this.googleAuthService.refreshAccessToken(refreshToken);
      return res.json(credentials);
    } catch (error) {
      console.error('Error refreshing token:', error);
      return res.status(500).send('Failed to refresh token');
    }
  }
}
