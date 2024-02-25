import React from "react";
import { Container, Navbar as RBNavbar } from "react-bootstrap";
import { ConnectWallet } from "@thirdweb-dev/react";

const Navbar = () => {
    return (
        <RBNavbar className="bg-body-tertiary">
            <Container>
                <RBNavbar.Brand href="#home">AELIG | tags</RBNavbar.Brand>
                <RBNavbar.Toggle />
                <RBNavbar.Collapse className="justify-content-end">
                    <ConnectWallet
                        modalSize="compact"
                        theme="light"
                    />
                </RBNavbar.Collapse>
            </Container>
        </RBNavbar>
    );
}

export default Navbar;
