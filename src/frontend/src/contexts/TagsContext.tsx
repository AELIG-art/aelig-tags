import React, { useContext, useEffect, useState } from "react";
import { createContext, ReactNode } from "react";
import {useSiweIdentity} from "ic-use-siwe-identity";
import {Certificate, Frame, GetCertificatesResult, GetFramesResult} from "../declarations/backend/backend.did";
import {useBackendActor} from "./BackendActorContext";

const Context = createContext({} as TagsContextInterface);

export const TagsContext = (props: {
    children: ReactNode;
}) => {
    const [certificates, setCertificates] = useState([] as Certificate[]);
    const [frames, setFrames] = useState([] as Frame[]);
    const [sub, setSub] = useState("");
    const { identityAddress } = useSiweIdentity();
    const {children} = props;

    const { backendActor } = useBackendActor();

    useEffect(() => {
        if (backendActor) {
            backendActor.get_certificates().then((res) => {
               const resTyped = res as GetCertificatesResult;
               if ("Ok" in resTyped) {
                   setCertificates(resTyped.Ok);
               } else {
                   // todo: show error
               }
            });
            backendActor.get_frames().then((res) => {
                const resTyped = res as GetFramesResult;
                if ("Ok" in resTyped) {
                    setFrames(resTyped.Ok);
                } else {
                    // todo: show error
                }
            });
        }
    }, [identityAddress, sub, backendActor]);

    const context = {
        certificates: certificates,
        frames: frames,
        setSub: setSub
    }


    return (
        <Context.Provider value={context}>
            {children}
        </Context.Provider>
    );

}

export const useTags = () => {
    return useContext(Context);
}

export interface TagsContextInterface {
    certificates: Certificate[],
    frames: Frame[],
    setSub: (sub: string) => void
}
