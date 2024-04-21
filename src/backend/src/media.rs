use std::cell::RefCell;
use candid::Principal;
use ic_certified_assets::types::StoreArg;
use ic_stable_structures::memory_manager::{MemoryId, MemoryManager};
use ic_stable_structures::{DefaultMemoryImpl, StableBTreeMap};
use crate::certificates::{get_certificate};
use crate::memory_ids::MemoryKeys;
use crate::types::{Error, Memory};

thread_local! {
    static MEMORY_MANAGER_VEC: RefCell<MemoryManager<DefaultMemoryImpl>> =
        RefCell::new(MemoryManager::init(DefaultMemoryImpl::default()));

    static ASSET_CANISTERS: RefCell<StableBTreeMap<u128, Principal, Memory>> = RefCell::new(
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
pub fn upload_media(
    tag_id: String,
    media: StoreArg
) -> Result<String, Error> {
    match get_certificate(tag_id.clone()) {
        Ok(_) => {
            ASSET_CANISTERS.with(|map| {
                let n_asset_canisters = 1;
                if n_asset_canisters > 0 {
                    match map.borrow().get(&(n_asset_canisters - 1)) {
                        Some(principal) => {
                            match ic_cdk::notify(principal, "store", (media,)) {
                                Ok(_) => {
                                    MEDIA_TO_ASSET_CANISTERS
                                        .with(|map| {
                                            map.borrow_mut()
                                                .insert(tag_id, principal);
                                            Ok("Media uploaded".to_string())
                                        })
                                },
                                Err(_) => {
                                    Err(Error::ServerError {
                                        msg: "Media not stored".to_string()
                                    })
                                }
                            }
                        },
                        None => {
                            Err(Error::ServerError {
                                msg: "Media canister not found".to_string()
                            })
                        }
                    }
                } else {
                    Err(Error::NotFound {
                        msg: "No asset canister registered".to_string()
                    })
                }
            })
        },
        Err(_) => {
            Err(Error::NotFound {
                msg: "Certificate does not exist".to_string()
            })
        }
    }
}

#[ic_cdk::query]
fn get_storage_principal(id: String) -> Result<Principal, Error> {
    MEDIA_TO_ASSET_CANISTERS.with(|map| {
        match map.borrow().get(&id) {
            Some(principal) => Ok(principal),
            None => Err(
                Error::NotFound {
                    msg: "Id not found".to_string()
                }
            )
        }
    })
}