import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
  ParseUUIDPipe,
} from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { Product } from './entities/product.entity';

export interface IErrorsTypeORM {
  length: number;
  severity: string;
  code: string;
  detail: string;
  hint: string;
  position: string;
  internalPosition: string;
  internalQuery: string;
  where: string;
  schema: string;
  table: string;
  column: string;
  dataType: string;
  constraint: string;
  file: string;
  line: string;
  routine: string;
  driverError: IDriverError;
}

export interface IDriverError {
  length: number;
  severity: string;
  code: string;
  detail: string;
  hint: string;
  position: string;
  internalPosition: string;
  internalQuery: string;
  where: string;
  schema: string;
  table: string;
  column: string;
  dataType: string;
  constraint: string;
}

@Injectable()
export class ProductsService {
  private readonly logger = new Logger('ProductsService');

  constructor(
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
  ) {}
  async create(createProductDto: CreateProductDto) {
    try {
      const product = this.productRepository.create(createProductDto);
      await this.productRepository.save(product);
      return product;
    } catch (error) {
      this.handleDBExceptions(error);
    }
  }

  findAll() {
    return this.productRepository.find();
  }

  async findOne(id: string) {
    const product = await this.productRepository.findOneBy({ id });
    if (!product)
      throw new NotFoundException(`Product with id: ${id} not found`);
    return product;
  }

  update(id: number, updateProductDto: UpdateProductDto) {
    return `This action updates a #${id} product`;
  }

  async remove(id: string) {
    const product = await this.findOne(id);
    await this.productRepository.remove(product);
  }

  private handleDBExceptions(error: IErrorsTypeORM) {
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
