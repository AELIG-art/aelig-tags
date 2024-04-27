import React, {ReactNode} from "react";
import { Button as BsButton } from "react-bootstrap";
import "./styles.Button.css";

const Button = (props: {
    children: ReactNode,
    onClick?: () => void,
    size?: "lg"|"sm",
    variant?: "primary"|"secondary"|"success"|"warning"|"danger"|"info"|"light"|"dark"|"link"
    disabled?: boolean,
    secondary?: boolean
}) => {
    const {
        children,
        onClick,
        size,
        variant,
        disabled,
        secondary
    } = props;

    return <BsButton
        onClick={onClick}
        className={`button ${secondary ? "secondaryButton" : ""}`}
        size={size}
        variant={variant}
        disabled={disabled}
    >
        {children}
    </BsButton>
}

export default Button;