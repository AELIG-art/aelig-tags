import {NFT, NFTMetadata} from "../declarations/backend/backend.did";
import { ethers } from "ethers";
import {transformUrl} from "./transformations";

const getRPC = (chain: string) => {
    switch (chain) {
        case "eth":
            return "https://1.rpc.thirdweb.com";
        case "polygon":
            return "https://137.rpc.thirdweb.com";
        default:
            throw Error("Chain not found.");
    }
}

const REDUCED_ABI = [
    {
        "inputs": [
            {
                "internalType": "uint256",
                "name": "tokenId",
                "type": "uint256"
            }
        ],
        "name": "tokenURI",
        "outputs": [
            {
                "internalType": "string",
                "name": "",
                "type": "string"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    }
];


export const getMetadataFromNft = async (nft: NFT): Promise<NFTMetadata> => {
    const rpc = getRPC(nft.chain);
    const provider = new ethers.providers.JsonRpcProvider(rpc);
    const contract = new ethers.Contract(nft.contract_address, REDUCED_ABI, provider);
    const metadataUri = transformUrl(await contract.tokenURI(nft.id));
    const response = await fetch(metadataUri, {method: "GET", headers: {accept: 'application/json'}});
    return await response.json() as NFTMetadata;
}