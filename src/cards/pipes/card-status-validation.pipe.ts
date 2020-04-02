import { PipeTransform, BadRequestException } from '@nestjs/common';
import { CardStatus } from '../card-status.enum';

export class CardStatusValidationPipe implements PipeTransform {
  private readonly allowedStatuses = [
    CardStatus.TO_DO,
    CardStatus.IN_PROGRESS,
    CardStatus.DONE,
  ];

  transform(value: any) {
    value = value.toUpperCase();

    if (this.isInvalidStatus(value)) {
      throw new BadRequestException(`"${value}" is an invalid status.`);
    }

    return value;
  }

  private isInvalidStatus(status: any) {
    const index = this.allowedStatuses.indexOf(status);
    return index === -1;
  }
}
