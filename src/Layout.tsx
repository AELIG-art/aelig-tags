import React from "react";
import NavBar from "./components/NavBar";
import { Outlet } from "react-router-dom";
import { Container } from "react-bootstrap";

const Layout = () => {
    return <div>
        <NavBar />
        <Container className="mt-3">
            <Outlet/>
        </Container>
    </div>
}

export default Layout;
