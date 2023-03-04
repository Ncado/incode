import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './modules/user/user.module';
import { AuthModule } from './modules/auth/auth.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { databaseConfig } from './config/database.config';
import { ConfigModule } from '@nestjs/config';
import { UtilsModule } from './modules/utils/utils.module';

@Module({
  imports: [
    UserModule,
    AuthModule,
    TypeOrmModule.forRootAsync(databaseConfig.asProvider()),
    ConfigModule.forRoot(),
    UtilsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
