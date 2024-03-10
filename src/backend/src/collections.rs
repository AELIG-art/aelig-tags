use std::cell::RefCell;
use std::collections::HashMap;
use ic_cdk::init;
use crate::types::{AllowedCollection, Collection, CollectionPermissions, CollectionResult, Error};
use crate::types::CollectionPermissions::{Read};

const ALLOWED_COLLECTIONS: [AllowedCollection; 2] = [
    AllowedCollection {
        name: "metadata",
        permission: CollectionPermissions::Read
    },
    AllowedCollection {
        name: "tags",
        permission: CollectionPermissions::Read
    }
];

thread_local! {
    static COLLECTIONS: RefCell<HashMap<String, Collection>> = RefCell::new(
        HashMap::new()
    );
}

#[init]
fn init() {
    for collection in ALLOWED_COLLECTIONS {
        COLLECTIONS.with(|map| {
            map.borrow_mut().insert(
                collection.name.to_string(),
                Collection {
                    map: HashMap::new(),
                    permission: collection.permission
                }
            );
        });
    }
}

#[ic_cdk::query]
fn get_collection(collection_name: String, key: String) -> Result<CollectionResult, Error> {
    COLLECTIONS.with(|map| {
        match map.borrow().get(&collection_name) {
            Some(collection) => {
                if collection.permission == Read {
                    match collection.map.get(&key) {
                        Some(data) => Ok(data.clone()),
                        None => Err(Error::DataNotFound {
                            msg: format!("Can't find data with key {}.", key)
                        })
                    }
                } else {
                    Err(Error::PermissionDenied {
                        msg: format!(
                            "You do not have the right to read this collection {}.",
                            collection_name
                        )
                    })
                }
            },
            None => Err(Error::CollectionNotFound {
                msg: format!("Can't find collection with name {}.", collection_name)
            })
        }
    })
}
