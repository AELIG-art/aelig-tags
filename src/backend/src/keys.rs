use std::cell::RefCell;
use ic_cdk::{caller};
use ic_cdk::api::is_controller;
use ic_stable_structures::{DefaultMemoryImpl, StableBTreeMap};
use ic_stable_structures::memory_manager::{MemoryId, MemoryManager};
use crate::memory_ids::MemoryKeys;
use crate::types::{Error, Memory};

thread_local! {
    static MEMORY_MANAGER: RefCell<MemoryManager<DefaultMemoryImpl>> =
        RefCell::new(MemoryManager::init(DefaultMemoryImpl::default()));

    static KEYS: RefCell<StableBTreeMap<String, String, Memory>> = RefCell::new(
        StableBTreeMap::init(
            MEMORY_MANAGER.with(|m| m.borrow().get(
                MemoryId::new(MemoryKeys::Keys as u8))
            ),
        )
    );
}

pub fn get_key(key: String) -> Result<String, Error> {
    KEYS.with(|map| {
        match map.borrow().get(&key) {
            Some(key) => Ok(key.clone()),
            None => Err(Error::KeyNotFound {
                msg: format!("Key {} not found", key)
            })
        }
    })
}

#[ic_cdk::update]
fn set_key(key: String, value: String) -> Result<String, Error> {
    return if is_controller(&caller()) {
        KEYS.with(|map| {
            map.borrow_mut().insert(key, value);
            Ok("Success".to_string())
        })
    } else {
        Err(Error::PermissionDenied {
            msg: "You have not the permission to make changes".to_string()
        })
    }
}