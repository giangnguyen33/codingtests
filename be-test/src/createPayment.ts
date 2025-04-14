import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import { buildResponse, parseInput } from './lib/apigateway';
import { createPayment, Payment, generateUniqueUUID } from './lib/payments';

export type CreatePaymentPayload = {
    amount: number;
    currency: string;
};


export const handler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    const paymentPayload = parseInput(event.body || '{}') as CreatePaymentPayload;

    const payment: Payment = { ...paymentPayload, id: generateUniqueUUID() }

    await createPayment(payment);
    return buildResponse(201, { paymentId: payment.id });
};
