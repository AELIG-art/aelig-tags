use std::cell::RefCell;
use std::string::ToString;
use ic_stable_structures::{DefaultMemoryImpl, StableBTreeMap};
use ic_stable_structures::memory_manager::{MemoryId, MemoryManager};
use crate::memory_ids::MemoryKeys;
use crate::types::{Certificate, Error, Memory, NFTMetadata};


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

#[ic_cdk::query]
pub fn get_certificate(tag_id: String) -> Result<Certificate, Error> {
    CERTIFICATES.with(|map| {
        match map.borrow().get(&tag_id) {
            Some(certificate) => {
                Ok(certificate)
            },
            None => Err(Error::NotFound {
                msg: format!("Certificate with id {} does not exist", tag_id)
            })
        }
    })
}

pub fn add_certificate(tag_id: String, author: String) {
    CERTIFICATES.with(|map| {
        let id_int = u128::from_str_radix(&tag_id, 16).expect("Id conversion error");
        map.borrow_mut().insert(tag_id, Certificate {
            id: id_int,
            registered: false,
            metadata: None,
            owner: author.clone(),
            author
        });
    });
}

#[ic_cdk::update]
pub fn save_certificate(
    tag_id: String,
    metadata: NFTMetadata,
) -> Result<String, Error> {
    CERTIFICATES.with(|map| {
        let certificate_option = CERTIFICATES.with(|map| {
            map.borrow().get(&tag_id)
        });
        match certificate_option {
            Some(certificate) => {
                if !certificate.registered {
                    match u128::from_str_radix(&tag_id, 16) {
                        Ok(tag_id_int) => {
                            map.borrow_mut().insert(tag_id, Certificate {
                                id: tag_id_int,
                                registered: false,
                                metadata: Some(metadata),
                                owner: certificate.author.clone(),
                                author: certificate.author
                            });
                            Ok("Certificate saved".to_string())
                        }
                        Err(_) => {
                            Err(Error::ServerError {
                                msg: "Cannot convert string to int".to_string()
                            })
                        }
                    }
                } else {
                    Err(Error::PermissionDenied {
                        msg: "Owner does not coincide or certificate already registered"
                            .to_string()
                    })
                }
            },
            None => {
                Err(Error::NotFound {
                    msg: "Certificate does not exist".to_string()
                })
            }
        }
    })
}

#[ic_cdk::update]
pub fn register_certificate(id: String) -> Result<String, Error> {
    CERTIFICATES.with(|map| {
        let certificate = map.borrow().get(&id);
        match certificate {
            Some(certificate) => {
                if certificate.registered {
                    Err(Error::Validation {
                        msg: "Certificate is already registered".to_string()
                    })
                } else {
                    let metadata = certificate.clone().metadata;
                    match metadata {
                        Some(metadata) => {
                            if is_valid_signature(
                                id.clone(),
                                metadata,
                                certificate.clone().author,
                                signature.clone()
                            ) {
                                map.borrow_mut().insert(
                                    id,
                                    Certificate {
                                        id: certificate.id,
                                        metadata: certificate.metadata,
                                        author: certificate.author,
                                        registered: true,
                                        owner: certificate.owner,
                                        signature: Some(signature)
                                    }
                                );
                                Ok("Tag registered".to_string())
                            } else {
                                Err(Error::Validation {
                                    msg: "Signature is not valid".to_string()
                                })
                            }
                        },
                        None => Err(Error::Validation {
                            msg: "Metadata are not set".to_string()
                        })
                    }
                }
            },
            None => Err(Error::NotFound {
                msg: format!("Cannot find the certificate with id: {}", id)
            })
        }
    })
}
