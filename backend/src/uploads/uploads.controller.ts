import {
  Controller,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';

import { FileInterceptor } from '@nestjs/platform-express';

import { diskStorage } from 'multer';

import { extname } from 'path';

import { UploadsService } from './uploads.service';


@Controller('uploads')
export class UploadsController {

  constructor(
    private readonly uploadsService: UploadsService,
  ) {}



  @Post()
  @UseInterceptors(

    FileInterceptor('file', {

      storage: diskStorage({

        destination: './uploads',

        filename: (req, file, callback) => {

          const uniqueName =
            Date.now() +
            '-' +
            Math.round(Math.random() * 1e9) +
            extname(file.originalname);

          callback(null, uniqueName);

        },

      }),

    }),

  )

  uploadFile(

    @UploadedFile()
    file: Express.Multer.File,

  ) {

    return this.uploadsService.saveFile(file);

  }

}
