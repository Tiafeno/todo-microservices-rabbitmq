import { Controller, Get, Inject, Post } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';

@Controller('task')
export class TodoController {
  constructor(@Inject('TASK_SERVICE') private todoService: ClientProxy) {}

  @Get()
  async getTask() {
    return this.todoService.send(
      {
        cmd: 'get-todo',
      },
      [4, 5, 6],
    );
  }

  @Post()
  async createTask() {
    return this.todoService.send(
      {
        cmd: 'create-todo',
      },
      {},
    );
  }
}
