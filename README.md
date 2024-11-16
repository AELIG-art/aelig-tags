# AELIG tags

This repository implements both the backend and frontend for a platform that manages NFC tags for frames and certificates on the Internet Computer (IC) network.

## Repository Overview

The project is organized into the following components:

- **Backend Canister**: Handles NFC tags and the core business logic of the platform.
- **Asset Canister**: Stores media files associated with certificates, such as images and documents.
- **IC SIWE Identity Canister**: Integrates with Ethereum Virtual Machine (EVM) wallets to manage secure Web3 Identity (Sign-In With Ethereum).
- **Frontend Canister**: A React-based asset canister containing the user interface for interacting with the platform.

## Requirements

- [dfx](https://internetcomputer.org/docs/current/developer-docs/getting-started/install/#installing-dfx)
- Node 20
- Rust
- Npm

## Project local setup

1. Install dependencies by running `npm install`.
2. Run local IC replica by running `npm run local-canister`.
3. Setup canisters by running `./setup.sh -n <network_name> -t <tag_key>`. This script will:
   - Create and deploy the canisters;
   - Add assets canister to backend: `dfx canister call backend add_storage_canister '(principal "{CANISTER_ID_ASSETS}")'`;
   - Authorize backend canister to upload media to assets canister: `dfx canister call assets authorize '(principal "{CANISTER_ID_BACKEND}")'`;
   - Give backend canister commit permission for asset canister: `dfx canister call --ic assets grant_permission '(record{permission=variant {Commit};to_principal=principal "{CANISTER_ID_BACKEND}"})'`;
   - Add tag key: `dfx canister call backend set_key '("TAG_KEY","***")''`;
   - Add siwe principal: `dfx canister call backend set_key '("SIWE","{CANISTER_ID_IC_SIWE_PROVIDER}")'`.
4. Run react server with `npm run start`.
5. Set admin:
   1. Connect you wallet and sign message
   2. Navigate to /admin and copy your principal
   3. Get the local canister id in ./dfc/local/canister_ids.json and copy backend's id
   4. Run `dfx canister update-settings <CANISTER-ID> --add-controller <YOUR-PRINCIPAL>`

**NOTES**

- tag_key must be the same AES key used for NFC tags. It is stored [here](https://paste.digital/?p=Hdzu5BPjOnuaHq-Tmhyot), protected by password (ask [giacomo@aelig.art](mailto:giacomo@aelig.art));
- There is no native support for `dfx` on Windows [[source](https://internetcomputer.org/docs/current/developer-docs/getting-started/install/windows-wsl)].
- Add `--ic` flag to run configurations on Internet Computer main net.
- You must be a canister controller to make configurations effective.
- If the canister interfaces are updated, run `npm run generate`.

## Deploy and updates

For deployment, refers to the [official guide](https://internetcomputer.org/docs/current/developer-docs/developer-tools/cli-tools/cli-reference/dfx-deploy).

## Custom domain

Follow this guide to setup custom domain: [ic guide](https://internetcomputer.org/docs/current/developer-docs/web-apps/custom-domains/using-custom-domains).


