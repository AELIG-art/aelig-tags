use std::collections::HashMap;
use candid::{CandidType, Deserialize, Principal};
use serde::Serialize;

#[derive(CandidType, Deserialize, Clone)]
pub struct Metadata {
    name: String,
    description: String,
    image: String,
    attributes: Vec<Attribute>,
    author: String,
    signature: String,
    owner: Principal
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
    registered: bool,
    is_certificate: bool,
    owner: Principal
}

#[derive(CandidType, Deserialize)]
pub struct Certificate {
    id: u128,
    metadata: Option<Metadata>
}

#[derive(CandidType, Clone, Deserialize)]
pub enum CollectionResult {
    Metadata(Metadata),
    Tag(Tag),
}

#[derive(CandidType, Deserialize, Clone, Eq, PartialEq)]
pub enum CollectionPermissions {
    Read, // everybody can read, canister controllers can write
    Write, // everybody can write, but only the owner of the record can update or delete it
    Managed, // only record owner and canister controllers can read and write
    Controllers, // only canister controllers can read and write
}

#[derive(CandidType, Deserialize, Clone)]
pub struct Collection {
    pub(crate) permission: CollectionPermissions,
    pub(crate) map: HashMap<String, CollectionResult>
}

pub struct AllowedCollection {
    pub(crate) permission: CollectionPermissions,
    pub(crate) name: &'static str
}

#[derive(candid::CandidType, Deserialize, Serialize)]
pub enum Error {
    DataNotFound { msg: String },
    CollectionNotFound { msg: String },
    PermissionDenied { msg: String }
}