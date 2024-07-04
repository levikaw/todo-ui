import { UserRolesEntity } from './user-roles.entity';

export class UserEntity {
  id!: string;
  name!: string;
  surname!: string;
  family!: string;
  login!: string;
  password!: string;
  roleId!: string;
  role!: UserRolesEntity;
}
