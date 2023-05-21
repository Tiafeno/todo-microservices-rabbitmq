import {
  BadRequestException,
  Body,
  Controller,
  HttpCode,
  HttpException,
  HttpStatus,
  Inject,
  Logger,
  Post,
} from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { SignInDto } from './dto/signin.dto';
import { RegisterDto } from './dto/register.dto';
import { catchError, firstValueFrom } from 'rxjs';
import { AuthService, UserEntity } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(
    @Inject('AUTH_SERVICE') private authService: ClientProxy,
    private readonly service: AuthService,
  ) {}

  @Post()
  @HttpCode(HttpStatus.ACCEPTED)
  async signIn(@Body() data: SignInDto) {
    Logger.log('Authentification information');
    Logger.debug(data);
    const user: UserEntity | null = await firstValueFrom(
      this.authService.send(
        {
          cmd: 'signin',
        },
        data,
      ),
    );
    if (!user)
      throw new BadRequestException(
        'User account not found or incorrect password',
      );

    return await this.service.getToken(user);
  }

  @Post('register')
  @HttpCode(HttpStatus.ACCEPTED)
  async register(@Body() data: RegisterDto) {
    const user = await firstValueFrom(
      this.authService.send({ cmd: 'one-user' }, data.email).pipe(
        catchError((er) => {
          throw new HttpException('Error found', HttpStatus.BAD_REQUEST);
        }),
      ),
    );
    if (user) throw new BadRequestException('Email address already exist');
    return this.authService.send(
      {
        cmd: 'post-user',
      },
      data,
    );
    // pass
  }
}
