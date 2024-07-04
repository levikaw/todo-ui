export interface SaveTask {
  title: string;
  description: string;
  status: string;
  priority: string;
  assignedToId: string;
  expiredAt: Date;
}
