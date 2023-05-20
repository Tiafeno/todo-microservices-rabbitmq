import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Inject,
  UseGuards,
  ClassSerializerInterceptor,
  UseInterceptors,
  ParseIntPipe,
  NotFoundException,
} from '@nestjs/common';
import { TaskService } from './task.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { ClientProxy } from '@nestjs/microservices';
import { AuthGuard } from '../auth/auth.guard';
import { catchError, firstValueFrom } from 'rxjs';

@Controller('task')
export class TaskController {
  constructor(
    private readonly taskService: TaskService,
    @Inject('TASK_SERVICE') private taskProxyService: ClientProxy,
  ) {}

  @Post()
  @UseGuards(AuthGuard)
  @UseInterceptors(ClassSerializerInterceptor)
  create(@Body() createTaskDto: CreateTaskDto) {
    return this.taskProxyService
      .send(
        {
          cmd: 'create-task',
        },
        createTaskDto,
      )
      .pipe(
        catchError((er) => {
          console.log(er);
          throw er.message;
        }),
      );
  }

  @Get()
  @UseGuards(AuthGuard)
  @UseInterceptors(ClassSerializerInterceptor)
  findAll() {
    return this.taskProxyService.send(
      {
        cmd: 'all-task',
      },
      {},
    );
  }

  @Get(':id')
  @UseGuards(AuthGuard)
  @UseInterceptors(ClassSerializerInterceptor)
  async findOne(@Param('id', ParseIntPipe) id: number) {
    const task = await firstValueFrom(
      this.taskProxyService.send(
        {
          cmd: 'get-task',
        },
        id,
      ),
    );
    if (!task) throw new NotFoundException();
    return task;
  }

  @Patch(':id')
  @UseGuards(AuthGuard)
  @UseInterceptors(ClassSerializerInterceptor)
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateTaskDto: UpdateTaskDto,
  ) {
    const data = { id, ...updateTaskDto };
    const task = await firstValueFrom(
      this.taskProxyService.send(
        {
          cmd: 'get-task',
        },
        id,
      ),
    );
    if (!task) throw new NotFoundException();
    return this.taskProxyService.send(
      {
        cmd: 'update-task',
      },
      data,
    );
  }

  @Delete(':id')
  @UseGuards(AuthGuard)
  @UseInterceptors(ClassSerializerInterceptor)
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.taskProxyService.send(
      {
        cmd: 'remove-task',
      },
      id,
    );
  }
}
