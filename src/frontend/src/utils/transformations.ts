import { CHAIN_MAPPING_OPENSEA, ID_LENGTH } from './constants';
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

export const nftToOpenSeaUrl = (nft: NFT) => {
  return `https://opensea.io/assets/${CHAIN_MAPPING_OPENSEA[nft.chain as SupportedChain]}/${nft.contract_address}/${nft.id}`;
};
