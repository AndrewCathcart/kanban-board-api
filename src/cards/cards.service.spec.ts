import { Test, TestingModule } from '@nestjs/testing';
import { CardsService } from './cards.service';
import { CardRepository } from './card.repository';
import { GetCardsFilterDto } from './dto/get-cards-filter.dto';
import { CardStatus } from './card-status.enum';
import { User } from 'src/auth/user.entity';
import { NotFoundException } from '@nestjs/common';

const mockUser: User = {
  id: 1,
  username: 'Bob',
  password: null,
  cards: null,
  validatePassword: null,
  hasId: null,
  reload: null,
  remove: null,
  salt: null,
  save: null,
};

describe('CardsService', () => {
  let cardsService: CardsService;
  let cardRepository: CardRepository;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CardsService, CardRepository],
    })
      .overrideProvider(CardRepository)
      .useValue({
        getCards: jest.fn(),
        findOne: jest.fn(),
        createCard: jest.fn(),
        delete: jest.fn(),
      })
      .compile();

    cardsService = module.get<CardsService>(CardsService);
    cardRepository = module.get<CardRepository>(CardRepository);
  });

  it('should be defined', () => {
    expect(cardsService).toBeDefined();
  });

  describe('getCards', () => {
    it('gets all cards from the repository', async () => {
      (cardRepository.getCards as jest.Mock).mockResolvedValue('a value');

      expect(cardRepository.getCards).not.toHaveBeenCalled();
      const filters: GetCardsFilterDto = {
        status: CardStatus.TO_DO,
        search: 'test',
      };
      const result = await cardsService.getCards(filters, mockUser);

      expect(cardRepository.getCards).toHaveBeenCalled();
      expect(result).toEqual('a value');
    });
  });

  describe('getCardsById', () => {
    it('calls cardRepository.findOne() and successfully returns a card', async () => {
      const mockCard = { title: 'Test title', description: 'Test description' };
      (cardRepository.findOne as jest.Mock).mockResolvedValue(mockCard);

      const result = await cardsService.getCardById(1, mockUser);

      expect(result).toEqual(mockCard);
      expect(cardRepository.findOne).toHaveBeenCalledWith({
        where: { id: 1, userId: mockUser.id },
      });
    });

    it('throws an error because the card is not found', async () => {
      (cardRepository.findOne as jest.Mock).mockResolvedValue(null);

      expect(cardsService.getCardById(1, mockUser)).rejects.toThrow(
        new NotFoundException('Card with id "1" could not be found.'),
      );
    });
  });

  describe('createCard', () => {
    it('calls cardRepository.create() and returns the result', async () => {
      (cardRepository.createCard as jest.Mock).mockResolvedValue(
        'createCardResult',
      );
      expect(cardRepository.createCard).not.toHaveBeenCalled();
      const createCardDto = {
        title: 'Test card',
        description: 'Test description',
      };

      const result = await cardsService.createCard(createCardDto, mockUser);

      expect(cardRepository.createCard).toHaveBeenCalledWith(
        createCardDto,
        mockUser,
      );
      expect(result).toEqual('createCardResult');
    });
  });

  describe('deleteCard', () => {
    it('calls cardRepository.deleteCard() to delete a card', async () => {
      (cardRepository.delete as jest.Mock).mockResolvedValue({ affected: 1 });
      expect(cardRepository.delete).not.toHaveBeenCalled();

      await cardsService.deleteCard(1, mockUser);

      expect(cardRepository.delete).toHaveBeenCalledWith({
        id: 1,
        userId: mockUser.id,
      });
    });

    it('throws an error as the card could not be found', () => {
      (cardRepository.delete as jest.Mock).mockResolvedValue({ affected: 0 });

      expect(cardsService.deleteCard(1, mockUser)).rejects.toThrow(
        new NotFoundException(
          'Card with id "1" could not be deleted as it does not exist.',
        ),
      );
    });
  });

  describe('updateCardStatus', () => {
    it('updates a card status', async () => {
      const save = jest.fn().mockResolvedValue(true);
      cardsService.getCardById = jest.fn().mockResolvedValue({
        status: CardStatus.TO_DO,
        save,
      });
      expect(cardsService.getCardById).not.toHaveBeenCalled();

      const result = await cardsService.updateCardStatus(
        1,
        CardStatus.IN_PROGRESS,
        mockUser,
      );

      expect(cardsService.getCardById).toHaveBeenCalled();
      expect(save).toHaveBeenCalled();
      expect(result.status).toEqual(CardStatus.IN_PROGRESS);
    });
  });
});
