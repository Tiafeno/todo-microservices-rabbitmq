import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserEntity } from './entities/user.entity';
import * as bcrypt from 'bcrypt';
import { cloneDeep } from 'lodash';

export type IUser = {
  id: number;
  name: string;
  password: string;
  email: string;
};

export interface IUserCreate {
  name: string;
  password: string;
  email: string;
}

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
  ) {}

  async login({ email, password }): Promise<UserEntity | null> {
    // find the user
    const currentUser = await this.findOneByEmail(email);
    if (!currentUser) return null;
    // compare the password
    const isMatch = await bcrypt.compare(password, currentUser.password);
    return isMatch ? currentUser : null;
  }

  async findOneByEmail(email: string): Promise<UserEntity | null> {
    return this.userRepository.findOne({
      where: {
        email,
      },
    });
  }

  async postUser(data: IUserCreate) {
    // encrypt the password
    const salt = await bcrypt.genSalt(10);
    const passwordCrypt = await bcrypt.hash(data.password, salt);
    data.password = cloneDeep(passwordCrypt);
    return this.userRepository.save(data);
  }
}
