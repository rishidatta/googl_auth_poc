import { Module } from '@nestjs/common';
import { GoogleAuthService } from './service/google-auth.service';
import { GoogleAuthController } from './controller/google-auth.controller';
import { UserController } from './controller/user.controller';
import { UserService } from './service/user.service';

@Module({
  imports: [],
  controllers: [GoogleAuthController, UserController],
  providers: [GoogleAuthService, UserService],
})
export class AppModule {}
