import React, { useEffect, useState } from 'react';
import {
  Certificate,
  Frame,
  NFTMetadata,
} from '../../declarations/backend/backend.did';
import { getMetadataFromNft } from '../../utils/evm';
import { transformUrl } from '../../utils/transformations';

const Success = (props: {
  tagContent: undefined | { Frame: Frame } | { Certificate: Certificate };
}) => {
  const { tagContent } = props;
  const [isCertificate, setIsCertificate] = useState(false);
  const [metadata, setMetadata] = useState<undefined | NFTMetadata>();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (tagContent) {
      setIsCertificate('Certificate' in tagContent);
      if ('Certificate' in tagContent) {
        setMetadata(tagContent.Certificate.metadata[0]);
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
        </div>
      ) : (
        <p>The frame is empty.</p>
      )}
    </div>
  );
};

export default Success;
