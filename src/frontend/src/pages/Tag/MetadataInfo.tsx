import React, { useMemo } from 'react';
import './styles.Tag.css';
import { TagExpanded } from '../../utils/types';
import { getScanUrl } from '../../utils/evm';

const MetadataInfo = (props: { tag: TagExpanded | undefined }) => {
  const { tag } = props;
  const nftDetails = tag?.nftDetails;
  const metadata = tag?.metadata;
  const isNft = useMemo(() => nftDetails, [nftDetails]);

  const scanUri = useMemo(() => getScanUrl(nftDetails), [nftDetails]);

  return (
    <div>
      <h4>Name</h4>
      <p>{metadata?.name}</p>
      <h4>Description</h4>
      <p className="description">{metadata?.description}</p>
      {isNft && (
        <div>
          <h4>NFT</h4>
          <a href={scanUri} target="_blank" rel="noreferrer">
            {nftDetails!.chain}:{nftDetails!.address}:{nftDetails!.id}
          </a>
        </div>
      )}
    </div>
  );
};

export default MetadataInfo;
