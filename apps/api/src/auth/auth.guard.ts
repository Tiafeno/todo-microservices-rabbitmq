import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { JwtService } from '@nestjs/jwt';
import { isString } from 'lodash';
import { Socket } from 'socket.io';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private jwtService: JwtService, private reflector: Reflector) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const clientSocket = context.switchToWs().getClient<Socket>();
    const token = clientSocket.handshake.query?.token ?? '';
    if (!token || !isString(token)) throw new UnauthorizedException();
    //const roles = this.reflector.get<string[]>('roles', context.getHandler());
    try {
      const payload = await this.jwtService.verifyAsync(token, {
        secret: process.env.JWT_KEY,
      });
      const request = context.switchToHttp().getRequest();
      request['payload'] = payload;
      return true;
    } catch {
      throw new UnauthorizedException();
    }
  }
}
