import React, { useEffect, useState } from "react";
import TopBar from "./TopBar";
import NewTagModal from "./NewTagModal";
import Certificates from "./Certificates";
import {useAuthClient} from "../../contexts/AuthClientContext";
import {backend} from "../../declarations/backend";
import {SnackbarProvider} from "notistack";

const Admin = () => {
    const [isAdmin, setIsAdmin] = useState(false);
    const [newTagModalOpen, setNewTagModalOpen] = useState(false);
    const [isLogged, setIsLogged] = useState(false);
    const [tagsSub, setTagsSub] = useState("");
    const { authClient } = useAuthClient();
    const principal = authClient?.getIdentity().getPrincipal();


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
            isAdmin={isAdmin}
            openModal={() => setNewTagModalOpen(true)}
            principal={principal?.toString()}
        />
        <Content isAdmin={isAdmin} tagsSub={tagsSub} />
        <NewTagModal
            close={() => {
                setNewTagModalOpen(false);
                setTagsSub(new Date().toString());
            }}
            open={newTagModalOpen}
        />
        <SnackbarProvider />
    </div>;
}

export default Admin;
