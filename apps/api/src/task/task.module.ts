import { Module } from '@nestjs/common';
import { TaskService } from './task.service';
import { TaskController } from './task.controller';
import { ConfigService } from '@nestjs/config';
import { ClientProxyFactory, Transport } from '@nestjs/microservices';

@Module({
  controllers: [TaskController],
  providers: [
    TaskService,
    {
      provide: 'TASK_SERVICE',
      useFactory: (configService: ConfigService) => {
        const USER = configService.get('RABBITMQ_USER');
        const PASS = configService.get('RABBITMQ_PASS');
        const HOST = configService.get('RABBITMQ_HOST');
        const QUEUE = configService.get('RABBITMQ_TODO_QUEUE');

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
export class TaskModule {}
