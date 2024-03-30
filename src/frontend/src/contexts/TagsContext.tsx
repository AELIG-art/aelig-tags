import React, { useContext, useEffect, useState } from "react";
import { createContext, ReactNode } from "react";
import { TagExpanded } from "../utils/types";
import { expandTag } from "../utils/datastore";
import { useAddress } from "@thirdweb-dev/react";
import {backend} from "../declarations/backend";

const Context = createContext({} as TagsContextInterface);

export const TagsContext = (props: {
    children: ReactNode;
}) => {
    const [tags, setTags] = useState([] as TagExpanded[]);
    const [sub, setSub] = useState("");
    const address = useAddress();
    const {children} = props;

    const getTagsExpanded = async (address: string) => {
        const tagsRes = await backend.get_tags_owned_by(address);
        const tags: TagExpanded[] = [];

        for (const tag of tagsRes) {
            if (tag.is_certificate) {
                const tagExpanded = await expandTag(tag);
                tags.push(tagExpanded);
            }
        }

        return tags;
    }

    useEffect(() => {
        if (address) {
            getTagsExpanded(address).then((tags) => {
                setTags(tags);
            });
        }
    }, [address, sub]);

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
