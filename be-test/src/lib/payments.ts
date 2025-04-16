import { randomUUID } from 'crypto';
import { DocumentClient } from './dynamodb';
import { GetCommand, PutCommand, ScanCommand } from '@aws-sdk/lib-dynamodb';

export const getPayment = async (paymentId: string): Promise<Payment | null> => {
    try {
        const result = await DocumentClient.send(
            new GetCommand({
                TableName: 'PaymentsTable',
                Key: { paymentId },
            })
        );

        return (result.Item as Payment) || null;
    } catch (error) {
        console.error(`Error when get payment by paymentId`, error)
        throw error
    }
};

export const listPayments = async (): Promise<Payment[]> => {
    try {
        const result = await DocumentClient.send(
            new ScanCommand({
                TableName: 'PaymentsTable',
            })
        );
        return (result.Items as Payment[]) || [];

    } catch (error) {
        console.error(`Error when list payments`, error)
        throw error
    }
};

export const listPaymentsByCurrency = async (currency: string): Promise<Payment[]> => {
    try {
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
    } catch (error) {
        console.error(`Error when get payments by currency`, error)
        throw error
    }

};

export const createPayment = async (payment: Payment) => {
    try {
        await DocumentClient.send(
            new PutCommand({
                TableName: 'PaymentsTable',
                Item: payment,
            })
        );
    } catch (error) {
        console.error(`Error when create payment`, error)
        throw error;
    }

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
