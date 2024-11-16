import {NFTMetadata, Tag} from "../declarations/backend/backend.did";

export interface TagExpanded extends Tag {
    metadata?: NFTMetadata,
    registered?: boolean
}

export type SupportedChain = 'eth' | 'polygon';