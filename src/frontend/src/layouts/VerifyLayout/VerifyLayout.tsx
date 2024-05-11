import React from "react";
import { Outlet } from "react-router-dom";
import { Container } from "react-bootstrap";
import NavBar from "./NavBar";
import Footer from "./Footer";
import "./styles.VerifyLayout.css";

const DefaultLayout = () => {

    return <div className="content">
        <NavBar />
        <Container className="mt-3">
            <Outlet/>
        </Container>
        <Footer />
    </div>
}

export default DefaultLayout;
