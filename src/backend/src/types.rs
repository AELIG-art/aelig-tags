use std::borrow::Cow;
use candid::{CandidType, Decode, Deserialize, Encode};
use ic_stable_structures::{DefaultMemoryImpl, Storable};
use ic_stable_structures::memory_manager::VirtualMemory;
use ic_stable_structures::storable::Bound;
use serde::Serialize;

const MAX_VALUE_SIZE: u32 = 1000;

#[derive(CandidType, Deserialize, Clone)]
pub struct NFTMetadata {
    pub(crate) name: String,
    pub(crate) description: String,
    pub(crate) image: String,
    pub(crate) attributes: Vec<Attribute>
}

#[derive(CandidType, Deserialize, Clone, Serialize)]
pub struct Attribute {
    trait_type: String,
    value: String
}

#[derive(CandidType, Deserialize, Clone)]
pub struct Tag {
    pub(crate) id: String,
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
    pub(crate) id: String,
    pub(crate) registered: bool,
    pub(crate) metadata: Option<NFTMetadata>,
    pub(crate) author: String,
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
pub struct NFT {
    id: String,
    contract_address: String,
    chain: String,
}

#[derive(CandidType, Deserialize, Clone)]
pub struct Frame {
    pub(crate) id: String,
    pub(crate) nft: Option<NFT>
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

#[derive(Serialize)]
pub struct SignMessage {
    pub(crate) name: String,
    pub(crate) description: String,
    pub(crate) image: String,
    pub(crate) attributes: Vec<Attribute>,
    pub(crate) id: String
}