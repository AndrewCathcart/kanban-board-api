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

    try {
      await card.save();
    } catch (error) {
      this.logger.error(
        `Failed to create a new card for user: ${
          user.username
        }. createCardDto: ${JSON.stringify(createCardDto)}`,
        error.stack,
      );
      throw new InternalServerErrorException();
    }

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
        'LOWER(card.title) LIKE :search OR LOWER(card.description) LIKE :search',
        { search: `%${search.toLowerCase()}%` },
      );
    }

    try {
      const cards = await query.getMany();
      return cards;
    } catch (error) {
      this.logger.error(
        `Failed to get cards for user "${
          user.username
        }". Filters: ${JSON.stringify(filterDto)}`,
        error.stack,
      );
      throw new InternalServerErrorException();
    }
  }
}
