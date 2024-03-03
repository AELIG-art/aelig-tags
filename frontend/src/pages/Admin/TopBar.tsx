import React from "react";
import { signIn, signOut, User } from "@junobuild/core";
import { Button } from "react-bootstrap";

const TopBar = (props: {
    user: null|User
    isAdmin: boolean
    openModal: () => void
}) => {
    const { user, isAdmin, openModal } = props;

    if (user !== null) {
        return <div className={"d-flex"}>
            <Button
                onClick={() => signOut().then()}
            >
                Disconnect
            </Button>
            <div className={"flex-fill"} />
            {
                isAdmin ? <Button
                    onClick={openModal}
                >
                    Register new tag
                </Button> : null
            }
        </div>
    } else {
        return <Button
            onClick={() => signIn().then()}
        >
            Connect to internet identity
        </Button>
    }
}

export default TopBar;
