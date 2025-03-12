import { MARKETPLACE_CHAIN_MAPPING, ID_LENGTH } from './constants';
import { NFT } from '../declarations/backend/backend.did';
import { SupportedChain } from './types';

export const intToHexId = (id: number) => {
  const hex = id.toString(16);
  return `${'0'.repeat(ID_LENGTH - hex.length)}${hex}`;
};

export const transformUrl = (oldUrl: string) => {
  if (oldUrl?.slice(0, 4) === 'ipfs') {
    const slices = oldUrl.split('/');
    const ipfsHash = slices.slice(2, slices.length).join('/');
    return `https://w3s.link/ipfs/${ipfsHash}`.replace('/ipfs/ipfs', '/ipfs');
  } else {
    return oldUrl;
  }
};

const marketplaceMapping: Record<SupportedChain, string> = {
  eth: 'https://opensea.io/assets',
  polygon: 'https://opensea.io/assets',
  base: 'https://opensea.io/assets',
  abstract: 'https://magiceden.io/item-details',
};

export const nftToMarketplaceUrl = (nft: NFT) => {
  const chain = nft.chain as SupportedChain;
  const marketplaceBaseUrl = marketplaceMapping[chain];
  return `${marketplaceBaseUrl}/${MARKETPLACE_CHAIN_MAPPING[chain]}/${nft.contract_address}/${nft.id}`;
};
