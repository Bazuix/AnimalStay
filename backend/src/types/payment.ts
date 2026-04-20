export interface Payment {
    id?: number;
    amount: number;
    status: string;
    paidAt?: Date;
    stayId: number;
}