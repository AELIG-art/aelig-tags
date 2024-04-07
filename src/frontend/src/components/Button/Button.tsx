import React, {ReactNode} from "react";
import { Button as BsButton } from "react-bootstrap";
import "./styles.Button.css";

const Button = (props: {
    children: ReactNode,
    onClick?: () => void,
    size?: "lg"|"sm",
    variant?: "primary"|"secondary"|"success"|"warning"|"danger"|"info"|"light"|"dark"|"link"
}) => {
    const {
        children,
        onClick,
        size,
        variant
    } = props;

    return <BsButton onClick={onClick} className="button" size={size} variant={variant}>
        {children}
    </BsButton>
}

export default Button;