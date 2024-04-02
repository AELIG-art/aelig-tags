import {ID_LENGTH} from "./constants";


export const intToHexId = (id: number) => {
    const hex = id.toString(16);
    return `${"0".repeat(ID_LENGTH - hex.length)}${hex}`;
}