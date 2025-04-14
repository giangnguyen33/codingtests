import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import { buildResponse, parseInput } from './lib/apigateway';
import { createPayment, Payment, generateUniqueUUID } from './lib/payments';

export type CreatePaymentPayload = {
    amount: number;
    currency: string;
};


const validatePayload = (paymentPayload: CreatePaymentPayload) => {
    let errors = [];
    if (!paymentPayload.amount) {
        errors.push("amount is required")
    }
    if (!paymentPayload.currency) {
        errors.push("currency is required")
    }
    if (paymentPayload.amount && isNaN(paymentPayload.amount)) {
        errors.push("amount should be number")
    }
    return errors
}
export const handler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    const paymentPayload = parseInput(event.body || '{}') as CreatePaymentPayload;

    const errors = validatePayload(paymentPayload)

    if (errors.length > 0) {
        return buildResponse(422, { errors });
    }

    const payment: Payment = { ...paymentPayload, id: generateUniqueUUID() }

    await createPayment(payment);
    return buildResponse(201, { paymentId: payment.id });
};
