import {
  Controller,
  Res,
  Param,
  Get,
  UseGuards,
  Body,
  Post,
  Query,
  Req,
} from '@nestjs/common';
import { GoogleCustomBearerStratergy } from './google-oauth.guard';
import { Response } from 'express';
import { UserService } from './user.service';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  @UseGuards(GoogleCustomBearerStratergy)
  async listUsers(@Res() res: Response) {
    try {
      const users = await this.userService.listUsers();
      return res.send(users);
    } catch (error) {
      return res.status(500).send(error.message);
    }
  }

  @Get(':userId')
  @UseGuards(GoogleCustomBearerStratergy)
  async getUser(@Param('userId') userId: string, @Res() res: Response) {
    try {
      const user = await this.userService.getUser(userId);
      return res.send(user);
    } catch (error) {
      return res.status(500).send(error.message);
    }
  }

  @Post('enable-watch')
  @UseGuards(GoogleCustomBearerStratergy)
  async enableWatch(
    @Query('event') event: string,
    @Body() requestBody: any,
    @Res() res: Response,
  ) {
    try {
      const watchResponse = await this.userService.enableWatch(
        event,
        requestBody,
      );
      return res.send(watchResponse);
    } catch (error) {
      return res.status(500).send(error.message);
    }
  }

  @Post('watch/deleted')
  handleUserDeleted(@Req() req: Request, @Res() res: Response) {
    const event = { ...req.body, eventType: 'USER_DELETED' };
    this.userService.handleUserEvent(event);
    return res.sendStatus(200);
  }

  @Post('watch/added')
  handleUserAdded(@Req() req: Request, @Res() res: Response) {
    const event = { ...req.body, eventType: 'USER_ADDED' };
    this.userService.handleUserEvent(event);
    return res.sendStatus(200);
  }
}
