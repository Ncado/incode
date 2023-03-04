import { registerAs } from '@nestjs/config';
import { Env } from '../modules/utils/validate-env';
import { TypeOrmModuleOptions } from '@nestjs/typeorm';

export const databaseConfig = registerAs(
  'databaseConfig',
  (): TypeOrmModuleOptions => ({
    type: 'postgres',
    host: Env.string('DB_HOST'),
    port: Env.number('DB_PORT'),
    username: Env.string('DB_USERNAME'),
    password: Env.string('DB_PASSWORD'),
    database: Env.string('DB_DATABASE'),
    autoLoadEntities: true,
    synchronize: true,
    // url: `postgres://user:password@postgres:5432/db`,
  }),
);
