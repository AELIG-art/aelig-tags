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
        return <div>
            <div className={"d-flex"}>
                {
                    isAdmin ? <Button
                        onClick={openModal}
                    >
                        Register new tag
                    </Button> : null
                }
                <div className={"flex-fill"}/>
                <Button
                    onClick={() => signOut().then()}
                >
                    Disconnect
                </Button>
            </div>
            <p className={"mt-3"}>Your principal: {user.key}</p>
        </div>
    } else {
        return <div className={"d-flex"}>
            <div className={"flex-fill"}/>
            <Button
                onClick={() => signIn().then()}
            >
                Connect to internet identity
            </Button>
        </div>
    }
}

export default TopBar;
