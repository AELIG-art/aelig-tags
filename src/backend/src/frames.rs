use std::cell::RefCell;
use std::collections::HashMap;
use crate::types::{Error, Frame};

thread_local! {
    static FRAMES: RefCell<HashMap<String, Frame>> = RefCell::new(
        HashMap::new()
    );
}

#[ic_cdk::query]
pub fn get_frame(tag_id: String) -> Result<Frame, Error> {
    FRAMES.with(|map| {
        match map.borrow().get(&tag_id) {
            Some(frame) => Ok(frame.clone()),
            None => Err(Error::FrameNotFound),
        }
    })
}