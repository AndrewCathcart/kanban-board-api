import {
  Entity,
  BaseEntity,
  PrimaryGeneratedColumn,
  Column,
  Unique,
  OneToMany,
} from 'typeorm';

import * as bcrypt from 'bcryptjs';
import { Card } from 'src/cards/card.entity';

@Entity()
@Unique(['username'])
export class User extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  username: string;

  @Column()
  password: string;

  @Column()
  salt: string;

  @OneToMany(
    () => Card,
    card => card.user,
    { eager: true },
  )
  cards: Card[];

  constructor(username: string, password: string, salt: string) {
    super();
    this.username = username;
    this.password = password;
    this.salt = salt;
  }

  async validatePassword(password: string): Promise<boolean> {
    const hash = await bcrypt.hash(password, this.salt);

    return hash === this.password;
  }
}
