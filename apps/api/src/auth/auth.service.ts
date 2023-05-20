import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

export interface IUserPayload {
  uid: number;
  email: string;
  name: string;
}

export interface IToken {
  access_token: string;
  expiresIn: number;
}

export interface UserEntity {
  id: number;
  name: string;
  password: string;
  email: string;
  createdAt: Date;
  updatedAt: Date;
}

@Injectable()
export class AuthService {
  constructor(private readonly jwtService: JwtService) {}

  async getToken(user: UserEntity): Promise<{
    payload: IUserPayload;
    key: IToken;
  }> {
    const expiresAt = 86400; // en seconds
    const { name, id, email } = user;
    const payload = { uid: id, name, email };
    return {
      payload,
      key: {
        access_token: await this.jwtService.signAsync(payload, {
          expiresIn: `${expiresAt}s`,
        }),
        expiresIn: expiresAt,
      },
    };
  }
}
