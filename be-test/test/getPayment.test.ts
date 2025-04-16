import * as payments from '../src/lib/payments';
import { randomUUID } from 'crypto';
import { handler } from '../src/getPayment';
import { APIGatewayProxyEvent } from 'aws-lambda';

describe('When the user requests the records for a specific payment', () => {
    it('Returns the payment matching their input parameter.', async () => {
        const paymentId = randomUUID();
        const mockPayment = {
            paymentId: paymentId,
            currency: 'AUD',
            amount: 2000,
        };
        const getPaymentMock = jest.spyOn(payments, 'getPayment').mockResolvedValueOnce(mockPayment);

        const result = await handler({
            pathParameters: {
                id: paymentId,
            },
        } as unknown as APIGatewayProxyEvent);

        expect(result.statusCode).toBe(200);
        expect(JSON.parse(result.body)).toEqual(mockPayment);

        expect(getPaymentMock).toHaveBeenCalledWith(paymentId);
    });

    it('Returns 404 when no payment matching their input parameter.', async () => {
        const paymentId = randomUUID();
        const getPaymentMock = jest.spyOn(payments, 'getPayment').mockResolvedValueOnce(null);

        const result = await handler({
            pathParameters: {
                id: paymentId,
            },
        } as unknown as APIGatewayProxyEvent);

        expect(result.statusCode).toBe(404);
        expect(JSON.parse(result.body)).toEqual({ "message": "Not found matching payment" });

        expect(getPaymentMock).toHaveBeenCalledWith(paymentId);
    });

    it('Returns 400 bad request and not call getPayment when paymentId is null', async () => {
        const getPaymentMock = jest.spyOn(payments, 'getPayment').mockResolvedValueOnce(null);

        const result = await handler({
            pathParameters: {
                id: null,
            },
        } as unknown as APIGatewayProxyEvent);

        expect(result.statusCode).toBe(400);
        expect(JSON.parse(result.body)).toEqual({ "message": "paymentId is required" });

        expect(getPaymentMock).not.toHaveBeenCalled();
    });

    it('Returns 400 bad request and not call getPayment when paymentId is undefined', async () => {
        const getPaymentMock = jest.spyOn(payments, 'getPayment').mockResolvedValueOnce(null);

        const result = await handler({
            pathParameters: {
                id: undefined,
            },
        } as unknown as APIGatewayProxyEvent);

        expect(result.statusCode).toBe(400);
        expect(JSON.parse(result.body)).toEqual({ "message": "paymentId is required" });

        expect(getPaymentMock).not.toHaveBeenCalled();
    });

    it('Returns 400 bad request and not call getPayment when paymentId is empty', async () => {
        const getPaymentMock = jest.spyOn(payments, 'getPayment').mockResolvedValueOnce(null);

        const result = await handler({
            pathParameters: {
                id: '',
            },
        } as unknown as APIGatewayProxyEvent);

        expect(result.statusCode).toBe(400);
        expect(JSON.parse(result.body)).toEqual({ "message": "paymentId is required" });

        expect(getPaymentMock).not.toHaveBeenCalled();
    });

    it('should throw error when got error from DB', async () => {
        jest.spyOn(payments, 'getPayment').mockImplementationOnce(() => {
            throw new Error('DB mock error');
        });
        jest.spyOn(console, 'error').mockImplementation(() => { });
        await expect(
            handler({
                pathParameters: {
                    id: 1,
                },
            } as unknown as APIGatewayProxyEvent)).rejects.toThrow('DB mock error');
    })
});

afterEach(() => {
    jest.resetAllMocks();
});
