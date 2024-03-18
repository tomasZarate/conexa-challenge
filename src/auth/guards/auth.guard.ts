import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { PUBLIC_KEY } from '../../constants/key-decorator';
import { UseToken } from '../../interfaces/auth.interfaces';
import { UsersService } from '../../users/users.service';
import { useToken } from '../../utils/use.token';

@Injectable()
export class AuthGuard implements CanActivate {

  constructor(
    private readonly usersService: UsersService,
    private readonly reflector: Reflector) { }

  async canActivate(
    context: ExecutionContext,
  ): Promise<any> {

    const is_public = this.reflector.get<Boolean>(PUBLIC_KEY, context.getHandler())

    if (is_public) return true
    const request = context.switchToHttp().getRequest()
    
    const token = request.headers['authorization']?.split(' ')[1];
    
    if (!token || Array.isArray(token)) {
      throw new UnauthorizedException('Invalid token')
    }

    const manageToken: UseToken | string = useToken(token)

    if (typeof manageToken == 'string') {
      throw new UnauthorizedException(manageToken)
    }

    if (manageToken.isExpired) {
      throw new UnauthorizedException('Token expired')
    }

    const userId = parseInt(manageToken.sub, 10);

    const user = await this.usersService.findUserById(userId)

    if (!user) {
      throw new UnauthorizedException('Invalid user')
    }

    request.user = user

    return true;
  }
}
