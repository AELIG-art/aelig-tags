network="local"

usage() {
    echo "Usage: $0 -n <network_name> -t <tag_key>"
    echo "Options:"
    echo "  -n, --network <network_name>    Specify the network name (e.g., 'local', 'ic')."
    echo "  -h, --help                      Show this help message and exit."
    exit 1
}

if [ -z "$IC_SIWE_PROVIDER_SALT" ]; then
    echo "The variable `IC_SIWE_PROVIDER_SALT` is not set as env variable."
    exit 1
fi

if [ -z "$TAG_KEY" ]; then
    echo "The variable `TAG_KEY` is not set as env variable."
    exit 1
fi

while getopts ":n:h" opt; do
    case ${opt} in
        n )
            network=$OPTARG
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

echo "--- Creating canisters ---"
dfx canister create --all -q --network "$network"
backend_canister_id=$(dfx canister id backend --network "$network" )
ic_siwe_provider_canister_id=$(dfx canister id ic_siwe_provider --network "$network" )
assets_canister_id=$(dfx canister id assets --network "$network" )
frontend_canister_id=$(dfx canister id frontend --network "$network" )

echo "--- Deploying canisters ---"
dfx deploy --network "$network" -q backend --yes
dfx deploy --network "$network" -q assets --yes
dfx deploy --network "$network" -q ic_siwe_provider --yes --argument "( \
     record { \
         domain = \"tag.aelig.art\"; \
         uri = \"https://tag.aelig.art\"; \
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
 dfx deploy --network "$network" -q frontend --yes

echo "--- Adding asset canister to the backend canister ---"
dfx canister call backend add_storage_canister "(principal \"$assets_canister_id\")"
dfx canister call assets authorize "(principal \"$backend_canister_id\")"
dfx canister call --ic assets grant_permission "(record{permission=variant {Commit};to_principal=principal \"$backend_canister_id\"})"

echo "--- Setting backend tag key ---"
dfx canister call backend set_key "(\"TAG_KEY\",\"$TAG_KEY\")"

echo "--- Setting siwe id key ---"
dfx canister call backend set_key "(\"SIWE\",\"$ic_siwe_provider_canister_id\")"

echo "--- Setup completed ---"
echo "Backend canister id: $backend_canister_id"
echo "Frontend canister id: $frontend_canister_id"
echo "Assets canister id: $assets_canister_id"
echo "Ic siwe provider canister id: $ic_siwe_provider_canister_id"
