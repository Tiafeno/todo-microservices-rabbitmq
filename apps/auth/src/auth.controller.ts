import { Controller, Get } from '@nestjs/common';
import {
  Ctx,
  MessagePattern,
  Payload,
  RmqContext,
} from '@nestjs/microservices';
import { AuthService, IUser, IUserCreate } from './auth.service';
import { UserEntity } from './entities/user.entity';

@Controller()
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @MessagePattern({ cmd: 'signin' })
  async signin(
    @Ctx() context: RmqContext,
    @Payload() data: IUserCreate,
  ): Promise<IUser> {
    return await this.authService.login(data);
  }

  @MessagePattern({ cmd: 'post-user' })
  async createUser(
    @Ctx() context: RmqContext,
    @Payload() data: IUserCreate,
  ): Promise<IUser> {
    return await this.authService.postUser(data);
  }

  @MessagePattern({ cmd: 'one-user' })
  async findUser(
    @Ctx() ctx: RmqContext,
    @Payload() userEmail: string,
  ): Promise<UserEntity> {
    return await this.authService.findOneByEmail(userEmail);
  }
}
