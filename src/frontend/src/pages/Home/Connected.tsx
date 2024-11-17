import {useLocation, useNavigate} from "react-router-dom";
import React, {useEffect} from "react";
import {Nav} from "react-bootstrap";
import CertificatesList from "./CertificatesList";
import FramesList from "./FramesList";

const Connected = () => {
    const location = useLocation();
    const hash = location.hash;
    const isCertificatesSection = !hash || hash === '#certificates';
    const navigate = useNavigate();

    useEffect(() => {
        if (!hash) {
            navigate("#certificates");
        }
    }, [hash, navigate]);

    return <div>
        <Nav variant="underline" defaultActiveKey="#certificates" className={"mt-3"}>
            <Nav.Item>
                <Nav.Link
                    href="#certificates"
                    className={isCertificatesSection ? "navActive" : "nav"}
                >
                    Certificates
                </Nav.Link>
            </Nav.Item>
            <Nav.Item>
                <Nav.Link
                    href="#frames"
                    className={!isCertificatesSection ? "navActive" : "nav"}
                >
                    Frames
                </Nav.Link>
            </Nav.Item>
        </Nav>
        {
            isCertificatesSection ? <CertificatesList /> : <FramesList />
        }
    </div>
};

export default Connected;