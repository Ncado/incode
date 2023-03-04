import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './models/user.model';
import { Repository } from 'typeorm';
import { RoleEnum } from './enum/role.enum';
import { PasswordService } from '../utils/password.service';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    private readonly passwordService: PasswordService,
  ) {}

  async create(user): Promise<User> {
    if (user.boss) {
      const boss = await this.findById(user.boss);
      if (boss.role == RoleEnum.REGULAR) {
        await this.userRepository.save({ ...boss, role: RoleEnum.BOSS });
      }
    }
    if (await this.getUserByEmail(user.email)) {
      throw new BadRequestException('user already exists');
    }

    const bycriptedPassword = await this.passwordService.hashPassword(
      user.password,
    );
    return await this.userRepository.save({
      ...user,
      password: bycriptedPassword,
    });
  }

  async getUserDataRecursive(userId: number): Promise<User> {
    const user = await this.userRepository.findOne({
      where: { id: userId },
      relations: { subordinates: true, boss: true },
    });
    console.log(user);
    if (!user) {
      return null;
    }

    if (user.subordinates.length > 0) {
      const subordinates = await Promise.all(
        user.subordinates.map((subordinate) =>
          this.getUserDataRecursive(subordinate.id),
        ),
      );
      user.subordinates = subordinates;
    }

    return user;
  }

  async getAllUserData(): Promise<User[]> {
    // Get all users and their subordinates recursively
    const users = await this.userRepository.find({
      relations: { subordinates: true },
    });

    // Map over each user and their subordinates recursively to include all data
    return users.map((user) => this.mapUserWithSubordinates(user));
  }

  async doesBossHaveSubordinateById(
    bossId: number,
    subordinateId: number,
  ): Promise<boolean> {
    // Get the boss and their subordinates
    const boss = await this.getUserDataRecursive(bossId);

    // If the boss doesn't exist or has no subordinates, return false
    if (!boss || !boss.subordinates) {
      return false;
    }

    // Check if any subordinate has the given id (recursively)
    const checkSubordinates = (subordinates: User[]): boolean => {
      for (const subordinate of subordinates) {
        if (subordinate.id === subordinateId) {
          return true;
        }
        if (subordinate.subordinates && subordinate.subordinates.length > 0) {
          if (checkSubordinates(subordinate.subordinates)) {
            return true;
          }
        }
      }
      return false;
    };

    return checkSubordinates(boss.subordinates);
  }

  async changeBoss(
    userId: number,
    newBossId: number,
    currentUserId: number,
  ): Promise<User> {
    // Get the user and the new boss
    const user = await this.findById(userId);

    if (user.role == RoleEnum.ADMINISTRATOR) {
      throw new NotFoundException("User is admin, you can't change the boss");
    }
    if (!(await this.doesBossHaveSubordinateById(currentUserId, userId))) {
      throw new NotFoundException('you can modify only yours subordinates');
    }
    const newBoss = await this.findById(newBossId);

    // const x = this.userRepository.save({ ...user, boss: newBoss });
    await this.userRepository.save({ ...newBoss, boss: user });

    await this.userRepository.save({ ...user, boss: newBoss });
    ////

    const updated = await this.findById(newBossId);

    const sycleCheck = await this.userRepository.findOne({
      where: {
        id: newBossId,
      },
      relations: { subordinates: true },
    });

    console.log('sycleCheck.subordinates?.length', sycleCheck);
    if (sycleCheck.subordinates?.length > 0) {
      for (const sycleCheckKey of sycleCheck.subordinates) {
        console.log('sycleCheckKey', sycleCheckKey);
        if (sycleCheckKey.id == user.boss.id) {
          return newBoss;
        }
      }
    }
    await this.userRepository.save({ ...updated, boss: user.boss });

    return newBoss;
  }

  async findById(id: number): Promise<User> {
    return this.userRepository.findOne({
      where: { id: id },
      relations: { subordinates: true, boss: true },
    });
  }

  async getUserByEmail(email: string) {
    return this.userRepository.findOne({
      where: { email: email },
      //relations: { subordinates: true, boss: true },
    });
  }

  private mapUserWithSubordinates(user: User): User {
    const subordinates = user.subordinates
      ? user.subordinates.map((subordinate) =>
          this.mapUserWithSubordinates(subordinate),
        )
      : [];

    return {
      ...user,
      boss: user.boss ? this.mapUserWithSubordinates(user.boss) : null,
      subordinates,
    };
  }
}
