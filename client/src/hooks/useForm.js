import { useRef, useState } from "react"

function useForm() {
    const inputs = useRef({});
    const [inputsValues, setInputsValues] = useState({});

    const addInput = (name, type='text', initial='') => {
        if (name in inputs.current) {
            let input = inputs.current[name];
            return {
                type: input.type,
                onChange: input.onChange
            };
        }

        if (type === 'file') {
            initial = null;
        }
        const onChange = (event) => {
            let value;
            if (type === 'file') {
                value = event.target.files[0];
            } else {
                value = event.target.value;
            }
            setInputsValues((state) => {
                return {
                    ...state,
                    [name]: value || initial
                }
            })
        }
        setInputsValues((state) => {
            return {
                ...state,
                [name]: initial
            }
        });
        inputs.current = {
            [name]: {
                type: type,
                onChange: onChange
            },
            ...inputs.current
        };
        return { type: type, onChange: onChange }
    }

    return [inputsValues, addInput]
}

export default useForm;