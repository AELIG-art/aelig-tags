use std::cell::RefCell;
use ic_cdk::{trap};
use ic_stable_structures::{DefaultMemoryImpl, StableBTreeMap};
use ic_stable_structures::memory_manager::{MemoryId, MemoryManager};
use crate::auth::is_authenticated;
use crate::ic_siwe_provider::get_caller_address;
use crate::memory_ids::MemoryKeys;
use crate::tags::get_tags;
use crate::types::{Error, Frame, Memory, NFT};

thread_local! {
    static MEMORY_MANAGER: RefCell<MemoryManager<DefaultMemoryImpl>> =
        RefCell::new(MemoryManager::init(DefaultMemoryImpl::default()));

    static FRAMES: RefCell<StableBTreeMap<String, Frame, Memory>> = RefCell::new(
        StableBTreeMap::init(
            MEMORY_MANAGER.with(|m| m.borrow().get(
                MemoryId::new(MemoryKeys::Frames as u8))
            ),
        )
    );
}

#[ic_cdk::query]
pub fn get_frame(tag_id: String) -> Result<Frame, Error> {
    FRAMES.with(|map| {
        match map.borrow().get(&tag_id) {
            Some(frame) => Ok(frame.clone()),
            None => Err(Error::NotFound {
                msg: format!("Frame with id {} does not exist", tag_id)
            }),
        }
    })
}

pub fn add_frame(tag_id: String) {
    FRAMES.with(|map| {
        map.borrow_mut().insert(
            tag_id.clone(),
            Frame {
                id: tag_id,
                nft: None,
            }
        );
    });
}

#[ic_cdk::update]
pub async fn set_nft_on_frame(tag_id: String, nft: NFT) -> Result<String, Error> {
    if !is_authenticated(tag_id.clone()).await {
        return Err(Error::PermissionDenied {
            msg: "Caller is not the owner of frame".to_string(),
        });
    }

    FRAMES.with(|map| {
        let frame_opt = map.borrow().get(&tag_id);
        match frame_opt {
            Some(frame) => {
                map.borrow_mut().insert(
                    tag_id,
                    Frame {
                        id: frame.id,
                        nft: Some(nft),
                    },
                );
                Ok("NFT set on the frame".to_string())
            },
            None => Err(Error::NotFound {
                msg: "Frame not found".to_string(),
            }),
        }
    })
}

#[ic_cdk::update]
pub async fn clean_frame(tag_id: String) -> Result<String, Error> {
    if !is_authenticated(tag_id.clone()).await {
        return Err(Error::PermissionDenied {
            msg: "Caller is not the owner of frame".to_string(),
        });
    }

    FRAMES.with(|map| {
        let frame_opt = map.borrow().get(&tag_id);
        match frame_opt {
            Some(frame) => {
                map.borrow_mut().insert(
                    tag_id,
                    Frame {
                        id: frame.id,
                        nft: None,
                    },
                );
                Ok("Frame cleaned".to_string())
            },
            None => Err(Error::NotFound {
                msg: "Frame not found".to_string(),
            }),
        }
    })
}

#[ic_cdk::query]
pub async fn get_frames() -> Result<Vec<Frame>, Error> {
    match get_caller_address().await {
        Ok(address) => {
            Ok(get_tags().iter().filter(|tag| {
                tag.owner == address
            }).map(|tag| {
                FRAMES.with(|map| {
                    match map.borrow().get(&tag.id) {
                        Some(frame) => frame,
                        None => trap("Frame does not exist")
                    }
                })
            }).collect())
        },
        Err(e) => Err(e)
    }
}