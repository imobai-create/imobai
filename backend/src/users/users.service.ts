import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { User } from './user.entity';

@Injectable()
export class UsersService {

  constructor(
    @InjectRepository(User)
    private usersRepo: Repository<User>,
  ) {}



  async create(createUserDto: any): Promise<User> {

    const user = this.usersRepo.create({
      email: createUserDto.email,
      password: createUserDto.password,
      name: createUserDto.name,
    });

    return this.usersRepo.save(user);

  }



  async findByEmail(email: string): Promise<User | null> {

    return this.usersRepo.findOne({
      where: { email }
    });

  }



  async findById(id: number): Promise<User | null> {

    return this.usersRepo.findOne({
      where: { id }
    });

  }

}