import React, { useEffect, useState } from "react";
import TopBar from "./TopBar";
import NewTagModal from "./NewTagModal";
import Content from "./Content";
import {useAuthClient} from "../../contexts/AuthClientContext";
import {backend} from "../../declarations/backend";

const Admin = () => {
    const [isAdmin, setIsAdmin] = useState(false);
    const [newTagModalOpen, setNewTagModalOpen] = useState(false);
    const [isLogged, setIsLogged] = useState(false);

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
        <Content isAdmin={isAdmin} />
        <NewTagModal
            close={() => setNewTagModalOpen(false)}
            open={newTagModalOpen}
        />
    </div>;
}

export default Admin;
