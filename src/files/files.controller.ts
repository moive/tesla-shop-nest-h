import type { Response } from 'express';
import {
  BadRequestException,
  Controller,
  Get,
  Param,
  Post,
  Res,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';

import { FilesService } from './files.service';
import { fileFilter, renameFile } from './helpers';
import { ConfigService } from '@nestjs/config';

@Controller('files')
export class FilesController {
  constructor(
    private readonly filesService: FilesService,
    private readonly configService: ConfigService,
  ) {}

  @Get('product/:imageName')
  findOneProductImage(
    @Res() res: Response,
    @Param('imageName') imageName: string,
  ) {
    const path = this.filesService.getStaticFileUploadImage(imageName);

    // res.status(403).json({ ok: false, path });
    res.sendFile(path);
  }

  @Post('product')
  @UseInterceptors(
    FileInterceptor('file', {
      fileFilter,
      // limits: { fileSize: 1024 * 1024 * 5 }, // 5 MB limit
      storage: diskStorage({
        destination: './static/uploads',
        filename: renameFile,
      }),
    }),
  )
  uploadProductImage(@UploadedFile() file: Express.Multer.File) {
    if (!file)
      throw new BadRequestException('Make sure that the file is an image');
    // localhost:3000/api/files/product/0198c5a2-e959-743a-a642-745aa50b5e0c.jpeg
    const secureUrl = `${this.configService.get('HOST_API')}/files/product/${file.filename}`;
    return { secureUrl };
  }
}
