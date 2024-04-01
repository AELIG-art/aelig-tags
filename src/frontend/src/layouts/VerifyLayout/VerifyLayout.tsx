import React, {useEffect} from "react";
import { Outlet } from "react-router-dom";
import { Container } from "react-bootstrap";
import NavBar from "./NavBar";
import Footer from "./Footer";
import "./styles.VerifyLayout.css";

const DefaultLayout = () => {

    useEffect(() => {
        document.getElementsByTagName("html")[0].style.backgroundColor = '#eae3d2';
    }, []);

    return <div className="content">
        <NavBar />
        <Container className="mt-3">
            <Outlet/>
        </Container>
        <Footer />
    </div>
}

export default DefaultLayout;
