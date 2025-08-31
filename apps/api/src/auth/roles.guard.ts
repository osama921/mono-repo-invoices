import { CanActivate, ExecutionContext, Injectable, SetMetadata } from '@nestjs/common';
import { Reflector } from '@nestjs/core';

export const Roles = (...roles: string[]) => SetMetadata('roles', roles);

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}
  canActivate(ctx: ExecutionContext): boolean {
    const required = this.reflector.get<string[]>('roles', ctx.getHandler()) || [];
    if (required.length === 0) return true;
    const req = ctx.switchToHttp().getRequest();
    const user = req.user;
    return user && user.role && required.includes(user.role);
  }
}
