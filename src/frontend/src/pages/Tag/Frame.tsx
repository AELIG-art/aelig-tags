import { useEffect, useState } from 'react';
import { useBackendActor } from '../../contexts/BackendActorContext';
import { useNavigate } from 'react-router-dom';
import {
  GetTagResult,
  FrameResult,
  NFT,
} from '../../declarations/backend/backend.did';
import Loading from './Loading';
import { nftToMarketplaceUrl } from '../../utils/transformations';

type Props = {
  tagId: string;
};

const Frame = ({ tagId }: Props) => {
  const { backendActor } = useBackendActor();
  const navigate = useNavigate();

  const [nft, setNft] = useState<NFT>();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (backendActor) {
      backendActor.get_tag(tagId).then((tagRes) => {
        const tagResTyped = tagRes as GetTagResult;
        if ('Ok' in tagResTyped) {
          backendActor.get_frame(tagId).then((frameRes) => {
            const frameResTyped = frameRes as FrameResult;
            if ('Ok' in frameResTyped) {
              setIsLoading(false);
              if (frameResTyped.Ok.nft.length === 1) {
                const nft = frameResTyped.Ok.nft[0];
                setNft(nft);
              }
            } else {
              navigate('/#frames');
            }
          });
        } else {
          navigate('/#frames');
        }
      });
    }
  }, [backendActor, navigate, tagId]);

  return !isLoading ? (
    <div>
      {nft ? (
        <div>
          <a href={nftToMarketplaceUrl(nft)} className="text-center">
            Check the NFT on OpenSea
          </a>
        </div>
      ) : (
        <div>
          <p className="text-center">No NFT associated with this Frame.</p>
        </div>
      )}
    </div>
  ) : (
    <Loading />
  );
};

export default Frame;
