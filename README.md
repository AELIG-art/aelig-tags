# AELIG Tags

This repository implements both the backend and frontend for a platform that manages NFC tags for frames and certificates on the Internet Computer (IC) network.

## Repository Overview

The project is organized into the following components:

- **Backend Canister**: Handles NFC tags and the core business logic of the platform.
- **Asset Canister**: Stores media files associated with certificates, such as images and documents.
- **IC SIWE Identity Canister**: Integrates with Ethereum Virtual Machine (EVM) wallets to manage secure Web3 Identity (Sign-In With Ethereum).
- **Frontend Canister**: A React-based asset canister containing the user interface for interacting with the platform.

## Requirements

- [dfx](https://internetcomputer.org/docs/current/developer-docs/getting-started/install/#installing-dfx)
- Node.js 20
- Rust
- npm

## Local Project Setup

1. Install dependencies by running `npm install`.
2. Run the local IC replica by executing `npm run local-canister`.
3. Set up canisters by running `./setup.sh -n <network_name> -t <tag_key>`. This script will:
   - Create and deploy the canisters.
   - Add the assets canister to the backend: `dfx canister call backend add_storage_canister '(principal "{CANISTER_ID_ASSETS}")'`
   - Authorize the backend canister to upload media to the assets canister: `dfx canister call assets authorize '(principal "{CANISTER_ID_BACKEND}")'`
   - Grant the backend canister commit permission for the asset canister: `dfx canister call --ic assets grant_permission '(record{permission=variant {Commit};to_principal=principal "{CANISTER_ID_BACKEND}"})'`
   - Add the tag key: `dfx canister call backend set_key '("TAG_KEY","***")'`
   - Add the SIWE principal: `dfx canister call backend set_key '("SIWE","{CANISTER_ID_IC_SIWE_PROVIDER}")'`
4. Run the React server with `npm run start`.
5. Set the admin:
   1. Connect your wallet and sign the message.
   2. Navigate to `/admin` and copy your principal.
   3. Get the local canister ID in `./dfx/local/canister_ids.json` and copy the backend's ID.
   4. Run `dfx canister update-settings <CANISTER-ID> --add-controller <YOUR-PRINCIPAL>`.

**NOTES**

- The `tag_key` must be the same AES key used for NFC tags. It is stored [here](https://paste.digital/?p=Hdzu5BPjOnuaHq-Tmhyot), protected by a password (ask [giacomo@aelig.art](mailto:giacomo@aelig.art)).
- There is no native support for `dfx` on Windows. Refer to [this source](https://internetcomputer.org/docs/current/developer-docs/getting-started/install/windows-wsl).
- Add the `--ic` flag to run configurations on the Internet Computer mainnet.
- You must be a canister controller to make configuration changes effective.
- If the canister interfaces are updated, run `npm run generate`.

## Deployment and Updates

For deployment, refer to the [official guide](https://internetcomputer.org/docs/current/developer-docs/developer-tools/cli-tools/cli-reference/dfx-deploy).

## Custom Domain

Follow [this guide](https://internetcomputer.org/docs/current/developer-docs/web-apps/custom-domains/using-custom-domains) to set up a custom domain.
