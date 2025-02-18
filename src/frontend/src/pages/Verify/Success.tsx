import React, { useEffect, useMemo, useState } from 'react';
import {
  Certificate,
  Frame,
  NFTDetails,
  NFTMetadata,
} from '../../declarations/backend/backend.did';
import { getMetadataFromNft, getScanUrl } from '../../utils/evm';
import { transformUrl } from '../../utils/transformations';
import Empty from './Empty';
import './styles.Success.css';

const Success = (props: {
  tagContent: undefined | { Frame: Frame } | { Certificate: Certificate };
}) => {
  const { tagContent } = props;
  const [isCertificate, setIsCertificate] = useState(false);
  const [metadata, setMetadata] = useState<undefined | NFTMetadata>();
  const [isLoading, setIsLoading] = useState(true);
  const [nftDetails, setNftDetails] = useState<NFTDetails>();
  const isNft = useMemo(() => nftDetails, [nftDetails]);
  const scanUri = useMemo(() => getScanUrl(nftDetails), [nftDetails]);
  const isDraft = useMemo(() => {
    if (!tagContent || !('Certificate' in tagContent)) {
      return false;
    }
    return !tagContent.Certificate.registered;
  }, [tagContent]);

  useEffect(() => {
    if (tagContent) {
      setIsCertificate('Certificate' in tagContent);
      if ('Certificate' in tagContent) {
        setMetadata(tagContent.Certificate.metadata[0]);
        if (tagContent.Certificate.nft_details.length > 0) {
          setNftDetails(tagContent.Certificate.nft_details[0]);
        }
        setIsLoading(false);
      } else {
        if (tagContent.Frame.nft.length === 1) {
          getMetadataFromNft(tagContent.Frame.nft[0])
            .then((res) => {
              setMetadata(res);
              setIsLoading(false);
            })
            .catch(() => {
              setMetadata(undefined);
              setIsLoading(false);
            });
        } else {
          setMetadata(undefined);
          setIsLoading(false);
        }
      }
    }
  }, [tagContent]);

  return isLoading ? (
    <p>Loading…</p>
  ) : (
    <div className="container d-flex flex-column justify-content-center text-break">
      {isDraft && <div className="banner">DRAFT</div>}
      {metadata ? (
        <div className="mt-3 mb-3">
          <div className={'row'}>
            <div className="col-sm-8 col-md-6 col-lg-4 mx-auto p-3">
              <img
                src={transformUrl(metadata?.image || '')}
                alt="artwork"
                className={'img-fluid w-100 h-100'}
              />
            </div>
          </div>
        </div>
      ) : null}
      <h2>{isCertificate ? 'Certificate' : 'Frame'}</h2>
      {metadata ? (
        <div>
          <h5>Name</h5>
          <p>{metadata?.name}</p>
          <h5>Description</h5>
          <p>{metadata?.description}</p>
          {isNft && (
            <div>
              <h4>NFT</h4>
              <a href={scanUri} target="_blank" rel="noreferrer">
                {nftDetails!.chain}:{nftDetails!.address}:{nftDetails!.id}
              </a>
            </div>
          )}
        </div>
      ) : (
        <Empty />
      )}
    </div>
  );
};

export default Success;
