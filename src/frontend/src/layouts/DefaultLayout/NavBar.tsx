import React from "react";
import {Container, Navbar as RBNavbar} from "react-bootstrap";
import {ConnectWallet, useAddress, useENS} from "@thirdweb-dev/react";
import "./styles.NavBar.css";
import {reduceWalletAddress} from "../../utils/transformations";

const Navbar = () => {
    const address = useAddress();
    const ens = useENS();

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
                            detailsBtn={() => {
                                return <div>
                                    <span className="me-3">{ens.data?.ens || reduceWalletAddress(address!)}</span>
                                    {ens.data?.avatarUrl ? <img src={ens.data?.avatarUrl} /> : null}
                                </div>;
                            }}
                        />
                    </RBNavbar.Collapse>
                </Container>
            </RBNavbar>
        </div>

    );
}

export default Navbar;
