import {
  Body,
  Controller,
  HttpException,
  HttpStatus,
  Post,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDTO } from '../users/dtos/create-user.dto';
import { SignInDTO } from './dtos/signin.dto';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { AuthTokenResponse } from 'src/interfaces/auth.interfaces';

@ApiTags('auth')
@Controller('')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('/login')
  @ApiOperation({ summary: 'Login' })
  async login(@Body() signInDTO: SignInDTO): Promise<AuthTokenResponse> {
    const user = await this.authService.validateUser(signInDTO);

    if (!user) {
      throw new HttpException(
        'Incorrect username or password',
        HttpStatus.UNAUTHORIZED,
      );
    }

    const jwt = await this.authService.generateToken(user);

    return jwt;
  }

  @Post('register')
  @ApiOperation({ summary: 'Register' })
  async register(@Body() newUser: CreateUserDTO) {
    if (!newUser.username || !newUser.password) {
      throw new HttpException('Invalid user data', HttpStatus.BAD_REQUEST);
    }

    return await this.authService.registerUser(newUser);
  }
}
