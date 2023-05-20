import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ClientProxyFactory, Transport } from '@nestjs/microservices';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthController } from './auth/auth.controller';
import { AuthService } from './auth/auth.service';
import { JwtModule } from '@nestjs/jwt';
import { TaskModule } from './task/task.module';
import * as process from 'process';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: './.env',
    }),
    JwtModule.register({
      global: true,
      secret: process.env.JWT_KEY ?? '',
      signOptions: {
        expiresIn: '1d',
      },
    }),
    TaskModule,
  ],
  controllers: [AppController, AuthController],
  providers: [
    AppService,
    AuthService,
    {
      provide: 'AUTH_SERVICE',
      useFactory: (configService: ConfigService) => {
        const USER = configService.get('RABBITMQ_USER');
        const PASS = configService.get('RABBITMQ_PASS');
        const HOST = configService.get('RABBITMQ_HOST');
        const QUEUE = configService.get('RABBITMQ_AUTH_QUEUE');

        return ClientProxyFactory.create({
          transport: Transport.RMQ,
          options: {
            urls: [`amqp://${USER}:${PASS}@${HOST}`],
            queue: QUEUE,
            queueOptions: {
              durable: true,
            },
          },
        });
      },
      inject: [ConfigService],
    },
  ],
})
export class AppModule {}
