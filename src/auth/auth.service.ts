import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { CreateUserDTO } from '../users/dtos/create-user.dto';
import { UsersService } from '../users/users.service';
import { User } from '../users/entities/user.entity';
import { SignInDTO } from './dtos/signin.dto';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { AuthTokenResponse } from 'src/interfaces/auth.interfaces';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
    @Inject(UsersService) private usersService: UsersService,
  ) {}

  async registerUser(newUser: CreateUserDTO): Promise<User> {
    try {
      const user = await this.usersService.createUser(newUser);
      return user;
    } catch (error) {
      throw new HttpException('Invalid user data', HttpStatus.BAD_REQUEST);
    }
  }

  async generateToken(user: User): Promise<AuthTokenResponse> {
    const userFromDb = await this.usersService.findByUsername(user.username);
    const payload = {
      role: userFromDb.role,
      sub: userFromDb.id,
    };

    return {
      access_token: this.jwtService.sign(payload, {
        secret: this.configService.get<string>('JWT_SECRET'),
        expiresIn: this.configService.get<string>('JWT_EXPIRATES_IN'),
      }),
      user: user,
    };
  }

  async validateUser(signInDTO: SignInDTO): Promise<User> {
    const { username, password } = signInDTO;

    const user = await this.usersService.findByUsername(username);

    if (user) {
      const isValid = await this.usersService.validatePassword(
        password,
        user.password,
      );
      if (isValid) return user;
    }

    return null;
  }
}
