import { TypeOrmModuleOptions } from '@nestjs/typeorm';

export const typeOrmConfig: TypeOrmModuleOptions = {
  type: 'postgres',
  host: 'postgres', // this is our docker container name
  port: 5432,
  username: 'test_user',
  password: 'test_user_password',
  database: 'to_do_app',
  entities: [__dirname + '/../**/*.entity.{js,ts}'],
  synchronize: true,
};
