import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { RoleEnum } from '../user/enum/role.enum';
import { LoginDto } from './DTO/login.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('/login')
  async sessions(@Body() loginDto: LoginDto) {
    const result = await this.authService.sessions(loginDto);
    return result;
  }

  @Post('admin')
  async createAdministrator(@Body() user) {
    user['role'] = RoleEnum.ADMINISTRATOR;
    return this.authService.createUser(user);
  }

  @Post('worker')
  async createRegularWorker(@Body() user) {
    user['role'] = RoleEnum.REGULAR;
    return this.authService.createUser(user);
  }
}
