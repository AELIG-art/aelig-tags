# AELIG tags

## Requirements

- [dfx](https://internetcomputer.org/docs/current/developer-docs/getting-started/install/#installing-dfx)
- Node 20
- Rust

## Local setup

- `npm install`: Install dependencies;
- `npm run local-canister` Run ICP instance locally;
- `npm run start`: Run frontend;
- `npm run local-deploy`: Deploy canister in local ICP instance.
- Set TAG_KEY with the tag key ([paste](https://paste.digital/?p=Hdzu5BPjOnuaHq-Tmhyot)). Ask password to giacomo@aelig.art.

### Canister setup

After deploying backend and assets canisters:

- Add assets canister to backend: `dfx canister call backend  backend add_storage_canister '(principal "{CANISTER_ID_ASSETS}")'`
- Authorize backend canister to upload media to assets canister: ` dfx canister call assets authorize '(principal "{CANISTER_ID_BACKEND}")'`

Replace `CANISTER_ID_ASSETS` and `CANISTER_ID_BACKEND` with the corresponding values wrote in the .env file after local deploy.

### Note

There is no native support for `dfx` on Windows [[source](https://internetcomputer.org/docs/current/developer-docs/getting-started/install/windows-wsl)].

## Deploy

If canisters are already created. Create canister_ids.json file...

## Custom domain

Follow this guide to setup custom domain: [ic guide](https://internetcomputer.org/docs/current/developer-docs/web-apps/custom-domains/using-custom-domains).


