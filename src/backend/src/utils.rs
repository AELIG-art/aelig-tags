use std::str::FromStr;
use ethers_core::types::{Address, RecoveryMessage, Signature};
use crate::types::{NFTMetadata, SignMessage};

pub fn is_valid_signature(
    id: String,
    metadata: NFTMetadata,
    author: String,
    user_signature: String
) -> bool {
    let signature_message = SignMessage {
        name: metadata.name,
        description: metadata.description,
        image: metadata.image,
        attributes: metadata.attributes,
        id
    };

    match serde_json::to_string(&signature_message) {
        Ok(message) => {
            Signature::from_str(&user_signature)
                .unwrap()
                .verify(
                    RecoveryMessage::Data(message.into_bytes()),
                    Address::from_str(&author).unwrap(),
                )
                .is_ok()
        },
        Err(_) => false,
    }
}