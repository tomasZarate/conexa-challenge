import { Body, Controller, HttpException, HttpStatus, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDTO } from '../users/dtos/create-user.dto';
import { validate } from 'class-validator';
import { SignInDTO } from './dtos/signin.dto';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('auth')
@Controller('')
export class AuthController {

    constructor(private authService: AuthService) { }

    @Post('/login')
    async login(@Body() signInDTO: SignInDTO): Promise<string> {
        const user = await this.authService.validateUser(signInDTO)

        if (!user) {
            throw new HttpException('Incorrect username or password', HttpStatus.UNAUTHORIZED)
        }

        const jwt = await this.authService.generateToken(user)

        return jwt
    }

    @Post('register')
    async register(@Body() newUser: CreateUserDTO) {
        if (!newUser.username || !newUser.password) {
            throw new Error('Invalid user data');
        }
    
        return await this.authService.registerUser(newUser);
    }
}
