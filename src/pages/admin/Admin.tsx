import React, { useEffect, useState } from "react";
import { authSubscribe, User } from "@junobuild/core";
import TopBar from "./TopBar";
import { admin } from "../../utils/constants";
import NewTagModal from "./NewTagModal";

const Admin = () => {
    const [user, setUser] = useState(null as null|User);
    const [isAdmin, setIsAdmin] = useState(false);
    const [newTagModalOpen, setNewTagModalOpen] = useState(false);

    useEffect(() => {
        authSubscribe((user: User | null) => {
            setUser(user);
            setIsAdmin(user?.owner === admin);
        });
    }, []);

    return <div>
        <TopBar
            user={user}
            isAdmin={isAdmin}
            openModal={() => setNewTagModalOpen(true)}
        />
        <NewTagModal
            close={() => setNewTagModalOpen(false)}
            open={newTagModalOpen}
        />
    </div>;
}

export default Admin;
