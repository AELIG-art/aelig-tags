import React from "react";
import {useAuthClient} from "../../contexts/AuthClientContext";
import {INTERNET_IDENTITY_SESSION_EXPIRATION, INTERNET_IDENTITY_URL} from "../../utils/constants";
import Button from "../../components/Button/Button";

const TopBar = (props: {
    isLogged:boolean
    principal?: string
}) => {
    const { isLogged, principal } = props;
    const { authClient } = useAuthClient();

    return <div>
        <h1 className="mt-5">Manage tags</h1>
        {
            isLogged ? <div className={"d-flex"}>
                <span className={"mt-3"}><b>Your principal:</b> {principal}</span>
                <div className={"flex-fill"}></div>
                <Button onClick={() => authClient?.logout()}>
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
    </div>;
}

export default TopBar;
