import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { CreateUserDTO } from '../users/dtos/create-user.dto';
import { User } from '../users/entities/user.entity';
import { UsersService } from '../users/users.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { SignInDTO } from './dtos/signin.dto';

describe('AuthController', () => {
  let authController: AuthController;
  let authService: AuthService;
  let usersService: UsersService;

  const USER_REPOSITORY_TOKEN = getRepositoryToken(User);

  const mockUsersService = {
    findByUsername: jest.fn().mockImplementation((username: string) => {
      if (username === 'testuser') {
        return {
          id: 1,
          username: 'testuser',
          password: 'hashedpassword',
          role: 'REGULAR',
        };
      }
      return null;
    }),
    createUser: jest.fn(),
  };
  
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        AuthService,
        {
          provide: UsersService,
          useValue: mockUsersService
        },
        {
          provide: USER_REPOSITORY_TOKEN,
          useValue: {
            create: jest.fn(),
            save: jest.fn(),
            findOne: jest.fn(),
          },
        },
        ConfigService
      ],
      imports: [
        JwtModule.registerAsync({
          imports: [ConfigModule.forRoot()],
          useFactory: async (configService: ConfigService) => ({
            secret: configService.get<string>('JWT_SECRET'),
            signOptions: { expiresIn: '1h' }
          }),
          inject: [ConfigService],
        }),
      ],
    }).compile();

    authController = module.get<AuthController>(AuthController);
    authService = module.get<AuthService>(AuthService);
    usersService = module.get<UsersService>(UsersService);
  });

  describe('register', () => {
    it('should register new user with valid data', async () => {
      const newUser: CreateUserDTO = {
        username: 'testuser',
        password: 'password123',
      };

      const registeredUser = {
        id: 1,
        username: newUser.username,
        password: newUser.password,
        created_at: new Date(),
        edited_at: new Date(),
        role: 'regular',
      };

      jest.spyOn(authService, 'registerUser').mockResolvedValueOnce(registeredUser);

      const result = await authController.register(newUser);
      expect(result).toEqual(registeredUser);
    });

    it('should return error with invalid user data', async () => {
      const invalidUser: CreateUserDTO = {
        username: '',
        password: 'password123',
      };

      await expect(authController.register(invalidUser)).rejects.toThrowError('Invalid user data');
    });
  });

  describe('login', () => {
    it('should login user with valid credentials', async () => {
      const mockUser = {
        id: 1,
        username: 'testuser',
        password: 'password123',
        created_at: new Date(),
        edited_at: new Date(),
        role: 'regular',
      };
      jest.spyOn(authService, 'validateUser').mockResolvedValue(mockUser);

      const loginCredentials: SignInDTO = {
        username: 'testuser',
        password: 'password123',
      };

      const result = await authController.login(loginCredentials);

      expect(result).toHaveProperty('access_token');
    });

    it('should fail to login with invalid credentials', async () => {
      const invalidCredentials: SignInDTO = {
        username: 'testuser',
        password: 'wrongpassword',
      };

      jest.spyOn(authService, 'validateUser').mockResolvedValueOnce(null);

      await expect(authController.login(invalidCredentials)).rejects.toThrowError('Incorrect username or password');
    });
  });
});
