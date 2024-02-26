import React from "react";
import { Button, Container, Navbar as RBNavbar } from "react-bootstrap";
import { ConnectWallet, useAddress } from "@thirdweb-dev/react";
import { operatorAddress } from "../utils/constants";
import { useNavigate } from "react-router-dom";

const Navbar = () => {
    const address = useAddress();
    const navigate = useNavigate();

    return (
        <RBNavbar className="bg-body-tertiary">
            <Container>
                <RBNavbar.Brand href="/">AELIG | tags</RBNavbar.Brand>
                <RBNavbar.Toggle />
                <RBNavbar.Collapse className="justify-content-end">
                    {
                        address === operatorAddress ? <Button
                            className="me-3"
                            onClick={() => navigate("/newTag")}
                        >
                            New
                        </Button> : null
                    }
                    <ConnectWallet
                        modalSize="compact"
                        theme="light"
                        auth={{loginOptional: false}}
                    />
                </RBNavbar.Collapse>
            </Container>
        </RBNavbar>
    );
}

export default Navbar;
