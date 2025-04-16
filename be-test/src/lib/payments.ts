import { randomUUID } from 'crypto';
import { DocumentClient } from './dynamodb';
import { GetCommand, PutCommand, ScanCommand } from '@aws-sdk/lib-dynamodb';

export const getPayment = async (paymentId: string): Promise<Payment | null> => {
    const result = await DocumentClient.send(
        new GetCommand({
            TableName: 'PaymentsTable',
            Key: { paymentId },
        })
    );

    return (result.Item as Payment) || null;
};

export const listPayments = async (): Promise<Payment[]> => {
    const result = await DocumentClient.send(
        new ScanCommand({
            TableName: 'PaymentsTable',
        })
    );

    return (result.Items as Payment[]) || [];
};

export const listPaymentsByCurrency = async (currency: string): Promise<Payment[]> => {
    const result = await DocumentClient.send(
        new ScanCommand({
            TableName: 'PaymentsTable',
            FilterExpression: 'currency = :currency',
            ExpressionAttributeValues: {
                ':currency': currency
            }
        })
    );

    return (result.Items as Payment[]) || [];
};

export const createPayment = async (payment: Payment) => {
    await DocumentClient.send(
        new PutCommand({
            TableName: 'PaymentsTable',
            Item: payment,
        })
    );
};

export type Payment = {
    id: string;
    amount: number;
    currency: string;
};

// TODO: paymentId need to be unique and implement properly, for now I just return randomUUID
export const generateUniqueUUID = (): string => {
    return randomUUID().toString();
}
