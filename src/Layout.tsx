import React from "react";
import NavBar from "./components/NavBar";
import { Outlet } from "react-router-dom";
import { Container } from "react-bootstrap";
import { TagsContext } from "./contexts/TagsContext";

const Layout = () => {
    return <div>
        <NavBar />
        <Container className="mt-3">
            <TagsContext>
                <Outlet/>
            </TagsContext>
        </Container>
    </div>
}

export default Layout;
