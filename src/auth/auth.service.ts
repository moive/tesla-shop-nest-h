import { Repository } from 'typeorm';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { compareSync, hashSync } from 'bcrypt';

import { CreateUserDto, LoginUserDto } from './dto';
import { User } from './entities/user.entity';
import { ErrorService } from 'src/common/error.service';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    public errorService: ErrorService,
  ) {}

  async create(createUserDto: CreateUserDto) {
    const { password, ...userData } = createUserDto;
    try {
      const user = this.userRepository.create({
        ...userData,
        password: hashSync(password, 10),
      });
      await this.userRepository.save(user);
      const { password: _, ...userDetail } = user;
      return userDetail;
    } catch (error) {
      this.errorService.handleDBExceptions(error);
    }
  }

  async login(loginUserDto: LoginUserDto) {
    const { email, password } = loginUserDto;
    const user = await this.userRepository.findOne({
      where: { email },
      select: { email: true, password: true },
    });

    if (!user) {
      throw new UnauthorizedException('Credentials are not valid (email)');
    }

    if (!compareSync(password, user.password)) {
      throw new UnauthorizedException('Credentials are not valid (password)');
    }
    return user;
    // TODO: Return JWT
  }
}
