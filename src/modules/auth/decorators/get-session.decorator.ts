import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const GetUserFromSession = createParamDecorator(
  (data: undefined, ctx: ExecutionContext) => {
    return ctx.switchToHttp().getRequest().user;
  },
);
