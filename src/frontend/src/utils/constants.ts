import { SupportedChain } from './types';

export const ID_LENGTH = 14;
export const APP_NAME = 'AELIG tags';
export const WALLET_CONNECT_PROJECT_ID = 'c51b8581597710e6b8c9f43bbc31f2d5';

export const MARKETPLACE_CHAIN_MAPPING: Record<SupportedChain, string> = {
  eth: 'ethereum',
  polygon: 'matic',
  base: 'base',
  abstract: 'abstract',
};

export const SUPPORTED_CHAINS_FOR_SELECT: {
  label: string;
  value: SupportedChain;
}[] = [
  {
    label: 'Ethereum',
    value: 'eth',
  },
  {
    label: 'Base',
    value: 'base',
  },
  {
    label: 'Polygon',
    value: 'polygon',
  },
  {
    label: 'Abstract',
    value: 'abstract',
  },
];
