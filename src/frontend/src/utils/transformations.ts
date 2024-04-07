import {ID_LENGTH} from "./constants";


export const intToHexId = (id: number) => {
    const hex = id.toString(16);
    return `${"0".repeat(ID_LENGTH - hex.length)}${hex}`;
}

export const reduceWalletAddress = (address: string) => {
    return address.substring(0, 5) + "…" + address.substring(39, 42);
}