export const idlFactory = ({ IDL }) => {
  const ErrorReason = IDL.Record({ 'msg' : IDL.Text });
  const Error = IDL.Variant({
    'NotFound' : ErrorReason,
    'PermissionDenied' : ErrorReason,
    'Validation' : ErrorReason,
  });
  const UpdateResult = IDL.Variant({ 'Ok' : IDL.Text, 'Err' : Error });
  const Tag = IDL.Record({
    'id' : IDL.Text,
    'owner' : IDL.Text,
    'is_certificate' : IDL.Bool,
    'short_id' : IDL.Text,
  });
  const Attribute = IDL.Record({ 'trait_type' : IDL.Text, 'value' : IDL.Text });
  const NFTMetadata = IDL.Record({
    'name' : IDL.Text,
    'description' : IDL.Text,
    'attributes' : IDL.Vec(Attribute),
    'image' : IDL.Text,
  });
  const Certificate = IDL.Record({
    'id' : IDL.Text,
    'metadata' : IDL.Opt(NFTMetadata),
    'author' : IDL.Text,
    'short_id' : IDL.Text,
    'registered' : IDL.Bool,
  });
  const GetCertificateResult = IDL.Variant({
    'Ok' : Certificate,
    'Err' : Error,
  });
  const GetCertificatesResult = IDL.Variant({
    'Ok' : IDL.Vec(Certificate),
    'Err' : Error,
  });
  const NFT = IDL.Record({
    'id' : IDL.Text,
    'chain' : IDL.Text,
    'contract_address' : IDL.Text,
  });
  const Lending = IDL.Record({
    'expire_timestamp' : IDL.Nat,
    'to_address' : IDL.Text,
  });
  const Frame = IDL.Record({
    'id' : IDL.Text,
    'nft' : IDL.Opt(NFT),
    'lending' : IDL.Opt(Lending),
  });
  const FrameResult = IDL.Variant({ 'Ok' : Frame, 'Err' : Error });
  const GetFramesResult = IDL.Variant({ 'Ok' : IDL.Vec(Frame), 'Err' : Error });
  const LastStorageResult = IDL.Variant({
    'Ok' : IDL.Principal,
    'Err' : Error,
  });
  const GetStorageResult = IDL.Variant({ 'Ok' : IDL.Principal, 'Err' : Error });
  const GetTagResult = IDL.Variant({ 'Ok' : Tag, 'Err' : Error });
  const GetTagsResult = IDL.Variant({ 'Ok' : IDL.Vec(Tag), 'Err' : Error });
  const StoreArg = IDL.Record({
    'key' : IDL.Text,
    'content' : IDL.Vec(IDL.Nat8),
    'sha256' : IDL.Opt(IDL.Vec(IDL.Nat8)),
    'content_type' : IDL.Text,
    'content_encoding' : IDL.Text,
  });
  const VerifyResult = IDL.Variant({
    'Ok' : IDL.Variant({ 'Frame' : Frame, 'Certificate' : Certificate }),
    'Err' : Error,
  });
  return IDL.Service({
    'add_storage_canister' : IDL.Func([IDL.Principal], [UpdateResult], []),
    'add_tag' : IDL.Func([IDL.Text, Tag], [UpdateResult], []),
    'clean_frame' : IDL.Func([IDL.Text], [UpdateResult], []),
    'get_certificate' : IDL.Func([IDL.Text], [GetCertificateResult], ['query']),
    'get_certificates' : IDL.Func([], [GetCertificatesResult], []),
    'get_frame' : IDL.Func([IDL.Text], [FrameResult], ['query']),
    'get_frames' : IDL.Func([], [GetFramesResult], []),
    'get_last_storage_principal' : IDL.Func([], [LastStorageResult], ['query']),
    'get_storage_principal' : IDL.Func(
        [IDL.Text],
        [GetStorageResult],
        ['query'],
      ),
    'get_tag' : IDL.Func([IDL.Text], [GetTagResult], []),
    'get_tags' : IDL.Func([], [GetTagsResult], ['query']),
    'is_admin' : IDL.Func([IDL.Principal], [IDL.Bool], ['query']),
    'lend_frame' : IDL.Func([IDL.Text, IDL.Text, IDL.Nat], [UpdateResult], []),
    'register_certificate' : IDL.Func([IDL.Text], [UpdateResult], []),
    'save_certificate' : IDL.Func([IDL.Text, NFTMetadata], [UpdateResult], []),
    'set_key' : IDL.Func([IDL.Text, IDL.Text], [UpdateResult], []),
    'set_nft_on_frame' : IDL.Func([IDL.Text, NFT], [UpdateResult], []),
    'transfer_frame' : IDL.Func([IDL.Text, IDL.Text], [UpdateResult], []),
    'upload_media' : IDL.Func([IDL.Text, StoreArg], [UpdateResult], []),
    'verify_tag' : IDL.Func([IDL.Text], [VerifyResult], []),
  });
};
export const init = ({ IDL }) => { return []; };
