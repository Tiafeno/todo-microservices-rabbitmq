import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { JwtService } from '@nestjs/jwt';
import { isUndefined } from 'lodash';
import * as process from 'process';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private jwtService: JwtService, private reflector: Reflector) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const token = this.extractTokenFromHeader(request);
    if (isUndefined(token)) throw new UnauthorizedException();
    //const roles = this.reflector.get<string[]>('roles', context.getHandler());
    try {
      request['payload'] = await this.jwtService.verifyAsync(token, {
        secret: process.env.JWT_KEY,
      });
      return true;
    } catch {
      throw new UnauthorizedException();
    }
  }

  private extractTokenFromHeader(request: Request): string | undefined {
    if (request.headers['authorization']) {
      const [type, token] = request.headers['authorization']?.split(' ') ?? [];
      return type === 'Bearer' ? token : undefined;
    } else {
      return undefined;
    }
  }
}
