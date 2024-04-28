export const INTERNET_IDENTITY_SESSION_EXPIRATION = 7 * 24 * 60 * 60 * 1000 * 1000 * 1000;
export const NETWORK = process.env.DFX_NETWORK || (process.env.NODE_ENV === "production" ? "ic" : "local");
export const INTERNET_IDENTITY_URL = NETWORK === "local" ?
    `http://localhost:4943/?canisterId=${process.env.INTERNET_IDENTITY_CANISTER_ID}` :
    `https://identity.ic0.app`;
export const ID_LENGTH = 14;
export const APP_NAME = "AELIG tags";
export const WALLET_CONNECT_PROJECT_ID = "c51b8581597710e6b8c9f43bbc31f2d5";
