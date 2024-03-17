use std::cell::RefCell;
use ic_stable_structures::{DefaultMemoryImpl, StableBTreeMap};
use ic_stable_structures::memory_manager::{MemoryId, MemoryManager};
use crate::memory_ids::MemoryKeys;
use crate::types::{Certificate, Error, Memory};

thread_local! {
    static MEMORY_MANAGER: RefCell<MemoryManager<DefaultMemoryImpl>> =
        RefCell::new(MemoryManager::init(DefaultMemoryImpl::default()));

    static CERTIFICATES: RefCell<StableBTreeMap<String, Certificate, Memory>> = RefCell::new(
        StableBTreeMap::init(
            MEMORY_MANAGER.with(|m| m.borrow().get(
                MemoryId::new(MemoryKeys::Collections as u8))
            ),
        )
    );
}

#[ic_cdk::query]
pub fn get_certificate(tag_id: String) -> Result<Certificate, Error> {
    CERTIFICATES.with(|map| {
        match map.borrow().get(&tag_id) {
            Some(certificate) => {
                return if certificate.registered {
                    Ok(certificate.clone())
                } else {
                    Err(Error::CertificateNotFound {
                        msg: format!("Certificate with id {} does not exist", tag_id)
                    })
                }
            },
            None => Err(Error::CertificateNotFound {
                msg: format!("Certificate with id {} does not exist", tag_id)
            })
        }
    })
}