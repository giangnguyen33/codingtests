import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import { buildResponse } from './lib/apigateway';
import { listPayments, listPaymentsByCurrency } from './lib/payments';

export const handler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    const currencyParam = event?.queryStringParameters?.currency

    try {
        const payments = currencyParam ? await listPaymentsByCurrency(currencyParam) : await listPayments();
        return buildResponse(200, { data: payments });
    } catch (error) {
        console.error(`error when list payments with parameter ${currencyParam}`, error)
        throw error;
    }
};
