import { PriorityType, StatusType } from '../types';
import { UserEntity } from '../users/user.entity';

export class TaskEntity {
  id!: string;
  createdAt!: Date;
  updatedAt!: Date;
  deletedAt!: Date;
  expiredAt!: Date;
  title!: string;
  description!: string;
  priority!: PriorityType;
  status!: StatusType;
  authorId!: string;
  assignedToId!: string;
  author!: UserEntity;
  assignedTo!: UserEntity;
}
