import React from 'react';
import { Container, Navbar as RBNavbar } from 'react-bootstrap';
import './styles.NavBar.css';
import { ConnectButton } from '@rainbow-me/rainbowkit';

const Navbar = () => {
  return (
    <div className="navbar-background">
      <RBNavbar className="styled-navbar">
        <Container>
          <RBNavbar.Brand href="/" className="brand">
            AELIG | tags
          </RBNavbar.Brand>
          <RBNavbar.Toggle />
          <RBNavbar.Collapse className="justify-content-end">
            <ConnectButton showBalance={false} />
          </RBNavbar.Collapse>
        </Container>
      </RBNavbar>
    </div>
  );
};

export default Navbar;
