import React, {createContext, ReactNode, useContext, useEffect, useState} from "react";
import {AuthClient} from "@dfinity/auth-client";

const Context = createContext({} as AuthClientContextInterface);

export const AuthClientContext = (props: {
    children: ReactNode;
}) => {
    const { children } = props;
    const [
        authClient,
        setAuthClient
    ] = useState<undefined|AuthClient>(undefined);

    useEffect(() => {
        AuthClient.create().then((client) => {
            setAuthClient(client);
        });
    }, [setAuthClient]);

    const context = {
        authClient,
    };

    return (
        <Context.Provider value={context}>
            {children}
        </Context.Provider>
    );

};

export interface AuthClientContextInterface {
    authClient: undefined|AuthClient
}

export function useAuthClient() {
    return useContext(Context);
}