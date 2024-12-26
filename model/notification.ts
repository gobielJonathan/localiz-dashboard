export interface NotificationValue {
  id: string;
  title: string;
  description: string;
  time: string;
  actions?: {
    text: string;
    url: string;
    type: 'primary' | 'secondary';
  }[];
}
