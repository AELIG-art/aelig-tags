use std::cell::RefCell;
use ic_stable_structures::{DefaultMemoryImpl, StableBTreeMap};
use ic_stable_structures::memory_manager::{MemoryId, MemoryManager};
use crate::auth::is_authenticated;
use crate::ic_siwe_provider::get_caller_address;
use crate::memory_ids::MemoryKeys;
use crate::tags::{_get_tags, update_tag_ownership};
use crate::types::{Error, Frame, Memory, NFT, FramesLending};

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

    static FRAMES_LENDING: RefCell<StableBTreeMap<String, FramesLending, Memory>> = RefCell::new(
        StableBTreeMap::init(
            MEMORY_MANAGER.with(|m| m.borrow().get(
                MemoryId::new(MemoryKeys::FramesLendings as u8)
            ))
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
async fn set_nft_on_frame(tag_id: String, nft: NFT) -> Result<String, Error> {
    validate_ownership(tag_id.clone()).await?;
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
    validate_ownership(tag_id.clone()).await?;
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

#[ic_cdk::update]
pub async fn get_frames() -> Result<Vec<Frame>, Error> {
    let address = get_caller_address().await?;
    let mut frames = Vec::new();
    for tag in _get_tags() {
        let is_lent = is_frame_lent_to_caller(tag.id.clone()).await;
        if (tag.owner == address || is_lent) && !tag.is_certificate {
            if let Some(frame) = FRAMES.with(|map| map.borrow().get(&tag.id)) {
                frames.push(frame);
            } else {
                return Err(Error::NotFound {
                    msg: format!("Frame with id {} does not exist", tag.id),
                });
            }
        }
    }
    Ok(frames)
}

#[ic_cdk::update]
async fn transfer_frame(tag_id: String, to_address: String) -> Result<String, Error> {
    if !is_authenticated(tag_id.clone()).await {
        return Err(Error::PermissionDenied {
            msg: "Caller is not the owner of frame".to_string(),
        });
    }
    match update_tag_ownership(tag_id, to_address) {
        Ok(_) => Ok("Frame ownership updated".to_string()),
        Err(e) => Err(e)
    }
}

#[ic_cdk::query]
pub fn get_frame_lending(tag_id: String) -> Result<FramesLending, Error> {
    let msg_error = format!("No active lendings for frame with id {}", tag_id);

    FRAMES_LENDING.with(|map| {
        match map.borrow().get(&tag_id) {
            Some(lending) => {
                let current_sec = ic_cdk::api::time() / 1_000_000_000;
                if current_sec >= lending.expire_timestamp {
                    Err(Error::NotFound { msg: msg_error })
                } else {
                    Ok(lending.clone())
                }
            }
            None => {
                Err(Error::NotFound { msg: msg_error })
            }
        }
    })
}

pub fn is_frame_lent(tag_id: String) -> bool {
    FRAMES_LENDING.with(|map| {
        map.borrow().get(&tag_id).map_or(false, |_| {
            true
        })
    })
}

pub async fn is_frame_lent_to_caller(tag_id: String) -> bool {
    let caller_siwe_address_res = get_caller_address().await;
    match caller_siwe_address_res {
        Ok(address) => {
            FRAMES_LENDING.with(|map| {
                map.borrow().get(&tag_id).map_or(false, |lending| {
                    lending.to == address
                })
            })
        }
        Err(_) => false
    }
}

async fn validate_ownership(tag_id: String) -> Result<(), Error> {
    if !is_authenticated(tag_id.clone()).await && !is_frame_lent_to_caller(tag_id.clone()).await {
        return Err(Error::PermissionDenied {
            msg: "Caller is not the owner of the frame".to_string(),
        });
    }
    Ok(())
}

#[ic_cdk::update]
async fn lend_frame(
    tag_id: String,
    to_address: String,
    expire_timestamp: u64,
) -> Result<String, Error> {
    if !is_authenticated(tag_id.clone()).await {
        return Err(Error::PermissionDenied {
            msg: "Caller is not the owner of the frame".to_string(),
        });
    }
    if is_frame_lent(tag_id.clone()) {
        return Err(Error::PermissionDenied {
            msg: "Frame is already lent".to_string(),
        });
    }
    FRAMES_LENDING.with(|map| {
        map.borrow_mut().insert(
            tag_id,
            FramesLending {
                to: to_address,
                expire_timestamp,
            },
        );
    });
    Ok("Tag ownership updated".to_string())
}
