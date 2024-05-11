import React, { useContext, useEffect, useState } from "react";
import { createContext, ReactNode } from "react";
import { TagExpanded } from "../utils/types";
import { expandTag } from "../utils/datastore";
import {useSiweIdentity} from "ic-use-siwe-identity";
import {GetTagsResult} from "../declarations/backend/backend.did";
import {useBackendActor} from "./BackendActorContext";

const Context = createContext({} as TagsContextInterface);

export const TagsContext = (props: {
    children: ReactNode;
}) => {
    const [tags, setTags] = useState([] as TagExpanded[]);
    const [sub, setSub] = useState("");
    const { identityAddress } = useSiweIdentity();
    const {children} = props;

    const { backendActor } = useBackendActor();

    const getTagsExpanded = async (address: string) => {
        const tags: TagExpanded[] = [];
        if (backendActor) {
            const tagsRes = await backendActor.get_tags_owned_by(address) as GetTagsResult;

            if ("Ok" in tagsRes) {
                for (const tag of tagsRes.Ok) {
                    if (tag.is_certificate) {
                        const tagExpanded = await expandTag(tag);
                        tags.push(tagExpanded);
                    }
                }
            }
        }

        return tags;
    }

    useEffect(() => {
        if (identityAddress) {
            getTagsExpanded(identityAddress).then((tags) => {
                setTags(tags);
            });
        }
    }, [identityAddress, sub, backendActor]);

    const context = {
        tags: tags,
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
    tags: TagExpanded[],
    setSub: (sub: string) => void
}
