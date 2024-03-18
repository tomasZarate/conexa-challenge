import { Test, TestingModule } from '@nestjs/testing';
import { UnauthorizedException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AuthGuard } from './auth.guard';
import { UsersService } from '../../users/users.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { User } from '../../users/entities/user.entity';
import { PUBLIC_KEY } from '../../constants/key-decorator';

describe('AuthGuard', () => {
  let guard: AuthGuard;
  let reflector: Reflector;

  const USER_REPOSITORY_TOKEN = getRepositoryToken(User);

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthGuard,
        UsersService,
        Reflector,
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

    guard = module.get<AuthGuard>(AuthGuard);
    reflector = module.get<Reflector>(Reflector);
  });

  it('should be defined', () => {
    expect(guard).toBeDefined();
  });

  describe('canActivate', () => {
    it('should allow access to public route', async () => {
      const reflectorSpy = jest.spyOn(reflector, 'get').mockReturnValue(true);

      const contextMock: any = {
        switchToHttp: jest.fn().mockReturnThis(),
        getRequest: jest.fn().mockReturnValue({}),
        getHandler: jest.fn(),
      };

      const result = await guard.canActivate(contextMock);

      expect(result).toBeTruthy();
      expect(reflectorSpy).toHaveBeenCalledWith(
        PUBLIC_KEY,
        contextMock.getHandler(),
      );
    });

    it('should throw UnauthorizedException for protected routes with missing or invalid token', async () => {
      const reflectorSpy = jest.spyOn(reflector, 'get').mockReturnValue(false);

      const contextMock: any = {
        switchToHttp: jest.fn().mockReturnThis(),
        getRequest: jest.fn().mockReturnValue({ headers: {} }),
        getHandler: jest.fn(),
      };

      await expect(guard.canActivate(contextMock)).rejects.toThrowError(
        UnauthorizedException,
      );
      expect(reflectorSpy).toHaveBeenCalledWith(
        PUBLIC_KEY,
        contextMock.getHandler(),
      );
    });
  });
});
