import { HttpException, Inject, Injectable } from '@nestjs/common';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { PrismaServices } from '../common/prisma.service';
import { ValidationService } from '../common/validation.service';
import {
  LoginUserRequest,
  RegisterUserRequest,
  UpdateUserRequest,
  UserResponse,
} from '../model/user.model';
import { Logger } from 'winston';
import { UserValidation } from './user.validation';
import * as bcrypt from 'bcrypt';
import { User } from '@prisma/client';
import { JwtService } from '@nestjs/jwt';
@Injectable()
export class UserService {
  constructor(
    private validationService: ValidationService,
    @Inject(WINSTON_MODULE_PROVIDER) private logger: Logger,
    private prismaService: PrismaServices,
    private jwtService: JwtService
  ) {}
  async register(request: RegisterUserRequest): Promise<UserResponse> {
    this.logger.debug(`Register New User ${JSON.stringify(request)}`);
    const registerRequest = this.validationService.validate(
      UserValidation.REGISTER,
      request,
    );
    const totalUserWithSameUsername = await this.prismaService.user.count({
      where: {
        username: registerRequest.username,
      },
    });

    if (totalUserWithSameUsername != 0) {
      throw new HttpException('Username already exists', 400);
    }

    registerRequest.password = await bcrypt.hash(registerRequest.password, 10);

    const user = await this.prismaService.user.create({
      data: registerRequest,
    });

    return {
      username: user.username,
      name: user.name,
      role: user.role
    };
  }

  async validateUser(
    request: LoginUserRequest
  ): Promise<User> {
    this.logger.debug(`attemp login ${JSON.stringify(request)}`);
    const loginRequest = this.validationService.validate(UserValidation.LOGIN, request);

    const user = await this.prismaService.user.findUnique({
      where: {
        username: loginRequest.username
      }
    });

    if(!user){
      throw new HttpException('Username or Password is invalid', 401);
    }

    if(!(user && bcrypt.compareSync(loginRequest.password, user.password))){
      throw new HttpException('Username or Password is invalid', 401);
    }

    return user;
  }

  async login(user: User): Promise<UserResponse> {
    const payload = { username:user.username, sub: user.name  };
    
    return {
      username: user.username,
      name: user.name,
      role: user.role,
      token: this.jwtService.sign(payload),
    }
  }

  async get(user: User): Promise<UserResponse> {
    return {
      username: user.username,
      name: user.name,
      role: user.role
    };
  }

  async update(user: User, request: UpdateUserRequest): Promise<UserResponse> {
    this.logger.debug(
      `UserService.update(${JSON.stringify(user)}), ${JSON.stringify(request)}`,
    );
    const updateRequest: UpdateUserRequest = this.validationService.validate(
      UserValidation.UPDATE,
      request,
    );

    if (updateRequest.name) {
      user.name = updateRequest.name;
    }

    if (updateRequest.password) {
      user.password = await bcrypt.hash(updateRequest.password, 10);
    }

    const result = await this.prismaService.user.update({
      where: {
        username: user.username,
      },
      data: user,
    });
    return {
      name: result.name,
      username: result.username,
      role: result.role
    };
  }
}
