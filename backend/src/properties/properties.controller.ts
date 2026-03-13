import {
Controller,
Post,
Body,
UseInterceptors,
UploadedFile,
Get
} from '@nestjs/common';

import { FileInterceptor } from '@nestjs/platform-express';

import { PropertiesService } from './properties.service';

import { CreatePropertyDto } from './dto/create-property.dto';

@Controller('properties')
export class PropertiesController {

constructor(private readonly propertiesService: PropertiesService) {}


  @Get()
  async findAll() {
    return this.propertiesService.findAll ();
  }

@Post()
@UseInterceptors(FileInterceptor('file'))
async create(
@Body() body: any,
@UploadedFile() file: Express.Multer.File
) {

const dto: CreatePropertyDto = {

title: body.title,

description: body.description,

price: Number(body.price),

address: body.address,

userId: Number(body.userId),

};

return this.propertiesService.create(dto, file);

}

}
         
