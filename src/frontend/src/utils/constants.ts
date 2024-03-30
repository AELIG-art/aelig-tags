export const OPERATOR_ADDRESS = "0xF40fE06c96Fb6be8cf1995dd039Bb59408656046";
export const THIRDWEB_CLIENT_ID = "45cea97bfac6b4338802884ca5873e1f";
export const INTERNET_IDENTITY_SESSION_EXPIRATION = 7 * 24 * 60 * 60 * 1000 * 1000 * 1000;
export const NETWORK = process.env.DFX_NETWORK || (process.env.NODE_ENV === "production" ? "ic" : "local");
export const INTERNET_IDENTITY_URL = NETWORK === "local" ?
    `http://localhost:4943/?canisterId=${process.env.INTERNET_IDENTITY_CANISTER_ID}` :
    `https://identity.ic0.app`;
