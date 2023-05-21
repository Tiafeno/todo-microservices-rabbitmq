import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('todo')
export class TodoEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: false })
  detail: string;

  @Column({ type: 'smallint', default: 1 })
  priority: number;

  @Column({ type: 'boolean', default: false })
  finished: boolean;

  @ManyToOne((type) => TodoEntity, (todo) => todo.children, {
    nullable: true,
    onDelete: 'SET NULL',
  })
  parent: TodoEntity;

  @OneToMany((type) => TodoEntity, (todo) => todo.parent)
  children: TodoEntity[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
