import { TextField, TextFieldVariants, Typography } from "@mui/material";
import { red } from "@mui/material/colors";
import ErrorMessage from "./ErrorMessage";

interface Props {
    id: string,
    label: string,
    variant?: TextFieldVariants,
    errorMessage?: JSX.Element | String | null
    [key: string]: any
}

export default function CustomInput (props: Props) {
    const { id, label, variant, errorMessage, ...rest } = props;

    return (
        <>
            <TextField 
                {...rest}
                id={props.id}
                label={props.label}
                variant={props.variant || "outlined"}
            />

            <ErrorMessage>
                {props.errorMessage || null}
            </ErrorMessage>
        </>
    )
}