use std::cell::RefCell;
use std::collections::HashMap;
use crate::types::{Error, Tag};

thread_local! {
    static TAGS: RefCell<HashMap<String, Tag>> = RefCell::new(
        HashMap::new()
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
fn get_tags_owned_by(owner: String) ->Vec<Tag> {
    TAGS.with(|tags| {
        tags.borrow()
            .values()
            .filter(|tag| tag.owner == owner)
            .cloned()
            .collect()
    })
}