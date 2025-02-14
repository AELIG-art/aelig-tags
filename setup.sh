network="local"
tag=""

usage() {
    echo "Usage: $0 -n <network_name> -t <tag_key>"
    echo "Options:"
    echo "  -n, --network <network_name>    Specify the network name (e.g., 'local', 'ic')."
    echo "  -t, --tag <tag_key>             Specify the mandatory tag key."
    echo "  -h, --help                      Show this help message and exit."
    exit 1
}

if [ -f ".env" ]; then
    set -o allexport
    source ".env"
    set +o allexport
else
    echo "Error: .env file not found."
    exit 1
fi

if [ -z "$IC_SIWE_PROVIDER_SALT" ]; then
    echo "The variable IC_SIWE_PROVIDER_SALT is not set in the .env file."
    exit 1
fi

while getopts ":n:t:h" opt; do
    case ${opt} in
        n )
            network=$OPTARG
            ;;
        t )
            tag=$OPTARG
            ;;
        h )
            usage
            ;;
        \? )
            echo "Invalid Option: -$OPTARG" 1>&2
            usage
            ;;
        : )
            echo "Invalid Option: -$OPTARG requires an argument" 1>&2
            usage
            ;;
    esac
done
shift $((OPTIND -1))

if [[ -z "$tag" ]]; then
    echo "The --tag argument was not provided. Please enter a tag key:"
    read tag
    if [[ -z "$tag" ]]; then
        echo "No tag key provided, cannot proceed."
        exit 1
    fi
fi

echo "--- Creating canisters ---"
dfx canister create --all -q
backend_canister_id=$(dfx canister id backend)
ic_siwe_provider_canister_id=$(dfx canister id ic_siwe_provider)
assets_canister_id=$(dfx canister id assets)
frontend_canister_id=$(dfx canister id frontend)

echo "--- Deploying canisters ---"
dfx deploy --network "$network" -q backend
dfx deploy --network "$network" -q assets
dfx deploy --network "$network" -q ic_siwe_provider --argument "( \
     record { \
         domain = \"aelig.art\"; \
         uri = \"https://aelig.art\"; \
         salt = \"$IC_SIWE_PROVIDER_SALT\"; \
         chain_id = opt 1; \
         scheme = opt \"https\"; \
         statement = opt \"Login to the app\"; \
         sign_in_expires_in = opt 1800000000000; /* 30 minutes */ \
         session_expires_in = opt 14515200000000000; /* 6 months */ \
         targets = opt vec { \
             \"$ic_siwe_provider_canister_id\"; \
             \"$backend_canister_id\"; \
         }; \
     } \
 )"
 dfx deploy --network "$network" -q frontend

echo "--- Adding asset canister to the backend canister ---"
dfx canister call backend add_storage_canister "(principal \"$assets_canister_id\")"
dfx canister call assets authorize "(principal \"$backend_canister_id\")"
dfx canister call --ic assets grant_permission "(record{permission=variant {Commit};to_principal=principal \"$backend_canister_id\"})"

echo "--- Setting backend tag key ---"
dfx canister call backend set_key "(\"TAG_KEY\",\"$tag\")"

echo "--- Setting siwe id key ---"
dfx canister call backend set_key "(\"SIWE\",\"$ic_siwe_provider_canister_id\")"

echo "--- Setup completed ---"
echo "Backend canister id: $backend_canister_id"
echo "Frontend canister id: $frontend_canister_id"
echo "Assets canister id: $assets_canister_id"
echo "Ic siwe provider canister id: $ic_siwe_provider_canister_id"
