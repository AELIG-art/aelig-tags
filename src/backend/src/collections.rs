use std::cell::RefCell;
use std::collections::HashMap;
use ic_cdk::init;
use crate::types::{CollectionResult, Error};

const ALLOWED_COLLECTIONS: [&str; 2] = ["metadata", "tags"];

thread_local! {
    static COLLECTIONS: RefCell<HashMap<String, HashMap<String, CollectionResult>>> = RefCell::new(
        HashMap::new()
    );
}

#[init]
fn init() {
    for collection_name in ALLOWED_COLLECTIONS {
        COLLECTIONS.with(|map| {
            map.borrow_mut().insert(collection_name.to_string(), HashMap::new());
        });
    }
}

#[ic_cdk::query]
fn get_collection(collection_name: String, key: String) -> Result<CollectionResult, Error> {
    COLLECTIONS.with(|map| {
        match map.borrow().get(&collection_name) {
            Some(collection) => {
                let data_opt = collection.get(&key);
                match data_opt {
                    Some(data) => Ok(data.clone()),
                    None => Err(Error::DataNotFound {
                        msg: format!("Can't find data with key {}.", key)
                    })
                }
            },
            None => Err(Error::CollectionNotFound {
                msg: format!("Can't find collection with name {}.", collection_name)
            })
        }
    })
}
