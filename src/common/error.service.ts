import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { IErrorsTypeORM } from './interfaces/error.interface';

@Injectable()
export class ErrorService {
  private readonly logger = new Logger('ErrorService');

  public handleDBExceptions(error: IErrorsTypeORM): never {
    console.log(error);
    if (error.code === '23505') {
      throw new BadRequestException(error.detail);
    }
    this.logger.error(error);
    throw new InternalServerErrorException(
      'Unexpected error, check server logs',
    );
  }
}
