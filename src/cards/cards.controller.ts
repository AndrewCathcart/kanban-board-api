import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Patch,
  Query,
  UsePipes,
  ValidationPipe,
  ParseIntPipe,
  UseGuards,
} from '@nestjs/common';
import { CardsService } from './cards.service';
import { CreateCardDto } from './dto/create-card.dto';
import { GetCardsFilterDto } from './dto/get-cards-filter.dto';
import { CardStatusValidationPipe } from './pipes/card-status-validation.pipe';
import { Card } from './card.entity';
import { CardStatus } from './card-status.enum';
import { AuthGuard } from '@nestjs/passport';
import { GetUser } from 'src/auth/get-user.decorator';
import { User } from 'src/auth/user.entity';

@Controller('cards')
@UseGuards(AuthGuard())
export class CardsController {
  constructor(private readonly cardsService: CardsService) {}

  @Get()
  getCards(
    @Query(ValidationPipe) filterDto: GetCardsFilterDto,
    @GetUser() user: User,
  ): Promise<Card[]> {
    return this.cardsService.getCards(filterDto, user);
  }

  @Get('/:id')
  getCardById(
    @Param('id', ParseIntPipe) id: number,
    @GetUser() user: User,
  ): Promise<Card> {
    return this.cardsService.getCardById(id, user);
  }

  @Post()
  @UsePipes(ValidationPipe)
  createCard(
    @Body() createCardDto: CreateCardDto,
    @GetUser() user: User,
  ): Promise<Card> {
    return this.cardsService.createCard(createCardDto, user);
  }

  @Delete('/:id')
  deleteCard(
    @Param('id', ParseIntPipe) id: number,
    @GetUser() user: User,
  ): Promise<void> {
    return this.cardsService.deleteCard(id, user);
  }

  @Patch('/:id/status')
  updateCardStatus(
    @Param('id', ParseIntPipe) id: number,
    @Body('status', CardStatusValidationPipe) status: CardStatus,
    @GetUser() user: User,
  ): Promise<Card> {
    return this.cardsService.updateCardStatus(id, status, user);
  }
}
