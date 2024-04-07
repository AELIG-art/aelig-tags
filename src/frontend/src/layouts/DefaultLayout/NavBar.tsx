import React from "react";
import { Container, Navbar as RBNavbar } from "react-bootstrap";
import { ConnectWallet } from "@thirdweb-dev/react";
import "./styles.NavBar.css";

const Navbar = () => {

    return (
        <RBNavbar className="styled-navbar">
            <Container>
                <RBNavbar.Brand href="/" className="brand">AELIG | tags</RBNavbar.Brand>
                <RBNavbar.Toggle />
                <RBNavbar.Collapse className="justify-content-end">
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
