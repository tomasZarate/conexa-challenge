import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import { CreateUserDTO } from '../users/dtos/create-user.dto';
import { User } from 'src/users/entities/user.entity';
import { SignInDTO } from './dtos/signin.dto';

describe('AuthService', () => {
  let authService: AuthService;
  let usersService: UsersService;
  let jwtService: JwtService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: UsersService,
          useValue: {
            createUser: jest.fn(),
            findByUsername: jest.fn(),
            validatePassword: jest.fn(),
          },
        },
        {
          provide: JwtService,
          useValue: {
            sign: jest.fn(),
          },
        },
      ],
    }).compile();

    authService = module.get<AuthService>(AuthService);
    usersService = module.get<UsersService>(UsersService);
    jwtService = module.get<JwtService>(JwtService);
  });

  it('should be defined', () => {
    expect(authService).toBeDefined();
  });

  describe('registerUser', () => {
    it('should register a new user', async () => {
      const newUser: CreateUserDTO = {
        username: 'testuser',
        password: 'password123',
      };

      const createdUser: User = {
        id: 1,
        username: 'testuser',
        password: 'password123',
        created_at: new Date(),
        edited_at: new Date(),
        role: 'REGULAR',
      };

      jest.spyOn(usersService, 'createUser').mockResolvedValue(createdUser);

      const result = await authService.registerUser(newUser);

      expect(result).toEqual(createdUser);
    });

    it('should throw error on invalid user data', async () => {
      const newUser: CreateUserDTO = {
        username: 'invalidtestuser',
        password: 'invalidpassword123',
      };

      jest.spyOn(usersService, 'createUser').mockRejectedValue(new Error());

      await expect(authService.registerUser(newUser)).rejects.toThrowError(
        'Invalid user data',
      );
    });
  });

  describe('generateToken', () => {
    it('should generate a token for a valid user', async () => {
      const user: User = {
        id: 1,
        username: 'testUser',
        password: 'hashedPassword',
        created_at: new Date(),
        edited_at: new Date(),
        role: 'REGULAR',
      };

      const tokenPayload = {
        role: user.role,
        sub: user.id,
      };

      const mockToken = 'mockToken';
      jest.spyOn(usersService, 'findByUsername').mockResolvedValue(user);
      jest.spyOn(jwtService, 'sign').mockReturnValue(mockToken);

      const result = await authService.generateToken(user);

      expect(usersService.findByUsername).toHaveBeenCalledWith(user.username);
      expect(jwtService.sign).toHaveBeenCalledWith(tokenPayload, { secret: process.env.JWT_SECRET, expiresIn: '1h' });
      expect(result).toEqual({
        access_token: mockToken,
        user: user,
      });
    });
  });

});
