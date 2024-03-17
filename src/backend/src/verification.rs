use std::cell::RefCell;
use std::collections::HashMap;
use aes::Aes128;
use aes::cipher::{
    BlockDecrypt, KeyInit,
    generic_array::GenericArray,
};
use hex::{decode, encode};
use crate::certificates::get_certificate;
use crate::frames::get_frame;
use crate::keys::get_key;
use crate::tags::get_tag;
use crate::types::{Error, VerificationResult};


thread_local! {
    static TAG_COUNTERS: RefCell<HashMap<String, u128>> = RefCell::new(
        HashMap::new()
    );
}

#[ic_cdk::query]
fn verify_tag(msg: String) -> Result<VerificationResult, Error> {
    let key = match get_key("TAG_KEY".to_string()) {
        Ok(key) => key,
        Err(e) => return Err(e)
    };
    let key_bytes = match decode(key) {
        Ok(decoded) => decoded,
        Err(_) => return Err(Error::InvalidTag {
            msg: "Key error".to_string()
        })
    };
    let key = GenericArray::from_slice(&key_bytes);

    let block_bytes = match decode(msg) {
        Ok(decoded) => decoded,
        Err(_) => return Err(Error::InvalidTag {
            msg: "Error in decoding input message".to_string()
        })
    };
    let mut block = GenericArray::clone_from_slice(&block_bytes);

    let cipher = Aes128::new(&key);
    cipher.decrypt_block(&mut block);
    let decrypted_hex = block.as_slice();

    let check = encode(&decrypted_hex[0..1]);
    let tag_id = encode(&decrypted_hex[1..8]);
    let mut counter_vec = decrypted_hex[8..11].to_vec();
    counter_vec.reverse();
    let counter = match u128::from_str_radix(
        &encode(counter_vec),
        16
    ) {
        Ok(num) => num,
        Err(_) => return Err(Error::InvalidTag {
            msg: "Counter not valid".to_string()
        }),
    };

    if check != "c7" {
        return Err(Error::InvalidTag {
            msg: "Check value failed".to_string()
        });
    }

    let is_valid_counter = TAG_COUNTERS.with(|map| {
        let mut map_mut = map.borrow_mut();
        match map_mut.get(&tag_id) {
            Some(c) => {
                if c.clone() < counter {
                    map_mut.insert(tag_id.clone(), counter);
                    true
                } else {
                    false
                }
            },
            None => {
                map_mut.insert(tag_id.clone(), 0);
                true
            }
        }
    });

    if !is_valid_counter {
        return Err(Error::InvalidTag {
            msg: "Counter expired".to_string()
        });
    }

    match get_tag(tag_id.clone()) {
        Ok(tag) => {
            if tag.is_certificate {
                match get_certificate(tag_id) {
                    Ok(certificate) => Ok(VerificationResult::Certificate(certificate)),
                    Err(e) => Err(e)
                }
            } else {
                match get_frame(tag_id) {
                    Ok(frame) => Ok(VerificationResult::Frame(frame)),
                    Err(e) => Err(e)
                }
            }
        },
        Err(e) => Err(e)
    }
}
