export interface Notification {
    id: number;
    message: string;
    type: 'MESSAGE' | 'ORDER' | 'SYSTEM';
    isRead: boolean;
    createdAt: string;
}
