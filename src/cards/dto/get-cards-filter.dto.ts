import { CardStatus } from '../card-status.enum';
import { IsOptional, IsIn, IsNotEmpty } from 'class-validator';

export class GetCardsFilterDto {
  @IsOptional()
  @IsIn([CardStatus.TO_DO, CardStatus.IN_PROGRESS, CardStatus.DONE])
  status: CardStatus;

  @IsOptional()
  @IsNotEmpty()
  search: string;
}
