import { registerAs } from '@nestjs/config';

export const bcryptConfig = registerAs('bcryptConfig', () => ({
  saltRounds: 10,
}));
