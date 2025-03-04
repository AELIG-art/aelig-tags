use crate::certificates::add_certificate;
use crate::frames::add_frame;
use crate::memory_ids::MemoryKeys;
use crate::types::{Error, Memory, Tag};
use ic_cdk::api::is_controller;
use ic_cdk::caller;
use ic_stable_structures::memory_manager::{MemoryId, MemoryManager};
use ic_stable_structures::{DefaultMemoryImpl, StableBTreeMap};
use std::cell::RefCell;

thread_local! {
    static MEMORY_MANAGER: RefCell<MemoryManager<DefaultMemoryImpl>> =
        RefCell::new(MemoryManager::init(DefaultMemoryImpl::default()));

    static TAGS: RefCell<StableBTreeMap<String, Tag, Memory>> = RefCell::new(
        StableBTreeMap::init(
            MEMORY_MANAGER.with(|m| m.borrow().get(
                MemoryId::new(MemoryKeys::Tags as u8))
            ),
        )
    );
}

pub fn _get_tag(id: String) -> Result<Tag, Error> {
    TAGS.with(|map| match map.borrow().get(&id) {
        Some(tag) => Ok(tag),
        None => Err(Error::NotFound { msg: "Tag does not exist".to_string() }),
    })
}

#[ic_cdk::query]
pub async fn get_tag(id: String) -> Result<Tag, Error> {
    _get_tag(id)
}

#[ic_cdk::query]
fn get_tags() -> Result<Vec<Tag>, Error> {
    if is_controller(&caller()) {
        return Ok(_get_tags());
    }
    Err(Error::PermissionDenied { msg: "The caller is not a canister controller".to_string() })
}

pub fn _get_tags() -> Vec<Tag> {
    TAGS.with(|tags| tags.borrow().iter().map(|(_, tag)| tag.clone()).collect())
}

#[ic_cdk::update]
fn add_tag(id: String, tag: Tag) -> Result<String, Error> {
    if is_controller(&caller()) {
        match _get_tag(id.clone()) {
            Ok(_) => Err(Error::PermissionDenied { msg: "This tag already exists".to_string() }),
            Err(_) => TAGS.with(|map| {
                map.borrow_mut().insert(id.clone(), tag.clone());
                if tag.is_certificate {
                    add_certificate(id, tag.owner, tag.short_id);
                } else {
                    add_frame(id);
                }
                Ok("Tag inserted".to_string())
            }),
        }
    } else {
        Err(Error::PermissionDenied { msg: "You are not allowed".to_string() })
    }
}

pub fn update_tag_ownership(id: String, to: String) -> Result<String, Error> {
    match _get_tag(id.clone()) {
        Ok(mut tag) => {
            tag.owner = to;
            TAGS.with(|map| {
                map.borrow_mut().insert(id, tag);
                Ok("Tag ownership updated".to_string())
            })
        }
        Err(e) => Err(e),
    }
}
