import {
  Entity,
  BaseEntity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
} from 'typeorm';
import { CardStatus } from './card-status.enum';
import { User } from 'src/auth/user.entity';

@Entity()
export class Card extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column()
  description: string;

  @Column()
  status: CardStatus;

  @ManyToOne(
    () => User,
    user => user.cards,
    { eager: false },
  )
  user: User;

  @Column()
  userId: number;

  constructor(
    title: string,
    description: string,
    status: CardStatus,
    user: User,
  ) {
    super();
    this.title = title;
    this.description = description;
    this.status = status;
    this.user = user;
  }
}
