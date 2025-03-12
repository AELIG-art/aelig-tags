import {
  NFTDetails,
  NFTMetadata,
  Tag,
} from '../declarations/backend/backend.did';

export interface TagExpanded extends Tag {
  metadata?: NFTMetadata;
  nftDetails?: NFTDetails;
  registered?: boolean;
}

export type SupportedChain = 'eth' | 'polygon' | 'base' | 'abstract';
