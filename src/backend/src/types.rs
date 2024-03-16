use candid::{CandidType, Deserialize, Principal};
use serde::Serialize;

#[derive(CandidType, Deserialize, Clone)]
pub struct TagMetadata {
    author: String,
    signature: String,
    owner: Principal,
    nft: NFTMetadata
}

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

#[derive(CandidType, Deserialize, Clone)]
pub struct Certificate {
    id: u128,
    pub(crate) registered: bool,
    metadata: NFTMetadata
}

#[derive(CandidType, Clone, Deserialize)]
pub enum CollectionResult {
    TagMetadata(TagMetadata),
    Tag(Tag),
}

#[derive(CandidType, Deserialize, Clone)]
struct NFT {
    id: String,
    contract_address: String,
    chain: String,
}

#[derive(CandidType, Deserialize, Clone)]
pub struct Frame {
    owner: String,
    nft_metadata: NFTMetadata,
    nft: NFT
}

#[derive(CandidType)]
pub enum VerificationResult {
    Certificate(Certificate),
    Frame(Frame),
}

#[derive(candid::CandidType, Deserialize, Serialize)]
pub enum Error {
    InvalidTag,
    TagNotFound,
    CertificateNotFound,
    FrameNotFound
}