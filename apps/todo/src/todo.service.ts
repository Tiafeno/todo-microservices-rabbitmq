import { Injectable } from '@nestjs/common';

export type ITodo = {
  title: string;
  rating: number;
};

@Injectable()
export class TodoService {
  async getTodo(): Promise<ITodo> {
    return { title: 'I am a title from  method', rating: 4 };
  }

  async createTodo(): Promise<ITodo> {
    return { title: 'I am a title from  method', rating: 3 };
  }
}
