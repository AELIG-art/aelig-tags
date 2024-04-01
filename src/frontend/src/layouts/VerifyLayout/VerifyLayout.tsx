import React from "react";
import { Outlet } from "react-router-dom";
import { Container } from "react-bootstrap";
import { TagsContext } from "../../contexts/TagsContext";
import NavBar from "./NavBar";
import Footer from "./Footer";

const DefaultLayout = () => {
    return <div>
        <NavBar />
        <Container className="mt-3">
            <TagsContext>
                <Outlet/>
            </TagsContext>
        </Container>
        <Footer />
    </div>
}

export default DefaultLayout;
