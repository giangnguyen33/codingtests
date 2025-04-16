import { APIGatewayProxyEvent } from 'aws-lambda';
import { CreatePaymentPayload, handler } from '../src/createPayment';
import * as payments from '../src/lib/payments';



describe('When the user create payment', () => {
    it('should create payment and return unique paymentId when valid payload', async () => {
        const mockPaymentId: string = 'mock paymentId'
        const createPaymentPayload: CreatePaymentPayload = {
            currency: 'AUD',
            amount: 2000,
        };

        const generateUniqueUUIDMock = jest.spyOn(payments, 'generateUniqueUUID').mockReturnValue(mockPaymentId);
        const createPaymentMock = jest.spyOn(payments, 'createPayment').mockImplementation();

        const result = await handler({
            body: JSON.stringify(createPaymentPayload)
        } as unknown as APIGatewayProxyEvent);

        expect(result.statusCode).toBe(201);
        expect(JSON.parse(result.body)).toEqual({ "paymentId": "mock paymentId" });

        expect(generateUniqueUUIDMock).toHaveBeenCalledTimes(1);
        expect(createPaymentMock).toHaveBeenCalledWith({
            amount: 2000,
            currency: "AUD",
            id: "mock paymentId",
        });

    })

    it('should return bad request 422 when amount and currenty is empty', async () => {
        const mockPaymentId: string = 'mock paymentId'
        const createPaymentPayload = {
            currency: '',
            amount: '',
        };

        const generateUniqueUUIDMock = jest.spyOn(payments, 'generateUniqueUUID').mockReturnValue(mockPaymentId);
        const createPaymentMock = jest.spyOn(payments, 'createPayment').mockImplementation();

        const result = await handler({
            body: JSON.stringify(createPaymentPayload)
        } as unknown as APIGatewayProxyEvent);

        expect(result.statusCode).toBe(422);
        expect(JSON.parse(result.body)).toEqual({ errors: ["amount is required", "currency is required"] });

        expect(generateUniqueUUIDMock).not.toHaveBeenCalled();
        expect(createPaymentMock).not.toHaveBeenCalled();

    })

    it('should return bad request 422 when amount is not number', async () => {
        const mockPaymentId: string = 'mock paymentId'
        const createPaymentPayload = {
            currency: '',
            amount: 'abc',
        };

        const generateUniqueUUIDMock = jest.spyOn(payments, 'generateUniqueUUID').mockReturnValue(mockPaymentId);
        const createPaymentMock = jest.spyOn(payments, 'createPayment').mockImplementation();

        const result = await handler({
            body: JSON.stringify(createPaymentPayload)
        } as unknown as APIGatewayProxyEvent);

        expect(result.statusCode).toBe(422);
        expect(JSON.parse(result.body)).toEqual({ errors: ["currency is required", "amount should be number"] });

        expect(generateUniqueUUIDMock).not.toHaveBeenCalled();
        expect(createPaymentMock).not.toHaveBeenCalled();

    })

    it('should throw error when got error from DB', async () => {
        const createPaymentPayload = {
            currency: 'AUD',
            amount: '1',
        };
        jest.spyOn(payments, 'createPayment').mockImplementationOnce(() => {
            throw new Error('DB mock error');
        });

        await expect(
            handler({
                body: JSON.stringify(createPaymentPayload)
            } as unknown as APIGatewayProxyEvent)).rejects.toThrow('DB mock error');
    })
});

afterEach(() => {
    jest.resetAllMocks();
});
