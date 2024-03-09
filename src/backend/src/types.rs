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

#[derive(CandidType, Clone)]
pub enum CollectionResult {
    Metadata(Metadata),
    Tag(Tag),
}

//todo: Add type for collections with permissions

#[derive(candid::CandidType, Deserialize, Serialize)]
pub enum Error {
    DataNotFound { msg: String },
    CollectionNotFound {msg: String}
}