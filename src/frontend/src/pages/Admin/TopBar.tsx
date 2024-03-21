import React from "react";
import { Button } from "react-bootstrap";
import {useAuthClient} from "../../contexts/AuthClientContext";
import {INTERNET_IDENTITY_SESSION_EXPIRATION} from "../../utils/constants";

const TopBar = (props: {
    isLogged:boolean
    isAdmin: boolean
    openModal: () => void
    principal?: string
}) => {
    const { isLogged, isAdmin, openModal, principal } = props;
    const { authClient } = useAuthClient();

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
                    onClick={() => authClient?.logout()}
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
                onClick={() => {
                    authClient?.login({
                        maxTimeToLive: BigInt(INTERNET_IDENTITY_SESSION_EXPIRATION)
                    }).then();
                }}
            >
                Connect to internet identity
            </Button>
        </div>
    }
}

export default TopBar;
