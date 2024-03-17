use std::cell::RefCell;
use std::collections::HashMap;
use crate::types::Error;

thread_local! {
    static KEYS: RefCell<HashMap<String, String>> = RefCell::new(
        HashMap::new()
    );
}

pub fn get_key(key: String) -> Result<String, Error> {
    KEYS.with(|map| {
        match map.borrow().get(&key) {
            Some(key) => Ok(key.copy()),
            None => Err(Error::KeyNotFound {
                msg: format!("Key {} not found", key)
            })
        }
    })
}

#[ic_cdk::update]
fn set_key(key: String, value: String) -> Result<(), Error> {
    return if true {
        KEYS.with(|map| {
            map.borrow().insert(key, value);
            Ok(())
        })
    } else {
        Err(Error::PermissionDenied {
            msg: "You have not the permission to make changes".to_string()
        })
    }
}