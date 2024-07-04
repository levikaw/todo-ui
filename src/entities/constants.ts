export const PRIORITY_NAMES = {
  HIGH: 'high',
  MEDIUM: 'medium',
  LOW: 'low',
} as const;

export const STATUS_NAMES = {
  BACKLOG: 'backlog',
  PROGRESS: 'progress',
  DONE: 'done',
  CANCELED: 'canceled',
} as const;

export const ROLE_ALIAS = {
  ADMIN: 'admin',
  USER: 'user',
} as const;
