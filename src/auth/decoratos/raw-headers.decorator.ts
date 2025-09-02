import {
  createParamDecorator,
  ExecutionContext,
  InternalServerErrorException,
} from '@nestjs/common';
import { Request } from 'express';

export const RawHeaders = createParamDecorator(
  (data: string, ctx: ExecutionContext) => {
    const req = ctx.switchToHttp().getRequest<Request>();
    const rawHeaders = req.rawHeaders;
    if (!rawHeaders)
      throw new InternalServerErrorException('RawHeaders not found');
    return rawHeaders;
  },
);
