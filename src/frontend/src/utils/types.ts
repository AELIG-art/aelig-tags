import {NFTMetadata, Tag} from "../declarations/backend/backend.did";

export interface TagExpanded extends Tag {
    metadata?: NFTMetadata,
    registered?: boolean
}
