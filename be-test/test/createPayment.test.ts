import { APIGatewayProxyEvent } from 'aws-lambda';
import { CreatePaymentPayload, handler } from '../src/createPayment';
import * as payments from '../src/lib/payments';



describe.only('When the user create payment', () => {
    it('should create payment and return unique paymentId', async () => {
        const mockPaymentId: string = 'mock paymentId'
        const createPaymentPayload: CreatePaymentPayload = {
            currency: 'AUD',
            amount: 2000,
        };

        //const mock = jest.spyOn(payments, 'generateUniqueUUID');
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
});

afterEach(() => {
    jest.resetAllMocks();
});
