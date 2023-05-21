import { BadRequestException, Injectable } from '@nestjs/common';
import { TodoEntity } from './entities/todo.entity';
import { DeepPartial, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

export type ITodo = {
  detail: string;
  parentId?: number;
};

export type ITodoUpdate = ITodo & { id: number };

@Injectable()
export class TodoService {
  constructor(
    @InjectRepository(TodoEntity)
    private readonly taskRepository: Repository<TodoEntity>,
  ) {}

  async createTodo(data: ITodo): Promise<TodoEntity> {
    const { parentId: _, ...entities } = data;
    let parentTask;
    const todoPartialEntities: DeepPartial<TodoEntity> = {};
    if (data.parentId) {
      parentTask = await this.findOnById(data.parentId);
      todoPartialEntities.parent = parentTask;
    } else {
      todoPartialEntities.parent = null;
    }
    const task = await this.taskRepository.save({
      ...todoPartialEntities,
      ...entities,
    });
    return task;
  }

  async updateTodo(data: ITodoUpdate): Promise<TodoEntity> {
    const { id, parentId, ...partialEntity } = data;
    try {
      let parentTask;
      const todoPartialEntities: DeepPartial<TodoEntity> = {};
      if (data.parentId) {
        parentTask = await this.findOnById(data.parentId);
        todoPartialEntities.parent = parentTask;
      } else {
        todoPartialEntities.parent = null;
      }
      const response = await this.taskRepository.update(data.id, {
        ...todoPartialEntities,
        ...partialEntity,
      });
      const taskId = response.affected;
      if (!taskId) throw new BadRequestException('Error on update');
      return await this.findOnById(taskId);
    } catch (e) {
      throw new BadRequestException('error');
    }
  }

  async findAll(): Promise<TodoEntity[]> {
    return await this.taskRepository.find({
      relations: {
        children: true,
      },
    });
  }

  async findOnById(id: number): Promise<TodoEntity> {
    return await this.taskRepository.findOne({
      where: {
        id,
      },
      relations: {
        children: true,
      },
    });
  }

  async remove(id: number): Promise<boolean> {
    const response = await this.taskRepository.delete({ id });
    if (!response.affected) throw new BadRequestException('Error on delete');
    return true;
  }
}
