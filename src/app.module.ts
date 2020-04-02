import { Module } from '@nestjs/common';
import { CardsModule } from './cards/cards.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { typeOrmConfig } from './config/typeorm.config';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [TypeOrmModule.forRoot(typeOrmConfig), CardsModule, AuthModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
