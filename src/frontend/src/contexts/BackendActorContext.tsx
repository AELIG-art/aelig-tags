import React, {createContext, ReactNode, useContext, useEffect, useState} from "react";
import {useSiweIdentity} from "ic-use-siwe-identity";
import {Actor, ActorMethod, ActorSubclass, HttpAgent} from "@dfinity/agent";
import {canisterId, idlFactory} from "../declarations/backend";

const Context = createContext({} as BackendActorContextInterface);

const BackendActorContext = (props: {
    children: ReactNode
}) => {
    const {children} = props;
    const { identity } = useSiweIdentity();
    const [backendActor, setBackendActor] = useState<
        undefined|
        ActorSubclass<Record<string, ActorMethod>>
    >();

    useEffect(() => {
        if (identity) {
            const agent = new HttpAgent({ identity });
            agent.fetchRootKey().then(() => {
                const backendActor = Actor.createActor(
                    idlFactory,
                    {
                        agent,
                        canisterId
                    }
                );
                setBackendActor(backendActor);
            });
        }
    }, [identity]);

    const context = {
        backendActor: backendActor,
    }

    return <Context.Provider value={context}>
        {children}
    </Context.Provider>;
};

export interface BackendActorContextInterface {
    backendActor: undefined|ActorSubclass<Record<string, ActorMethod>>
}

export const useBackendActor = () => {
    return useContext(Context);
}

export default BackendActorContext;