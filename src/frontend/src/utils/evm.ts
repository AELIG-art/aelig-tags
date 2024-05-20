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
    },
    {
        "inputs": [
            {
                "internalType": "uint256",
                "name": "tokenId",
                "type": "uint256"
            }
        ],
        "name": "uri",
        "outputs": [
            {
                "internalType": "string",
                "name": "",
                "type": "string"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "bytes4",
                "name": "interfaceId",
                "type": "bytes4"
            }
        ],
        "name": "supportsInterface",
        "outputs": [
            {
                "internalType": "bool",
                "name": "",
                "type": "bool"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    }
];

const getContractStandard = async (contract: ethers.Contract) => {
    const isErc721 = await contract.supportsInterface("0x80ac58cd");
    return isErc721 ? "721" : "1155";
}

const fixOpenSeaUri = (uri: string, id: string) => {
    if (uri.includes("0x{id}")) {
        uri = uri.replace("0x{id}", `0x${BigInt(id).toString(16)}`);
    }
    return uri;
}


export const getMetadataFromNft = async (nft: NFT): Promise<NFTMetadata> => {
    const rpc = getRPC(nft.chain);
    const provider = new ethers.providers.JsonRpcProvider(rpc);
    const contract = new ethers.Contract(nft.contract_address, REDUCED_ABI, provider);
    const standard = await getContractStandard(contract);
    let tokenURI = "";
    if (standard === "721") {
        tokenURI = await contract.tokenURI(nft.id);
    } else {
        tokenURI = await contract.uri(nft.id);
    }
    tokenURI = transformUrl(tokenURI);
    tokenURI = fixOpenSeaUri(tokenURI, nft.id);
    const response = await fetch(tokenURI, {method: "GET", headers: {accept: 'application/json'}});
    const responseJSON = await response.json();
    return responseJSON as NFTMetadata;
}