import { IsNotEmpty, IsOptional } from 'class-validator';

export class CreateTaskDto {
  @IsNotEmpty()
  detail: string;

  @IsOptional()
  parentId: number;
}
