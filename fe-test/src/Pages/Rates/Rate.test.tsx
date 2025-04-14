import { fireEvent, render , screen} from "@testing-library/react"
import Rates from "./Rates"

describe('Rates page test', ()=>{
    
    it('should render correctly', ()=>{
        render(<Rates></Rates>)
        expect(screen.getByText("Currency Conversion")).toBeDefined();
        const fromDropdown = screen.getByTestId("dropdown-fromCurrency");
        expect(fromDropdown).toBeDefined();
        const toDropdown =  screen.getByTestId("dropdown-toCurrency");
        expect(toDropdown).toBeDefined();
        const amountInput =  screen.getByTestId("text-input-amount");
        expect(amountInput).toBeDefined();
        const convertAmount =  screen.getByTestId("text-input-convertAmount");
        expect(convertAmount).toBeDefined();
        const convertAmountWithMarkup =  screen.getByTestId("text-input-convertAmountWithMarkup");
        expect(convertAmount).toBeDefined();
    })

    it('should display convert amount correctly', ()=>{
        render(<Rates></Rates>)
        const inputAmoun = screen.getByLabelText('Amount')
        fireEvent.change(inputAmoun, {target: {value: '1000'}})
        const convertAmount = screen.getByLabelText('Convert amount without markup')
        expect(convertAmount).toHaveAttribute('value', '745.6')
        const convertAmountWithMarkup = screen.getByLabelText('Convert amount with markup')
        expect(convertAmountWithMarkup).toHaveAttribute('value', '741.8720000000001')
    })

})