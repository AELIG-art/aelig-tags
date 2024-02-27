import React, { useContext, useEffect, useState } from "react";
import { createContext, ReactNode } from "react";
import { Tag, TagExpanded } from "../utils/types";
import { getDoc } from "@junobuild/core";
import { expandTag } from "../utils/datastore";
import { useAddress } from "@thirdweb-dev/react";

const Context = createContext({} as TagsContextInterface);

export const StackedAmountContext = (props: {
    children: ReactNode;
}) => {
    const [tags, setTags] = useState([] as TagExpanded[]);
    const address = useAddress();
    const {children} = props;

    const getTagsExpanded = async (address: string) => {
        const tagsRes = await getDoc({
            collection: 'tags',
            key: address
        });
        if (tagsRes === undefined) {
            return [];
        } else {
            const tags: TagExpanded[] = [];

            for (const tag of (tagsRes.data as Tag[])) {
                const tagExpanded = await expandTag(tag);
                tags.push(tagExpanded);
            }

            return tags;
        }
    }

    useEffect(() => {
        if (address) {
            getTagsExpanded(address).then((tags) => {
                setTags(tags);
            });
        }
    }, [address]);

    const context = {
        tags: tags,
    }


    return (
        <Context.Provider value={context}>
            {children}
        </Context.Provider>
    );

}

export function useTags() {
    return useContext(Context);
}

export interface TagsContextInterface {
    tags: TagExpanded[]
}
