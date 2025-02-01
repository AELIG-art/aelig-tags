import React, { useMemo } from 'react';
import './styles.Tag.css';
import { TagExpanded } from '../../utils/types';

const MetadataInfo = (props: { tag: TagExpanded | undefined }) => {
  const { tag } = props;
  const nftDetails = tag?.nftDetails;
  const metadata = tag?.metadata;
  const isNft = useMemo(() => nftDetails, [nftDetails]);

  return (
    <div>
      <h4>Name</h4>
      <p>{metadata?.name}</p>
      <h4>Description</h4>
      <p className="description">{metadata?.description}</p>
      {isNft && (
        <div>
          <h4>Chain</h4>
          <p>{nftDetails?.chain}</p>
          <h4>Address</h4>
          <p>{nftDetails?.address}</p>
          <h4>Id</h4>
          <p>{nftDetails?.id}</p>
        </div>
      )}
    </div>
  );
};

export default MetadataInfo;
