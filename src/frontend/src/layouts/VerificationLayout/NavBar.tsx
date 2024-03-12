import React from "react";
import './styles.Navbar.css';
import { Container, Navbar as RBNavbar } from "react-bootstrap";

const Navbar = () => {

    return (
        <RBNavbar className="navbar">
            <Container className="container d-flex justify-content-center">
                <img
                    src="/logo.png"
                    className="d-inline-block align-top"
                    alt="React Bootstrap logo"
                />
            </Container>
        </RBNavbar>
    );
}

export default Navbar;
