import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import { CreateUserDTO } from './dtos/create-user.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {

    constructor(@InjectRepository(User) private readonly usersRepository: Repository<User>) {

    }

    async createUser(createUserDto: CreateUserDTO): Promise<User> {
        const existingUser = await this.usersRepository.findOne({
            where: { username: createUserDto.username }
        })

        if (existingUser) {
            throw new HttpException('User already exists', HttpStatus.CONFLICT)
        }

        const { password, ...userData } = createUserDto

        const hashedPassword = await bcrypt.hash(password, 10)

        const newUser = this.usersRepository.create({ ...userData, password: hashedPassword })

        return this.usersRepository.save(newUser)
    }

    async findByUsername(username: string): Promise<User> {

        if(!username.length) {
            return null;    
        }

        const user = await this.usersRepository.findOne({
            where: { username },
        });

        return user;
    }

    validatePassword(inputPassword: string, hashedPassword: string): Promise<Boolean> {
        return bcrypt.compare(inputPassword, hashedPassword)
    }
}
