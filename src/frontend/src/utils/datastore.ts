import { getDoc } from "@junobuild/core";
import { Metadata, Tag, TagExpanded } from "./types";

export const expandTag = async (tag: Tag) => {
    const metadataRes = await getDoc({
        collection: 'metadata',
        key: tag.id.toString()
    });
    if (metadataRes) {
        return {
            ...tag,
            metadata: metadataRes.data as Metadata
        };
    } else {
        return tag as TagExpanded;
    }
}
