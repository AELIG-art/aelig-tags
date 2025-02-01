use crate::keys::get_key;
use crate::types::Error;
use candid::{self, CandidType, Deserialize, Principal};
use ic_cdk::api::call::CallResult;
use serde_bytes::ByteBuf;

#[derive(Debug, CandidType, Deserialize)]
enum GetAddressResponse {
    Ok(String),
    Err(String),
}

struct IcSiweProvider(pub Principal);

impl IcSiweProvider {
    pub async fn get_address(&self, arg0: ByteBuf) -> CallResult<(GetAddressResponse,)> {
        ic_cdk::call(self.0, "get_address", (arg0,)).await
    }
}

pub async fn get_caller_address() -> Result<String, Error> {
    match get_key("SIWE".to_string()) {
        Ok(principal_as_str) => match Principal::from_text(&principal_as_str) {
            Ok(principal) => {
                let ic_siwe_provider = IcSiweProvider(principal);
                let address =
                    ic_siwe_provider.get_address(ByteBuf::from(ic_cdk::caller().as_slice())).await;
                match address {
                    Ok((response,)) => match response {
                        GetAddressResponse::Ok(address) => Ok(address),
                        GetAddressResponse::Err(_) => Err(Error::Validation {
                            msg: "Caller has not a registered address".to_string(),
                        }),
                    },
                    Err(_) => {
                        Err(Error::Validation { msg: "Error on calling siwe canister".to_string() })
                    }
                }
            }
            Err(_) => Err(Error::Validation {
                msg: "Siwe principal is not formatted correctly".to_string(),
            }),
        },
        Err(e) => Err(e),
    }
}
