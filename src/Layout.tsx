import React from "react";
import NavBar from "./components/NavBar";
import { Outlet } from "react-router-dom";
import { Container } from "react-bootstrap";
import { StackedAmountContext } from "./contexts/TagsContext";

const Layout = () => {
    return <div>
        <NavBar />
        <Container className="mt-3">
            <StackedAmountContext>
                <Outlet/>
            </StackedAmountContext>
        </Container>
    </div>
}

export default Layout;
