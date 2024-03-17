use std::cell::RefCell;
use ic_stable_structures::{DefaultMemoryImpl, StableBTreeMap};
use ic_stable_structures::memory_manager::{MemoryId, MemoryManager};
use crate::memory_ids::MemoryKeys;
use crate::types::{Error, Memory, Tag};

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

#[ic_cdk::query]
pub fn get_tag(id: String) -> Result<Tag, Error>  {
    TAGS.with(|map| {
        match map.borrow().get(&id) {
            Some(tag) => Ok(tag.clone()),
            None => Err(Error::TagNotFound {
                msg: "Tag does not exist".to_string()
            })
        }
    })
}

#[ic_cdk::query]
fn get_tags_owned_by(owner: String) -> Vec<Tag> {
    TAGS.with(|tags| {
        tags.borrow()
            .iter()
            .filter_map(|(_, tag)| {
                if tag.owner == owner {
                    Some(tag.clone())
                } else {
                    None
                }
            })
            .collect()
    })
}
