import React from "react";
import { Button } from "react-bootstrap";
import {useAuthClient} from "../../contexts/AuthClientContext";
import {INTERNET_IDENTITY_SESSION_EXPIRATION, INTERNET_IDENTITY_URL} from "../../utils/constants";

const TopBar = (props: {
    isLogged:boolean
    isAdmin: boolean
    openModal: () => void
    principal?: string
}) => {
    const { isLogged, isAdmin, openModal, principal } = props;
    const { authClient } = useAuthClient();

    return <div>
        {
            isLogged ? <div className={"d-flex"}>
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
            </div> : <div className={"d-flex"}>
                <div className={"flex-fill"}/>
                <Button
                    onClick={() => {
                        authClient?.login({
                            maxTimeToLive: BigInt(INTERNET_IDENTITY_SESSION_EXPIRATION),
                            identityProvider: INTERNET_IDENTITY_URL
                        }).then();
                    }}
                >
                    Connect to internet identity
                </Button>
            </div>
        }
        <p className={"mt-3"}>Your principal: {principal}</p>
    </div>;
}

export default TopBar;
