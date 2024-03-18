import { Inject, Injectable } from '@nestjs/common';
import { CreateUserDTO } from '../users/dtos/create-user.dto';
import { UsersService } from '../users/users.service';
import { User } from '../users/entities/user.entity';
import { SignInDTO } from './dtos/signin.dto';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AuthService {

    constructor(
        private readonly jwtService: JwtService,
        private readonly configService: ConfigService,
        @Inject(UsersService) private usersService: UsersService
    ) { }

    async registerUser(newUser: CreateUserDTO) {
        try {
            const user = await this.usersService.createUser(newUser);
            return user;
        } catch (error) {
            throw new Error('Invalid user data');
        }
    }

    async generateToken(user: User): Promise<any> {
        const getUser = await this.usersService.findByUsername(user.username)
        const payload = {
            role: getUser.role,
            sub: getUser.id,
        }

        return {
            access_token: this.jwtService.sign(payload, { secret: this.configService.get<string>('JWT_SECRET'), expiresIn: '1h' }),
            user: user
        };
    }

    async validateUser(signInDTO: SignInDTO): Promise<User> {
        const { username, password } = signInDTO

        const user = await this.usersService.findByUsername(username)

        if (user) {
            const isValid = await this.usersService.validatePassword(password, user.password)
            if (isValid) return user
        }

        return null
    }
}
