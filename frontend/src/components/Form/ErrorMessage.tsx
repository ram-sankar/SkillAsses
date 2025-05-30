import { Typography } from "@mui/material";
import { red } from "@mui/material/colors";

interface Props {
    children: JSX.Element | String | null
}

export default function ErrorMessage (props: Props) {

    return (
        <Typography sx={{ color: red[500] }}>
            {props.children}
        </Typography>
    )
}