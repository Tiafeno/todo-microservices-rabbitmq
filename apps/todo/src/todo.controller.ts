import { Controller } from '@nestjs/common';
import {
  Ctx,
  MessagePattern,
  Payload,
  RmqContext,
} from '@nestjs/microservices';
import { TodoService, ITodo, ITodoUpdate } from './todo.service';
import { TodoEntity } from "./entities/todo.entity";

@Controller()
export class TodoController {
  constructor(private readonly todoService: TodoService) {}

  @MessagePattern({ cmd: 'get-task' })
  async getTodo(
    @Ctx() context: RmqContext,
    @Payload() id: number,
  ): Promise<ITodo> {
    const task = await this.todoService.findOnById(id);
    return task;
  }

  @MessagePattern({ cmd: 'all-task' })
  async findAll(@Ctx() context: RmqContext) {
    return await this.todoService.findAll();
  }

  @MessagePattern({ cmd: 'create-task' })
  async createTodo(
    @Ctx() context: RmqContext,
    @Payload() data: ITodo,
  ): Promise<TodoEntity> {
    const channel = context.getChannelRef();
    const message = context.getMessage();
    channel.ack(message);
    return await this.todoService.createTodo(data);
  }

  @MessagePattern({ cmd: 'update-task' })
  async updateTodo(
    @Ctx() context: RmqContext,
    @Payload() data: ITodoUpdate,
  ): Promise<TodoEntity> {
    return await this.todoService.updateTodo(data);
  }

  @MessagePattern({ cmd: 'remove-task' })
  async removeTodo(
    @Ctx() context: RmqContext,
    @Payload() id: number,
  ): Promise<boolean> {
    return await this.todoService.remove(id);
  }
}
