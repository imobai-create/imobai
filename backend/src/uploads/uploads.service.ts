



import { Injectable } from '@nestjs/common';

@Injectable()
export class UploadsService {

  saveFile(file: Express.Multer.File) {

    return {
      filename: file.filename,
      originalname: file.originalname,
      url: `http://localhost:3000/uploads/${file.filename}`,
    };

  }

}
