use std::borrow::Cow;
use candid::{CandidType, Decode, Deserialize, Encode};
use ic_stable_structures::{DefaultMemoryImpl, Storable};
use ic_stable_structures::memory_manager::VirtualMemory;
use ic_stable_structures::storable::Bound;
use serde::Serialize;

const MAX_VALUE_SIZE: u32 = 1000;

#[derive(CandidType, Deserialize, Clone)]
pub struct NFTMetadata {
    name: String,
    description: String,
    image: String,
    attributes: Vec<Attribute>
}

#[derive(CandidType, Deserialize, Clone)]
struct Attribute {
    trait_type: String,
    value: String
}

#[derive(CandidType, Deserialize, Clone)]
pub struct Tag {
    id: u128,
    short_id: String,
    pub(crate) is_certificate: bool,
    pub(crate) owner: String,
}

impl Storable for Tag {
    fn to_bytes(&self) -> std::borrow::Cow<[u8]> {
        Cow::Owned(Encode!(self).unwrap())
    }

    fn from_bytes(bytes: std::borrow::Cow<[u8]>) -> Self {
        Decode!(bytes.as_ref(), Self).unwrap()
    }

    const BOUND: Bound = Bound::Bounded {
        max_size: MAX_VALUE_SIZE,
        is_fixed_size: false,
    };
}

#[derive(CandidType, Deserialize, Clone)]
pub struct Certificate {
    id: u128,
    pub(crate) registered: bool,
    metadata: NFTMetadata,
    signature: String,
    owner: String,
}

impl Storable for Certificate {
    fn to_bytes(&self) -> std::borrow::Cow<[u8]> {
        Cow::Owned(Encode!(self).unwrap())
    }

    fn from_bytes(bytes: std::borrow::Cow<[u8]>) -> Self {
        Decode!(bytes.as_ref(), Self).unwrap()
    }

    const BOUND: Bound = Bound::Bounded {
        max_size: MAX_VALUE_SIZE,
        is_fixed_size: false,
    };
}

#[derive(CandidType, Deserialize, Clone)]
struct NFT {
    id: String,
    contract_address: String,
    chain: String,
}

#[derive(CandidType, Deserialize, Clone)]
pub struct Frame {
    id: u128,
    nft: Option<NFT>
}

impl Storable for Frame {
    fn to_bytes(&self) -> std::borrow::Cow<[u8]> {
        Cow::Owned(Encode!(self).unwrap())
    }

    fn from_bytes(bytes: std::borrow::Cow<[u8]>) -> Self {
        Decode!(bytes.as_ref(), Self).unwrap()
    }

    const BOUND: Bound = Bound::Bounded {
        max_size: MAX_VALUE_SIZE,
        is_fixed_size: false,
    };
}

#[derive(CandidType)]
pub enum VerificationResult {
    Certificate(Certificate),
    Frame(Frame),
}


#[derive(candid::CandidType, Deserialize, Serialize)]
pub enum Error {
    NotFound { msg: String },
    PermissionDenied { msg: String },
    Validation { msg: String },
    ServerError { msg: String },
}

pub type Memory = VirtualMemory<DefaultMemoryImpl>;