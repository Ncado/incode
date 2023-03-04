import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { UserModule } from '../user/user.module';
import { UtilsModule } from '../utils/utils.module';
import { PassportModule } from '@nestjs/passport';
import { authConfig } from '../../config/auth.config';
import { ConfigModule } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy } from './strategies/jwt.strategy';

@Module({
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy],
  imports: [
    UserModule,
    UtilsModule,
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.registerAsync(authConfig.asProvider()),
    ConfigModule.forFeature(authConfig),
  ],
})
export class AuthModule {}
