import type { Principal } from '@dfinity/principal';
import type { ActorMethod } from '@dfinity/agent';
import type { IDL } from '@dfinity/candid';

export interface Attribute { 'trait_type' : string, 'value' : string }
export interface Certificate {
  'id' : string,
  'metadata' : [] | [NFTMetadata],
  'author' : string,
  'short_id' : string,
  'registered' : boolean,
}
export type Error = { 'NotFound' : ErrorReason } |
  { 'PermissionDenied' : ErrorReason } |
  { 'Validation' : ErrorReason };
export interface ErrorReason { 'msg' : string }
export interface Frame {
  'id' : string,
  'nft' : [] | [NFT],
  'lending' : [] | [Lending],
}
export type FrameResult = { 'Ok' : Frame } |
  { 'Err' : Error };
export type GetCertificateResult = { 'Ok' : Certificate } |
  { 'Err' : Error };
export type GetCertificatesResult = { 'Ok' : Array<Certificate> } |
  { 'Err' : Error };
export type GetFramesResult = { 'Ok' : Array<Frame> } |
  { 'Err' : Error };
export type GetStorageResult = { 'Ok' : Principal } |
  { 'Err' : Error };
export type GetTagResult = { 'Ok' : Tag } |
  { 'Err' : Error };
export type GetTagsResult = { 'Ok' : Array<Tag> } |
  { 'Err' : Error };
export type LastStorageResult = { 'Ok' : Principal } |
  { 'Err' : Error };
export interface Lending { 'expire_timestamp' : bigint, 'to_address' : string }
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
  'id' : string,
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
  'get_certificates' : ActorMethod<[], GetCertificatesResult>,
  'get_frame' : ActorMethod<[string], FrameResult>,
  'get_frames' : ActorMethod<[], GetFramesResult>,
  'get_last_storage_principal' : ActorMethod<[], LastStorageResult>,
  'get_storage_principal' : ActorMethod<[string], GetStorageResult>,
  'get_tag' : ActorMethod<[string], GetTagResult>,
  'get_tags' : ActorMethod<[], GetTagsResult>,
  'is_admin' : ActorMethod<[Principal], boolean>,
  'lend_frame' : ActorMethod<[string, string, bigint], UpdateResult>,
  'register_certificate' : ActorMethod<[string], UpdateResult>,
  'save_certificate' : ActorMethod<[string, NFTMetadata], UpdateResult>,
  'set_key' : ActorMethod<[string, string], UpdateResult>,
  'set_nft_on_frame' : ActorMethod<[string, NFT], UpdateResult>,
  'transfer_frame' : ActorMethod<[string, string], UpdateResult>,
  'upload_media' : ActorMethod<[string, StoreArg], UpdateResult>,
  'verify_tag' : ActorMethod<[string], VerifyResult>,
}
export declare const idlFactory: IDL.InterfaceFactory;
export declare const init: (args: { IDL: typeof IDL }) => IDL.Type[];
