import { EntityRepository, Repository } from 'typeorm';
import { Card } from './card.entity';
import { CreateCardDto } from './dto/create-card.dto';
import { CardStatus } from './card-status.enum';
import { GetCardsFilterDto } from './dto/get-cards-filter.dto';
import { User } from 'src/auth/user.entity';
import { Logger, InternalServerErrorException } from '@nestjs/common';

@EntityRepository(Card)
export class CardRepository extends Repository<Card> {
  private logger = new Logger('CardRepository');

  async createCard(createCardDto: CreateCardDto, user: User): Promise<Card> {
    const { title, description } = createCardDto;

    const card = new Card(title, description, CardStatus.TO_DO, user);
    await card.save();

    delete card.user;

    return card;
  }

  async getCards(filterDto: GetCardsFilterDto, user: User): Promise<Card[]> {
    const { status, search } = filterDto;

    const query = this.createQueryBuilder('card');

    query.where('card.userId = :userId', { userId: user.id });

    if (status) {
      query.andWhere('card.status = :status', { status });
    }

    if (search) {
      query.andWhere(
        'card.title LIKE :search OR card.description LIKE :search',
        { search: `%${search}%` },
      );
    }

    try {
      const cards = await query.getMany();
      return cards;
    } catch (error) {
      this.logger.error(
        `Failed to get tasks for user "${
          user.username
        }". Filters: ${JSON.stringify(filterDto)}`,
        error.stack,
      );
      throw new InternalServerErrorException();
    }
  }
}
