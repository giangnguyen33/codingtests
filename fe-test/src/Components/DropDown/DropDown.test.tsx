import { fireEvent, render, screen } from "@testing-library/react"
import DropDown from "./DropDown"
import userEvent from "@testing-library/user-event"

describe('Dropdown test',()=>{
    it('should render correctly',async ()=>{
        render(<DropDown label='Dropdown Label' ></DropDown>)

        expect(screen.getByText('Dropdown Label')).toBeDefined();

        const button =  await screen.findByRole('button')
         expect(button).toBeDefined();
    })

    it('should show the options when click on dropdown', async ()=>{
        const options = [
            {
                option: "AUD",
                key: 'AU',
            },
            {
                option: "USD",
                key: 'US',
            }
        ]
        render(<DropDown label='Dropdown Label' options={options} ></DropDown>)
        const button =  await screen.findByRole('button')
        fireEvent.click(button)
        
        expect(screen.getByText('AUD', { selector: 'button' })).toBeDefined()
        expect(screen.getByText('USD', { selector: 'button' })).toBeDefined()
    })

    it('should close the dropdown when click outside', async ()=>{
        const options = [
            {
                option: "AUD",
                key: 'AU',
            },
            {
                option: "USD",
                key: 'US',
            }
        ]
     render(
       <div>
            <span>Outside dropdown</span>
            <DropDown label='Dropdown Label' options={options} ></DropDown>   
       </div>)
       
        const button =  await screen.findByRole('button')
        fireEvent.click(button)
        
        expect(screen.getByText('AUD', { selector: 'button' })).toBeDefined()
        expect(screen.getByText('USD', { selector: 'button' })).toBeDefined()

        const labelOutside = screen.getByText('Outside dropdown');
        fireEvent.click(labelOutside)
        expect(screen.queryByText('USD', { selector: 'button' })).toBeNull()
    })

})