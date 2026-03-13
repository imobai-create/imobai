import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { User } from '../users/user.entity';

import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {

  constructor(

    @InjectRepository(User)
    private usersRepo: Repository<User>,

  ) {}



  async register(
    name: string,
    email: string,
    password: string,
  ) {

    // verifica se já existe
    const existingUser = await this.usersRepo.findOne({
      where: { email }
    });

    if (existingUser) {

      throw new BadRequestException('Email já existe');

    }


    // criptografa senha
    const hashedPassword = await bcrypt.hash(password, 10);


    // cria usuário
    const user = this.usersRepo.create({

      name: name,

      email: email,

      password: hashedPassword,

    });


    // salva no banco
    const savedUser = await this.usersRepo.save(user);


    return savedUser;

  }



  async login(
    email: string,
    password: string,
  ) {

    const user = await this.usersRepo.findOne({

      where: { email }

    });


    if (!user) {

      throw new BadRequestException('User não existe');

    }


    const passwordMatch = await bcrypt.compare(
      password,
      user.password
    );


    if (!passwordMatch) {

      throw new BadRequestException('Senha inválida');

    }


    return user;

  }

}

