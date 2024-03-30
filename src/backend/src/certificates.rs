use std::cell::RefCell;
use std::str::FromStr;
use std::string::ToString;
use ic_stable_structures::{DefaultMemoryImpl, StableBTreeMap};
use ic_stable_structures::memory_manager::{MemoryId, MemoryManager};
use crate::memory_ids::MemoryKeys;
use crate::types::{Certificate, Error, Memory, NFTMetadata, SignMessage};
use ethers_core::{types::{Address, RecoveryMessage, Signature}};

const SMART_CONTRACT: &str = "0x74D02a1ff93eaB3E4320D9ef77BB81747464f2E0";

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
            signature: None,
            owner: author.clone(),
            author
        });
    });
}

fn is_valid_signature(
    id: String,
    metadata: NFTMetadata,
    author: String,
    user_signature: String
) -> bool {
    let signature_message = SignMessage {
        name: metadata.name,
        description: metadata.description,
        image: metadata.image,
        attributes: metadata.attributes,
        identifier: format!("gnosis:{}:{}", SMART_CONTRACT, tag_id_int),
    };

    match serde_json::to_string(&signature_message) {
        Ok(message) => {
            Signature::from_str(&user_signature)
                .unwrap()
                .verify(
                    RecoveryMessage::Data(message.into_bytes()),
                    Address::from_str(&author).unwrap(),
                )
                .is_ok()
        },
        Err(_) => false,
    }
}

#[ic_cdk::update]
pub fn save_certificate(
    tag_id: String,
    metadata: NFTMetadata,
    signature: String
) -> Result<String, Error> {
    match u128::from_str_radix(&tag_id, 16) {
        Ok(tag_id_int) => {
            CERTIFICATES.with(|map| {
                let certificate_option = CERTIFICATES.with(|map| {
                    map.borrow().get(&tag_id)
                });
                match certificate_option {
                    Some(certificate) => {
                        if !certificate.registered {
                            if is_valid_signature(
                                tag_id.clone(),
                                metadata.clone(),
                                certificate.author.clone(),
                                signature.clone()
                            ) {
                                map.borrow_mut().insert(tag_id, Certificate {
                                    id: tag_id_int,
                                    registered: false,
                                    metadata: Some(metadata),
                                    signature: None,
                                    owner: certificate.author.clone(),
                                    author: certificate.author
                                });
                                Ok("Certificate saved".to_string())
                            } else {
                                Err(Error::Validation {
                                    msg: "Invalid signature".to_string()
                                })
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
        },
        Err(_) => {
            Err(Error::ServerError {
                msg: "Cannot convert tag id into u128".to_string()
            })
        },
    }
}