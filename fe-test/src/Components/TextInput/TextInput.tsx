import { useState } from "react";

interface TextInputProps {
    id: string;
    label:string;
    value?: number;
    readonly?: boolean;
    onChange?: (value:string)=> void;
}

const TextInput = ({id, label, value, onChange, readonly}:TextInputProps)=>{

    const handleOnchange = (e)=>{
        if(onChange && !readonly) {
            onChange(e.target.value)  
        }
    }
   
    return <div data-testid = {`text-input-${id}`}>
        <label>{label}</label>
        <input aria-label={label} type='number' value={value} onChange={handleOnchange} readOnly={readonly}></input>
    </div>

}

 export default TextInput;

