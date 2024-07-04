import { PRIORITY_NAMES, STATUS_NAMES } from './constants';
import { ROLE_ALIAS } from './constants';

export type RoleAliasType = (typeof ROLE_ALIAS)[keyof typeof ROLE_ALIAS];

export type StatusType = (typeof STATUS_NAMES)[keyof typeof STATUS_NAMES];

export type PriorityType = (typeof PRIORITY_NAMES)[keyof typeof PRIORITY_NAMES];
