use std::cell::RefCell;
use ic_stable_structures::{DefaultMemoryImpl, StableBTreeMap};
use ic_stable_structures::memory_manager::{MemoryId, MemoryManager};
use crate::auth::is_authenticated;
use crate::memory_ids::MemoryKeys;
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
        let id_int = u128::from_str_radix(&tag_id, 16).expect("Id conversion error");
        map.borrow_mut().insert(
            tag_id,
            Frame {
                id: id_int,
                nft: None,
            }
        );
    });
}

#[ic_cdk::update]
async fn set_nft_on_frame(tag_id: String, nft: NFT) -> Result<String, Error> {
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
async fn clean_frame(tag_id: String) -> Result<String, Error> {
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
