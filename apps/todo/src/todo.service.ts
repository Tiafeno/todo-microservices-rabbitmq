import { BadRequestException, Injectable } from '@nestjs/common';
import { TodoEntity } from './entities/todo.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { cloneDeep } from 'lodash';

export type ITodo = {
  detail: string;
};

export type ITodoUpdate = ITodo & { id: number };

@Injectable()
export class TodoService {
  constructor(
    @InjectRepository(TodoEntity)
    private readonly taskRepository: Repository<TodoEntity>,
  ) {}

  async createTodo(data: ITodo): Promise<TodoEntity> {
    const task = await this.taskRepository.save(data);
    console.log(task);
    return task;
  }

  async updateTodo(data: ITodoUpdate): Promise<TodoEntity> {
    const { id: _, ...partialEntity } = cloneDeep(data);
    try {
      const response = await this.taskRepository.update(data.id, partialEntity);
      const taskId = response.affected;
      if (!taskId) throw new BadRequestException('Error on update');
      return await this.findOnById(taskId);
    } catch (e) {
      throw new BadRequestException('error');
    }
  }

  async findAll(): Promise<TodoEntity[]> {
    return await this.taskRepository.find();
  }

  async findOnById(id: number): Promise<TodoEntity> {
    return await this.taskRepository.findOne({
      where: {
        id,
      },
    });
  }

  async remove(id: number): Promise<boolean> {
    const response = await this.taskRepository.delete({ id });
    if (!response.affected) throw new BadRequestException('Error on delete');
    return true;
  }
}
