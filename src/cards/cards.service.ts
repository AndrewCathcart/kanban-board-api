import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateCardDto } from './dto/create-card.dto';
import { GetCardsFilterDto } from './dto/get-cards-filter.dto';
import { CardRepository } from './card.repository';
import { InjectRepository } from '@nestjs/typeorm';
import { Card } from './card.entity';
import { CardStatus } from './card-status.enum';
import { User } from 'src/auth/user.entity';

@Injectable()
export class CardsService {
  constructor(
    @InjectRepository(CardRepository)
    private readonly cardRepository: CardRepository,
  ) {}

  async getCards(filterDto: GetCardsFilterDto, user: User): Promise<Card[]> {
    return this.cardRepository.getCards(filterDto, user);
  }

  async getCardById(id: number, user: User): Promise<Card> {
    const card = await this.cardRepository.findOne({
      where: { id, userId: user.id },
    });

    if (!card) {
      throw new NotFoundException(`Card with id "${id}" could not be found.`);
    }

    return card;
  }

  async createCard(createCardDto: CreateCardDto, user: User): Promise<Card> {
    return this.cardRepository.createCard(createCardDto, user);
  }

  async deleteCard(id: number, user: User): Promise<void> {
    const result = await this.cardRepository.delete({ id, userId: user.id });

    if (result.affected === 0) {
      throw new NotFoundException(
        `Card with id "${id}" could not be deleted as it does not exist.`,
      );
    }
  }

  async updateCardStatus(
    id: number,
    status: CardStatus,
    user: User,
  ): Promise<Card> {
    const card = await this.getCardById(id, user);

    card.status = status;
    await card.save();

    return card;
  }
}
