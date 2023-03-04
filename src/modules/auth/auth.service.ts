import { BadRequestException, Injectable } from '@nestjs/common';
import { UserService } from '../user/user.service';
import { JwtService } from '@nestjs/jwt';
import { PasswordService } from '../utils/password.service';
import { User } from '../user/models/user.model';
import { LoginDto } from './DTO/login.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UserService,
    private readonly passwordService: PasswordService,
    private readonly jwtService: JwtService,
  ) {}

  async sessions(loginDto: LoginDto) {
    const user = await this.usersService.getUserByEmail(loginDto.email);
    console.log(user);
    if (!user) {
      throw new BadRequestException(" User don't exist");
    }
    const isPasswordMatching = await this.passwordService.comparePassword(
      loginDto.password,
      user.password,
    );
    if (!isPasswordMatching) {
      throw new BadRequestException('Wrong credentials provided');
    }
    const access_token = await this.issueToken(user);
    return { token: access_token };
  }

  async issueToken(data: Omit<User, 'password'>): Promise<string> {
    return this.jwtService.sign({
      ...data,
    });
  }

  async createUser(dto) {
    const user = await this.usersService.create(dto);

    const access_token = await this.issueToken(user);
    return { token: access_token };
  }
}
