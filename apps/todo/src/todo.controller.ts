import { Controller } from '@nestjs/common';
import {
  Ctx,
  MessagePattern,
  Payload,
  RmqContext,
} from '@nestjs/microservices';
import { TodoService, ITodo } from './todo.service';

@Controller()
export class TodoController {
  constructor(private readonly todoService: TodoService) {}

  @MessagePattern({ cmd: 'get-todo' })
  async getTodo(
    @Ctx() context: RmqContext,
    @Payload() data: number[],
  ): Promise<ITodo> {
    const channel = context.getChannelRef();
    const message = context.getMessage();
    channel.ack(message);

    console.log(data);

    return this.todoService.getTodo();
  }

  @MessagePattern({ cmd: 'create-todo' })
  async createTodo(@Ctx() context: RmqContext): Promise<ITodo> {
    const channel = context.getChannelRef();
    const message = context.getMessage();

    channel.ack(message);

    return this.todoService.createTodo();
  }
}
