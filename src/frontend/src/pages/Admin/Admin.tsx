import React, { useEffect, useState } from "react";
import TopBar from "./TopBar";
import NewTagModal from "./NewTagModal";
import Certificates from "./Certificates";
import {useAuthClient} from "../../contexts/AuthClientContext";
import {backend} from "../../declarations/backend";
import {SnackbarProvider} from "notistack";
import { Nav } from "react-bootstrap";
import {useLocation} from "react-router-dom";
import Frames from "./Frames";

const Admin = () => {
    const [isAdmin, setIsAdmin] = useState(false);
    const [newTagModalOpen, setNewTagModalOpen] = useState(false);
    const [isNewTagCertificate, setIsNewTagCertificate] = useState(true);
    const [isLogged, setIsLogged] = useState(false);
    const [certificatesSub, setCertificatesSub] = useState("");
    const [framesSub, setFramesSub] = useState("");
    const { authClient } = useAuthClient();
    const principal = authClient?.getIdentity().getPrincipal();
    const location = useLocation();
    const hash = location.hash;
    const isCertificatesSection = !hash || hash === '#certificates';


    useEffect(() => {
        authClient?.isAuthenticated().then((isAuthenticated) => {
            if (isAuthenticated) {
                const principal = authClient?.getIdentity().getPrincipal();
                setIsLogged(true);
                backend.is_admin(principal).then(res => {
                    setIsAdmin(res);
                });
            } else {
                setIsLogged(false);
                setIsAdmin(false);
            }
        });
    }, [principal?.toString()]);

    return <div>
        <TopBar
            isLogged={isLogged}
            openModal={() => setNewTagModalOpen(true)}
            principal={principal?.toString()}
        />
        {
            isAdmin ? <div>
                <Nav variant="underline" defaultActiveKey="admin/#certificates" className={"mt-3"}>
                    <Nav.Item>
                        <Nav.Link href="admin/#certificates">Certificates</Nav.Link>
                    </Nav.Item>
                    <Nav.Item>
                        <Nav.Link href="admin/#frames">Frames</Nav.Link>
                    </Nav.Item>
                </Nav>
                {
                    isCertificatesSection ? <Certificates
                        tagsSub={certificatesSub}
                        openModal={() => {
                            setIsNewTagCertificate(true);
                            setNewTagModalOpen(true);
                        }}
                    /> : <Frames
                        tagsSub={framesSub}
                        openModal={() => {
                            setIsNewTagCertificate(true);
                            setNewTagModalOpen(true);
                        }}
                    />
                }
            </div> :
            <div className={"mt-5 text-center"}>
                <p>You are not an admin. Please, login with another account.</p>
            </div>
        }
        <NewTagModal
            close={() => {
                setNewTagModalOpen(false);
                if (isCertificatesSection) {
                    setCertificatesSub(new Date().toString());
                } else {
                    setFramesSub(new Date().toString());
                }
            }}
            open={newTagModalOpen}
            isNewTagCertificate={isNewTagCertificate}
        />
        <SnackbarProvider />
    </div>;
}

export default Admin;
