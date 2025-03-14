import {
  NFT,
  NFTDetails,
  NFTMetadata,
} from '../declarations/backend/backend.did';
import { ethers } from 'ethers';
import { transformUrl } from './transformations';
import { SupportedChain } from './types';

enum NftStandard {
  ERC721 = '721',
  ERC1155 = '1155',
}

const getRPC = (chain: SupportedChain) => {
  switch (chain) {
    case 'eth':
      return 'https://1.rpc.thirdweb.com';
    case 'polygon':
      return 'https://137.rpc.thirdweb.com';
    case 'base':
      return 'https://8453.rpc.thirdweb.com';
    case 'abstract':
      return 'https://2741.rpc.thirdweb.com';
    default:
      throw Error('Chain not found.');
  }
};

const REDUCED_ABI = [
  {
    inputs: [
      {
        internalType: 'uint256',
        name: 'tokenId',
        type: 'uint256',
      },
    ],
    name: 'tokenURI',
    outputs: [
      {
        internalType: 'string',
        name: '',
        type: 'string',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'uint256',
        name: 'tokenId',
        type: 'uint256',
      },
    ],
    name: 'uri',
    outputs: [
      {
        internalType: 'string',
        name: '',
        type: 'string',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'bytes4',
        name: 'interfaceId',
        type: 'bytes4',
      },
    ],
    name: 'supportsInterface',
    outputs: [
      {
        internalType: 'bool',
        name: '',
        type: 'bool',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
];

const getContractStandard = async (contract: ethers.Contract) => {
  const isErc721 = await contract.supportsInterface('0x80ac58cd');
  return isErc721 ? NftStandard.ERC721 : NftStandard.ERC1155;
};

const formatUri = (uri: string, id: string) => {
  /*
        The URI of many NFTs minted on OpenSea use their own format for IDs.
        This case is covered if the following condition.
    */
  if (uri.includes('0x{id}')) {
    uri = uri.replace('0x{id}', `0x${BigInt(id).toString(16)}`);
  }
  return uri;
};

export const getMetadataFromNft = async (nft: NFT): Promise<NFTMetadata> => {
  const rpc = getRPC(nft.chain as SupportedChain);
  const provider = new ethers.providers.JsonRpcProvider(rpc);
  const contract = new ethers.Contract(
    nft.contract_address,
    REDUCED_ABI,
    provider
  );
  const standard = await getContractStandard(contract);
  let tokenURI;
  if (standard === NftStandard.ERC721) {
    tokenURI = await contract.tokenURI(nft.id);
  } else {
    tokenURI = await contract.uri(nft.id);
  }
  tokenURI = transformUrl(tokenURI);
  tokenURI = formatUri(tokenURI, nft.id);
  const response = await fetch(tokenURI, {
    method: 'GET',
    headers: { accept: 'application/json' },
  });
  const responseJSON = await response.json();
  return responseJSON as NFTMetadata;
};

const chainToExplorerMapping: Record<SupportedChain, string | undefined> = {
  eth: 'https://etherscan.io/nft',
  polygon: 'https://polygonscan.com/nft',
  base: 'https://basescan.org/nft',
  abstract: undefined,
};

export const getScanUrl = (nftDetails: NFTDetails | undefined) => {
  if (!nftDetails) {
    return '';
  }
  const { chain, address, id } = nftDetails;
  const explorerUrl = chainToExplorerMapping[chain as SupportedChain];
  return explorerUrl ? `${explorerUrl}/${address}/${id}` : undefined;
};
