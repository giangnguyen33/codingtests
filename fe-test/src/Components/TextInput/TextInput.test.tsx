import { fireEvent, render,screen } from "@testing-library/react"
import TextInput from "./TextInput"
import userEvent from "@testing-library/user-event"

describe('TextInput', () => { 
    it('should render correctly',async ()=>{
        render(<TextInput id='amount' label="Amount" value={10} readonly={true}/>)
        expect(screen.getByTestId('text-input-amount')).toBeDefined()
        expect(screen.findByText('Amount')).toBeDefined()
        const inputNode = screen.getByLabelText('Amount')
        expect(inputNode).toHaveAttribute('type', 'number')
        expect(inputNode).toHaveAttribute('value', '10')
        expect(inputNode).toHaveAttribute('readonly','')
    })

    it('should call onChange when user input value',async ()=>{
        const mockOnChange = vi.fn()
        render(<TextInput id='amount' label="Amount" value={10} onChange={mockOnChange}/>)

        const inputNode = screen.getByLabelText('Amount')
        fireEvent.change(inputNode, {target: {value: '1000'}})
        expect(mockOnChange).toBeCalledWith('1000')
    })
    it('should not call onChange when readonly',async ()=>{
        const mockOnChange = vi.fn()
        render(<TextInput id='amount' label="Amount" value={10} onChange={mockOnChange} readonly/>)

        const inputNode = screen.getByLabelText('Amount')
        fireEvent.change(inputNode, {target: {value: '1000'}})
        expect(mockOnChange).not.toBeCalled()
    })
 })