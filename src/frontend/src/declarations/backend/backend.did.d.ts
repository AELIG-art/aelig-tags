import type { Principal } from '@dfinity/principal';
import type { ActorMethod } from '@dfinity/agent';
import type { IDL } from '@dfinity/candid';

export interface Attribute { 'trait_type' : string, 'value' : string }
export interface Certificate {
  'id' : bigint,
  'owner' : string,
  'metadata' : [] | [NFTMetadata],
  'author' : string,
  'registered' : boolean,
}
export type Error = { 'NotFound' : ErrorReason } |
  { 'PermissionDenied' : ErrorReason } |
  { 'Validation' : ErrorReason };
export interface ErrorReason { 'msg' : string }
export interface Frame { 'id' : bigint, 'nft' : [] | [NFT] }
export type FrameResult = { 'Ok' : Frame } |
  { 'Err' : Error };
export type GetCertificateResult = { 'Ok' : Certificate } |
  { 'Err' : Error };
export type GetStorageResult = { 'Ok' : Principal } |
  { 'Err' : Error };
export type GetTagResult = { 'Ok' : Tag } |
  { 'Err' : Error };
export interface NFT {
  'id' : string,
  'chain' : string,
  'contract_address' : string,
}
export interface NFTMetadata {
  'name' : string,
  'description' : string,
  'attributes' : Array<Attribute>,
  'image' : string,
}
export interface StoreArg {
  'key' : string,
  'content' : Uint8Array | number[],
  'sha256' : [] | [Uint8Array | number[]],
  'content_type' : string,
  'content_encoding' : string,
}
export interface Tag {
  'id' : bigint,
  'owner' : string,
  'is_certificate' : boolean,
  'short_id' : string,
}
export type UpdateResult = { 'Ok' : string } |
  { 'Err' : Error };
export type VerifyResult = {
    'Ok' : { 'Frame' : Frame } |
      { 'Certificate' : Certificate }
  } |
  { 'Err' : Error };
export interface _SERVICE {
  'add_storage_canister' : ActorMethod<[Principal], UpdateResult>,
  'add_tag' : ActorMethod<[string, Tag], UpdateResult>,
  'clean_frame' : ActorMethod<[string], UpdateResult>,
  'get_certificate' : ActorMethod<[string], GetCertificateResult>,
  'get_frame' : ActorMethod<[string], FrameResult>,
  'get_storage_principal' : ActorMethod<[string], GetStorageResult>,
  'get_tag' : ActorMethod<[string], GetTagResult>,
  'get_tags' : ActorMethod<[], Array<Tag>>,
  'get_tags_owned_by' : ActorMethod<[string], Array<Tag>>,
  'is_admin' : ActorMethod<[Principal], boolean>,
  'register_certificate' : ActorMethod<[string], UpdateResult>,
  'save_certificate' : ActorMethod<[string, NFTMetadata], UpdateResult>,
  'set_key' : ActorMethod<[string, string], UpdateResult>,
  'set_nft_on_frame' : ActorMethod<[string, NFT], UpdateResult>,
  'upload_media' : ActorMethod<[string, StoreArg], UpdateResult>,
  'verify_tag' : ActorMethod<[string], VerifyResult>,
}
export declare const idlFactory: IDL.InterfaceFactory;
export declare const init: (args: { IDL: typeof IDL }) => IDL.Type[];
