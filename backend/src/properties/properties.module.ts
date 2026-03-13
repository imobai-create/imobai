import { Module } from '@nestjs/common';

import { TypeOrmModule } from '@nestjs/typeorm';

import { Property } from './property.entity';

import { User } from '../users/user.entity';

import { PropertiesService } from './properties.service';

import { PropertiesController } from './properties.controller';
import { PropertyImage } from './property-image.entity';
import { PropertyVideo } from './property-video.entity';


@Module({

  imports: [

    TypeOrmModule.forFeature([Property,PropertyImage,PropertyVideo,User]),

  ],

  providers: [

    PropertiesService,

  ],

  controllers: [

    PropertiesController,

  ],

})

export class PropertiesModule {}