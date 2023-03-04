import { Controller, Get, Patch, Query, UseGuards } from '@nestjs/common';
import { UserService } from './user.service';
import { User } from './models/user.model';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { GetUserFromSession } from '../auth/decorators/get-session.decorator';
import { RoleEnum } from './enum/role.enum';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @UseGuards(JwtAuthGuard)
  @Get(':id')
  async findById(@GetUserFromSession() user) {
    if (user.role == RoleEnum.ADMINISTRATOR) {
      return this.userService.getAllUserData();
    }
    return this.userService.getUserDataRecursive(user.id);
  }

  @Get('/ishave/boss')
  async doesBossHaveSubordinateById(
    @Query('bossId') bossId: string,
    @Query('subordinateId') subordinateId: string,
  ) {
    return this.userService.doesBossHaveSubordinateById(
      Number(bossId),
      Number(subordinateId),
    );
  }

  @UseGuards(JwtAuthGuard)
  @Patch()
  async changeBoss(
    @Query('id') id: number,
    @Query('newBossId') newBossId: number,
    @GetUserFromSession() user,
  ): Promise<User> {
    return this.userService.changeBoss(id, newBossId, user.id);
  }
}
