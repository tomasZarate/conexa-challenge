import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from './users.service';
import { User } from './entities/user.entity';
import { CreateUserDTO } from './dtos/create-user.dto';
import { Repository } from 'typeorm';
import { getRepositoryToken } from '@nestjs/typeorm';
import * as bcrypt from 'bcrypt';
import { HttpException, HttpStatus } from '@nestjs/common';
import { UserRole } from '../constants/roles.enum';

describe('UsersService', () => {
  let service: UsersService;
  let userRepository: Repository<User>;

  const USER_REPOSITORY_TOKEN = getRepositoryToken(User);

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: USER_REPOSITORY_TOKEN,
          useValue: {
            create: jest.fn(),
            save: jest.fn(),
            findOne: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
    userRepository = module.get<Repository<User>>(USER_REPOSITORY_TOKEN);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('userRepository should be defined', () => {
    expect(userRepository).toBeDefined();
  });

  describe('createUser', () => {
    it('should create a new user', async () => {
      const newDate = new Date();

      jest.spyOn(userRepository, 'create').mockReturnValueOnce({
        id: 1,
        username: 'testuser1',
        password: 'password123',
        created_at: newDate,
        edited_at: newDate,
        role: UserRole.REGULAR,
      });

      jest.spyOn(bcrypt, 'hash').mockReturnValueOnce('hashedPassword');

      const userDto: CreateUserDTO = {
        username: 'testuser1',
        password: 'password123',
      };

      await service.createUser(userDto);

      expect(userRepository.create).toHaveBeenCalledWith({
        username: 'testuser1',
        password: 'hashedPassword',
      });
      expect(bcrypt.hash).toHaveBeenCalledWith('password123', 10);
    });

    it('should throw error when provided with invalid userDto', async () => {
      const invalidUserDto: CreateUserDTO = {
        username: '',
        password: 'password123',
      };

      try {
        await service.createUser(invalidUserDto);
      } catch (error) {
        expect(error).toBeInstanceOf(Error);
        expect(error.message).toBe('Invalid userDto provided');
      }
    });

    it('should throw error when trying to create a user with an existing username', async () => {
      const existingUser = {
        id: 2,
        username: 'testuser1',
        password: 'hashedPassword',
        created_at: new Date(),
        edited_at: new Date(),
        role: UserRole.REGULAR,
      };

      jest.spyOn(userRepository, 'findOne').mockResolvedValueOnce(existingUser);

      const userDto: CreateUserDTO = {
        username: 'testuser1',
        password: 'password123',
      };

      try {
        await service.createUser(userDto);
      } catch (error) {
        expect(error).toBeInstanceOf(HttpException);
        expect(error.message).toBe('User already exists');
        expect(error.getStatus()).toBe(HttpStatus.CONFLICT);
      }
    });
  });

  describe('findByUsername', () => {
    it('should find the user by name', async () => {
      const username = 'testuser1';
      const expectedUser = {
        id: 1,
        username: username,
        password: 'hashedPassword',
        created_at: new Date(),
        edited_at: new Date(),
        role: UserRole.REGULAR,
      };

      jest.spyOn(userRepository, 'findOne').mockResolvedValueOnce(expectedUser);

      const foundUser = await service.findByUsername(username);
      expect(foundUser).toEqual(expectedUser);
    });

    it('should handle user not found', async () => {
      const username = 'nonexistentuser';

      jest.spyOn(userRepository, 'findOne').mockResolvedValueOnce(null);

      const foundUser = await service.findByUsername(username);
      expect(foundUser).toBeNull();
    });

    it('should handle errors', async () => {
      const username = 'testuser1';

      jest
        .spyOn(userRepository, 'findOne')
        .mockRejectedValueOnce(new Error('Database error'));

      await expect(service.findByUsername(username)).rejects.toThrowError(
        'Database error',
      );
    });

    it('should handle invalid input', async () => {
      const username = '';

      jest
        .spyOn(userRepository, 'findOne')
        .mockRejectedValueOnce(new Error('findOne should not be called'));

      const foundUser = await service.findByUsername(username);
      expect(foundUser).toBeNull();
    });
  });
});
