import React from "react";
import { signIn, signOut } from "@junobuild/core";
import { Button } from "react-bootstrap";

const TopBar = (props: {
    isLogged:boolean
    isAdmin: boolean
    openModal: () => void
    principal?: string
}) => {
    const { isLogged, isAdmin, openModal, principal } = props;

    if (isLogged) {
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
            <p className={"mt-3"}>Your principal: {principal}</p>
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
