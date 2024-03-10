use std::collections::HashMap;
use candid::{CandidType, Deserialize};
use serde::Serialize;

#[derive(CandidType, Deserialize, Clone)]
pub struct Metadata {
    name: String,
    description: String,
    image: String,
    attributes: Vec<Attribute>,
    author: String,
    signature: String
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
    metadata: Option<String>
}

#[derive(CandidType, Clone, Deserialize)]
pub enum CollectionResult {
    Metadata(Metadata),
    Tag(Tag),
}

#[derive(CandidType, Deserialize, Clone, Eq, PartialEq)]
pub enum CollectionPermissions {
    Read,
    Write,
    None
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