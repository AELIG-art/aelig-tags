use std::cell::RefCell;
use candid::Principal;
use ic_certified_assets::types::StoreArg;
use ic_stable_structures::memory_manager::{MemoryId, MemoryManager};
use ic_stable_structures::{DefaultMemoryImpl, StableBTreeMap};
use crate::certificates::{get_certificate, save_certificate};
use crate::memory_ids::MemoryKeys;
use crate::types::{Error, NFTMetadata, Memory};
use crate::utils::is_valid_signature;

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

    static MEDIA_TO_ASSET_CANISTERS: RefCell<StableBTreeMap<u128, Principal, Memory>> =
        RefCell::new(
            StableBTreeMap::init(
                MEMORY_MANAGER_MAP.with(|m| m.borrow().get(
                    MemoryId::new(MemoryKeys::AssetToMediaCanister as u8))
                ),
            )
        );
}

#[ic_cdk::update]
pub fn save_certificate_with_media(
    tag_id: String,
    metadata: NFTMetadata,
    signature: String,
    media: StoreArg
) -> Result<String, Error> {
    match get_certificate(tag_id.clone()) {
        Ok(certificate) => {
            match u128::from_str_radix(&tag_id, 16) {
                Ok(tag_id_int) => {
                    if is_valid_signature(
                        tag_id.clone(),
                        metadata.clone(),
                        certificate.author.clone(),
                        signature.clone()
                    ) {
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
                                                            .insert(tag_id_int, principal);
                                                        save_certificate(
                                                            tag_id,
                                                            tag_id_int,
                                                            metadata
                                                        )
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

                    } else {
                        Err(Error::Validation {
                            msg: "Invalid signature".to_string()
                        })
                    }
                },
                Err(_) => {
                    Err(Error::ServerError {
                        msg: "Cannot convert tag id into u128".to_string()
                    })
                },
            }
        },
        Err(_) => {
            Err(Error::NotFound {
                msg: "Certificate does not exist".to_string()
            })
        }
    }
}