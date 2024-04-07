import React from "react";
import { Container, Navbar as RBNavbar } from "react-bootstrap";
import { ConnectWallet } from "@thirdweb-dev/react";
import "./styles.NavBar.css";

const Navbar = () => {

    return (
        <div className="navbar-background">
            <RBNavbar className="styled-navbar">
                <Container>
                    <RBNavbar.Brand href="/" className="brand">AELIG | tags</RBNavbar.Brand>
                    <RBNavbar.Toggle />
                    <RBNavbar.Collapse className="justify-content-end">
                        <ConnectWallet
                            theme="light"
                            auth={{loginOptional: false}}
                            welcomeScreen={{
                                title: "AELIG | Tags",
                                subtitle: "Connect your wallet to list and manage your certificates.",
                                img: {
                                    src: "logo-full.png",
                                    width: 300,
                                    height: 226,
                                },
                            }}
                            btnTitle="Connect"
                            className="connectButton"
                        />
                    </RBNavbar.Collapse>
                </Container>
            </RBNavbar>
        </div>

    );
}

export default Navbar;
