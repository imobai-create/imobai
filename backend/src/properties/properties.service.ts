
import {
  Injectable,
  NotFoundException,
} from '@nestjs/common';

import { InjectRepository } from '@nestjs/typeorm';

import { Repository } from 'typeorm';

import { Property } from './property.entity';

import { CreatePropertyDto } from './dto/create-property.dto';

import { PropertyImage } from './property-image.entity';

import { User } from '../users/user.entity';



@Injectable()
export class PropertiesService {

  constructor(

    @InjectRepository(Property)
    private readonly propertiesRepo: Repository<Property>,

    @InjectRepository(PropertyImage)
    private readonly imagesRepo: Repository<PropertyImage>,

  ) {}



  // CREATE PROPERTY
  async create(
    dto: CreatePropertyDto,
    file: Express.Multer.File,
  ): Promise<Property> {

    const property = this.propertiesRepo.create({

      title: dto.title,

      description: dto.description,

      price: dto.price,

      address: dto.address,

      user: {
        id: dto.userId,
      } as User,

    });



    const savedProperty =
      await this.propertiesRepo.save(property);



    // SAVE IMAGE
    if (file) {

      const image = this.imagesRepo.create({

        url: file.filename,

        property: savedProperty,

      });

      await this.imagesRepo.save(image);

    }



    return savedProperty;

  }



  // FIND ALL
  async findAll(): Promise<Property[]> {

    return this.propertiesRepo.find({

      relations: [
        'user',
        'images',
        'videos',
        'deals',
        'transactions',
      ],

      order: {
        id: 'DESC',
      },

    });

  }



  // FIND ONE
  async findOne(id: number): Promise<Property> {

    const property =
      await this.propertiesRepo.findOne({

        where: { id },

        relations: [
          'user',
          'images',
          'videos',
          'deals',
          'transactions',
        ],

      });



    if (!property)
      throw new NotFoundException(
        'Property not found',
      );



    return property;

  }



  // DELETE
  async remove(id: number): Promise<void> {

    const property =
      await this.findOne(id);



    await this.propertiesRepo.remove(property);

  }

}