import { PipeTransform, BadRequestException } from '@nestjs/common';
import { TaskStatus } from '../task.model';

export class TaskStatusValidationPipe implements PipeTransform {
  private readonly allowedStatuses = [
    TaskStatus.TO_DO,
    TaskStatus.IN_PROGRESS,
    TaskStatus.DONE,
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
