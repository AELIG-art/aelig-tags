use candid::Principal;
use ic_cdk::api::call::RejectionCode;
use ic_cdk::{call, caller};
use ic_stable_structures::Storable;
use crate::keys::get_key;
use crate::types::Error;

pub async fn get_address_from_siwe_identity() -> Result<String, Error> {
    let siwe_principal_res = get_key("SIWE".to_string());
    if siwe_principal_res.is_err() {
        return Err(Error::NotFound {
            msg: "Siwe principal not found".to_string()
        });
    }
    let principal_res = Principal::from_text(
        siwe_principal_res.ok().unwrap()
    );
    if principal_res.is_err() {
        return Err(Error::Validation {
            msg: "Siwe principal is not formatted correctly".to_string()
        });
    }
    let principal = principal_res.ok().unwrap();
    let response: Result<(String,), (RejectionCode, String)> = call(
        principal,
        "get_address",
        (caller().to_bytes(),)
    ).await;
    return match response {
        Ok((address,)) => {
            Ok(address)
        },
        Err((_, error)) => {
            Err(Error::NotFound {
                msg: error
            })
        }
    }
}