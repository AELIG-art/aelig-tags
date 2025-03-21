use crate::certificates::_get_certificate;
use crate::memory_ids::MemoryKeys;
use crate::types::{Error, Memory};
use candid::Principal;
use ic_cdk::api::call::RejectionCode;
use ic_cdk::api::is_controller;
use ic_cdk::{call, caller};
use ic_certified_assets::types::StoreArg;
use ic_stable_structures::memory_manager::{MemoryId, MemoryManager};
use ic_stable_structures::{DefaultMemoryImpl, StableBTreeMap};
use std::cell::RefCell;

thread_local! {
    static MEMORY_MANAGER_VEC: RefCell<MemoryManager<DefaultMemoryImpl>> =
        RefCell::new(MemoryManager::init(DefaultMemoryImpl::default()));

    static ASSET_CANISTERS: RefCell<StableBTreeMap<u64, Principal, Memory>> = RefCell::new(
        StableBTreeMap::init(
            MEMORY_MANAGER_VEC.with(|m| m.borrow().get(
                MemoryId::new(MemoryKeys::MediaCanisters as u8))
            ),
        )
    );

    static MEMORY_MANAGER_MAP: RefCell<MemoryManager<DefaultMemoryImpl>> =
        RefCell::new(MemoryManager::init(DefaultMemoryImpl::default()));

    static MEDIA_TO_ASSET_CANISTERS: RefCell<StableBTreeMap<String, Principal, Memory>> =
        RefCell::new(
            StableBTreeMap::init(
                MEMORY_MANAGER_MAP.with(|m| m.borrow().get(
                    MemoryId::new(MemoryKeys::AssetToMediaCanister as u8))
                ),
            )
        );
}

#[ic_cdk::update]
async fn upload_media(tag_id: String, media: StoreArg) -> Result<String, Error> {
    if _get_certificate(tag_id.clone()).is_err() {
        return Err(Error::NotFound { msg: "Certificate does not exist".to_string() });
    }
    match get_storage_principal(tag_id.clone()) {
        Ok(principal) => {
            let response: Result<(), (RejectionCode, String)> =
                call(principal, "store", (media,)).await;
            if response.is_ok() {
                MEDIA_TO_ASSET_CANISTERS.with(|map| {
                    map.borrow_mut().insert(tag_id, principal);
                    Ok("Media uploaded".to_string())
                })
            } else {
                Err(Error::ServerError { msg: "Media not stored".to_string() })
            }
        }
        Err(e) => Err(e),
    }
}

#[ic_cdk::query]
fn get_storage_principal(tag_id: String) -> Result<Principal, Error> {
    MEDIA_TO_ASSET_CANISTERS.with(|map| match map.borrow().get(&tag_id) {
        Some(principal) => Ok(principal),
        None => get_last_storage_principal(),
    })
}

#[ic_cdk::update]
fn add_storage_canister(principal: Principal) -> Result<String, Error> {
    return if is_controller(&caller()) {
        ASSET_CANISTERS.with(|map| {
            let next_id = map.borrow().len();
            map.borrow_mut().insert(next_id, principal);
            Ok("New assets canister added".to_string())
        })
    } else {
        Err(Error::PermissionDenied { msg: "You are not allowed".to_string() })
    };
}

#[ic_cdk::query]
fn get_last_storage_principal() -> Result<Principal, Error> {
    ASSET_CANISTERS.with(|map| {
        if map.borrow().len() == 0 {
            Err(Error::NotFound { msg: "No asset canisters configured".to_string() })
        } else {
            let last_id = map.borrow().len() - 1;
            match map.borrow().get(&last_id) {
                Some(principal) => Ok(principal),
                None => Err(Error::NotFound { msg: "Asset canister not found".to_string() }),
            }
        }
    })
}
