import React, { useEffect, useState } from "react";
import TopBar from "./TopBar";
import {ADMIN_PRINCIPAL, ANONYMOUS_PRINCIPAL_LENGTH} from "../../utils/constants";
import NewTagModal from "./NewTagModal";
import Content from "./Content";
import {useAuthClient} from "../../contexts/AuthClientContext";

const Admin = () => {
    const [isAdmin, setIsAdmin] = useState(false);
    const [newTagModalOpen, setNewTagModalOpen] = useState(false);
    const [isLogged, setIsLogged] = useState(false);

    const { authClient } = useAuthClient();
    const principal = authClient?.getIdentity().getPrincipal();

    useEffect(() => {
        if (principal && principal.toString().length > ANONYMOUS_PRINCIPAL_LENGTH) {
            setIsLogged(true);
            setIsAdmin(principal.toString() === ADMIN_PRINCIPAL);
        }
    }, [principal?.toString()]);

    return <div>
        <TopBar
            isLogged={isLogged}
            isAdmin={isAdmin}
            openModal={() => setNewTagModalOpen(true)}
        />
        <Content isAdmin={isAdmin} />
        <NewTagModal
            close={() => setNewTagModalOpen(false)}
            open={newTagModalOpen}
        />
    </div>;
}

export default Admin;
