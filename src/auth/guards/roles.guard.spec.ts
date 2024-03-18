import { Test, TestingModule } from '@nestjs/testing';
import { Reflector } from '@nestjs/core';
import { RolesGuard } from './roles.guard';
import { UserRole } from '../../constants/roles.enum';
import { ExecutionContext } from '@nestjs/common';

describe('RolesGuard', () => {
  let guard: RolesGuard;
  let reflector: Reflector;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [RolesGuard, Reflector],
    }).compile();

    guard = module.get<RolesGuard>(RolesGuard);
    reflector = module.get<Reflector>(Reflector);
  });

  it('should allow access for users with required roles', async () => {
    const contextMock: ExecutionContext = {
      switchToHttp: () => ({
        getRequest: () => ({
          user: { role: [UserRole.ADMIN] },
        }),
      }),
      getHandler: jest.fn(),
      getClass: jest.fn(),
    } as any;

    const requiredRoles = [UserRole.ADMIN];
    jest
      .spyOn(reflector, 'getAllAndOverride')
      .mockReturnValueOnce(requiredRoles);

    const canActivate = await guard.canActivate(contextMock);
    expect(canActivate).toBe(true);
  });

  it('should deny access for users without required roles', async () => {
    const contextMock: ExecutionContext = {
      switchToHttp: () => ({
        getRequest: () => ({
          user: { role: [UserRole.REGULAR] },
        }),
      }),
      getHandler: jest.fn(),
      getClass: jest.fn(),
    } as any;

    const requiredRoles = [UserRole.ADMIN];
    jest
      .spyOn(reflector, 'getAllAndOverride')
      .mockReturnValueOnce(requiredRoles);

    const canActivate = await guard.canActivate(contextMock);
    expect(canActivate).toBe(false);
  });

  it('should allow access if no roles are required', async () => {
    const contextMock: ExecutionContext = {
      switchToHttp: () => ({
        getRequest: () => ({
          user: { role: [UserRole.REGULAR] },
        }),
      }),
      getHandler: jest.fn(),
      getClass: jest.fn(),
    } as any;

    jest.spyOn(reflector, 'getAllAndOverride').mockReturnValueOnce(null);

    const canActivate = await guard.canActivate(contextMock);
    expect(canActivate).toBe(true);
  });
});
