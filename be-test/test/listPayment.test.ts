import * as payments from '../src/lib/payments';
import { randomUUID } from 'crypto';
import { handler } from '../src/listPayments';
import { APIGatewayProxyEvent } from 'aws-lambda';

describe('When the user requests the records for a specific payment', () => {

    it('it should return all payments if no query parameters', async () => {
        const mockPayments = [{
            id: randomUUID(),
            currency: 'AUD',
            amount: 2000,
        }];
        const listPaymentsMock = jest.spyOn(payments, 'listPayments').mockResolvedValueOnce(mockPayments);

        const result = await handler({} as unknown as APIGatewayProxyEvent);

        expect(result.statusCode).toBe(200);
        expect(JSON.parse(result.body)).toEqual({ data: mockPayments });

        expect(listPaymentsMock).toHaveBeenCalledWith();
    });

    it('it should return payments by currency if query parameters has currency param', async () => {
        const mockPayments = [{
            id: randomUUID(),
            currency: 'SGD',
            amount: 2000,
        }];
        const listPaymentsMock = jest.spyOn(payments, 'listPaymentsByCurrency').mockResolvedValueOnce(mockPayments);

        const result = await handler({
            queryStringParameters: {
                currency: 'SGD',
            },
        } as unknown as APIGatewayProxyEvent);

        expect(result.statusCode).toBe(200);
        expect(JSON.parse(result.body)).toEqual({ data: mockPayments });

        expect(listPaymentsMock).toHaveBeenCalledWith('SGD');
    });

    it('should throw error when got error from DB', async () => {
        jest.spyOn(payments, 'listPaymentsByCurrency').mockImplementationOnce(() => {
            throw new Error('DB mock error');
        });

        await expect(
            handler({
                queryStringParameters: {
                    currency: 'SGD',
                },
            } as unknown as APIGatewayProxyEvent)).rejects.toThrow('DB mock error');
    })

});

afterEach(() => {
    jest.resetAllMocks();
});
