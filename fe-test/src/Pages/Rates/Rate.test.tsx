import { render , screen} from "@testing-library/react"
import Rates from "./Rates"

describe('Rates page test', ()=>{
    it('should render correctly', ()=>{
        render(<Rates></Rates>)
        //screen.debug()
        expect(screen.getByText("Currency Conversion")).toBeDefined();
        const fromDropdown = screen.getByTestId("fromCurrency");
        expect(fromDropdown).toBeDefined();
        const toDropdown =  screen.getByTestId("toCurrency");
        expect(toDropdown).toBeDefined();
    })

})