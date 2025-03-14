use crate::auth::is_authenticated;
use crate::ic_siwe_provider::get_caller_address;
use crate::memory_ids::MemoryKeys;
use crate::tags::_get_tags;
use crate::types::{Certificate, Error, Memory, NFTDetails, NFTMetadata};
use ic_cdk::api::is_controller;
use ic_cdk::{caller, trap};
use ic_stable_structures::memory_manager::{MemoryId, MemoryManager};
use ic_stable_structures::{DefaultMemoryImpl, StableBTreeMap};
use std::cell::RefCell;
use std::string::ToString;

thread_local! {
    static MEMORY_MANAGER: RefCell<MemoryManager<DefaultMemoryImpl>> =
        RefCell::new(MemoryManager::init(DefaultMemoryImpl::default()));

    static CERTIFICATES: RefCell<StableBTreeMap<String, Certificate, Memory>> = RefCell::new(
        StableBTreeMap::init(
            MEMORY_MANAGER.with(|m| m.borrow().get(
                MemoryId::new(MemoryKeys::Certificates as u8))
            ),
        )
    );
}

pub fn _get_certificate(tag_id: String) -> Result<Certificate, Error> {
    match CERTIFICATES.with(|map| map.borrow().get(&tag_id)) {
        Some(certificate) => Ok(certificate),
        None => {
            Err(Error::NotFound { msg: format!("Certificate with ID {} does not exist", tag_id) })
        }
    }
}

#[ic_cdk::update]
pub async fn get_certificate(tag_id: String) -> Result<Certificate, Error> {
    match _get_certificate(tag_id.clone()) {
        Ok(certificate) => {
            if !certificate.registered
                && !is_controller(&caller())
                && !is_authenticated(tag_id.clone()).await
            {
                return Err(Error::PermissionDenied {
                    msg: "Caller is not the controller, not the tag owner, or the tag is not registered.".to_string(),
                });
            }
            Ok(certificate)
        }
        Err(e) => Err(e),
    }
}

pub fn add_certificate(tag_id: String, author: String, short_id: String) {
    CERTIFICATES.with(|map| {
        map.borrow_mut().insert(
            tag_id.clone(),
            Certificate {
                id: tag_id,
                registered: false,
                metadata: None,
                nft_details: None,
                short_id,
                author,
            },
        );
    });
}

#[ic_cdk::update]
async fn save_certificate(
    tag_id: String,
    metadata: NFTMetadata,
    nft_details: Option<NFTDetails>,
) -> Result<String, Error> {
    let caller_siwe_address_res = get_caller_address().await;

    match caller_siwe_address_res {
        Ok(address) => CERTIFICATES.with(|map| {
            let certificate_option = CERTIFICATES.with(|map| map.borrow().get(&tag_id));
            match certificate_option {
                Some(certificate) => {
                    if certificate.author != address {
                        return Err(Error::PermissionDenied {
                            msg: "You are not the author of this certificate".to_string(),
                        });
                    }
                    if !certificate.registered {
                        map.borrow_mut().insert(
                            tag_id.clone(),
                            Certificate {
                                id: tag_id,
                                registered: false,
                                metadata: Some(metadata),
                                nft_details,
                                author: certificate.author,
                                short_id: certificate.short_id,
                            },
                        );
                        Ok("Certificate saved".to_string())
                    } else {
                        Err(Error::PermissionDenied {
                            msg: "Owner does not coincide or certificate already registered"
                                .to_string(),
                        })
                    }
                }
                None => Err(Error::NotFound { msg: "Certificate does not exist".to_string() }),
            }
        }),
        Err(e) => Err(e),
    }
}

#[ic_cdk::update]
async fn register_certificate(id: String) -> Result<String, Error> {
    let caller_siwe_address_res = get_caller_address().await;

    match caller_siwe_address_res {
        Ok(address) => CERTIFICATES.with(|map| {
            let certificate = map.borrow().get(&id);
            match certificate {
                Some(certificate) => {
                    if certificate.author != address {
                        return Err(Error::PermissionDenied {
                            msg: "You are not the author of this certificate".to_string(),
                        });
                    }
                    if certificate.registered {
                        Err(Error::Validation {
                            msg: "Certificate is already registered".to_string(),
                        })
                    } else {
                        let metadata = certificate.metadata;
                        let nft_details = certificate.nft_details;
                        match metadata {
                            Some(_) => {
                                map.borrow_mut().insert(
                                    id,
                                    Certificate {
                                        id: certificate.id,
                                        metadata,
                                        nft_details,
                                        author: certificate.author,
                                        registered: true,
                                        short_id: certificate.short_id,
                                    },
                                );
                                Ok("Tag registered".to_string())
                            }
                            None => {
                                Err(Error::Validation { msg: "Metadata are not set".to_string() })
                            }
                        }
                    }
                }
                None => Err(Error::NotFound {
                    msg: format!("Cannot find the certificate with id: {}", id),
                }),
            }
        }),
        Err(e) => Err(e),
    }
}

#[ic_cdk::update]
async fn get_certificates() -> Result<Vec<Certificate>, Error> {
    match get_caller_address().await {
        Ok(address) => Ok(_get_tags()
            .iter()
            .filter(|tag| tag.owner == address && tag.is_certificate)
            .map(|tag| {
                CERTIFICATES.with(|certificates| match certificates.borrow().get(&tag.id) {
                    Some(certificate) => certificate,
                    None => trap("Certificate does not exist"),
                })
            })
            .collect()),
        Err(e) => Err(e),
    }
}
