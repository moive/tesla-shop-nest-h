import { join } from 'path';
import { existsSync } from 'fs';
import { BadRequestException, Injectable } from '@nestjs/common';

@Injectable()
export class FilesService {
  getStaticFileUploadImage(imageName: string) {
    const productPath = join(__dirname, '../../static/products', imageName);
    const uploadPath = join(__dirname, '../../static/uploads', imageName);

    let filePath = '';

    if (existsSync(productPath)) {
      filePath = productPath;
    } else if (existsSync(uploadPath)) {
      filePath = uploadPath;
    } else {
      throw new BadRequestException(`No product found with image ${imageName}`);
    }

    return filePath;
  }
}
