import { useEffect, useMemo, useState } from 'react';
import MetadataForm from './MetadataForm';
import { SupportedChain, TagExpanded } from '../../utils/types';
import MetadataInfo from './MetadataInfo';
import {
  GetCertificateResult,
  GetTagResult,
} from '../../declarations/backend/backend.did';
import { useBackendActor } from '../../contexts/BackendActorContext';
import { useNavigate } from 'react-router-dom';
import Loading from './Loading';
import { backend } from '../../declarations/backend';
import { useSiweIdentity } from 'ic-use-siwe-identity';

type Props = {
  tagId: string;
};

const Certificate = ({ tagId }: Props) => {
  const { backendActor } = useBackendActor();
  const { identityAddress } = useSiweIdentity();
  const navigate = useNavigate();

  const [tag, setTag] = useState<undefined | TagExpanded>();
  const [name, setName] = useState<undefined | string>();
  const [description, setDescription] = useState<undefined | string>();
  const [chain, setChain] = useState<undefined | SupportedChain>();
  const [address, setAddress] = useState<undefined | string>();
  const [nftId, setNftId] = useState<undefined | string>();
  const [image, setImage] = useState<undefined | string>();
  const [isLoading, setIsLoading] = useState(true);
  const [subscription, setSubscription] = useState('');
  const [certificateRegistered, setCertificateRegistered] = useState(false);

  const backendCaller = useMemo(() => backendActor || backend, [backendActor]);
  const showMustBeLoggedMessage = useMemo(
    () => !isLoading && !Boolean(identityAddress) && !certificateRegistered,
    [certificateRegistered, identityAddress, isLoading]
  );

  useEffect(() => {
    backendCaller.get_tag(tagId).then((tagRes) => {
      const tagResTyped = tagRes as GetTagResult;
      if ('Ok' in tagResTyped) {
        backendCaller.get_certificate(tagId).then((certificateRes) => {
          const certificateResTyped = certificateRes as GetCertificateResult;
          if ('Ok' in certificateResTyped) {
            setTag({
              ...tagResTyped.Ok,
              registered: certificateResTyped.Ok.registered,
              metadata:
                certificateResTyped.Ok.metadata.length > 0
                  ? certificateResTyped.Ok.metadata[0]
                  : undefined,
              nftDetails:
                certificateResTyped.Ok.nft_details.length > 0
                  ? certificateResTyped.Ok.nft_details[0]
                  : undefined,
            });
            setCertificateRegistered(certificateResTyped.Ok.registered);
            if (certificateResTyped.Ok.metadata.length > 0) {
              setName(certificateResTyped.Ok.metadata[0]!.name);
              setDescription(certificateResTyped.Ok.metadata[0]!.description);
              setImage(certificateResTyped.Ok.metadata[0]!.image);
            }
            if (certificateResTyped.Ok.nft_details.length > 0) {
              setChain(
                certificateResTyped.Ok.nft_details[0]!.chain as SupportedChain
              );
              setAddress(certificateResTyped.Ok.nft_details[0]!.address);
              setNftId(certificateResTyped.Ok.nft_details[0]!.id);
            }
            setIsLoading(false);
          } else {
            setIsLoading(false);
          }
        });
      } else {
        navigate('/');
      }
    });
  }, [backendCaller, navigate, tagId, subscription]);

  if (isLoading) {
    return <Loading />;
  }

  if (showMustBeLoggedMessage) {
    return (
      <div>
        {identityAddress ? (
          <p>You do not own this tag.</p>
        ) : (
          <p>Connect your wallet to see details.</p>
        )}
      </div>
    );
  }

  return (
    <div className="row mt-4 row mt-4 d-flex flex-column flex-md-row">
      <div className={'col'}>
        <div
          className={`d-flex w-100 h-100 ${!image ? 'border' : ''}`}
          style={{ minHeight: '200px', maxHeight: '572px' }}
        >
          {image ? (
            <img
              src={image}
              alt="Certificate"
              className={'w-100 h-100'}
              style={{
                minHeight: '200px',
                maxHeight: '572px',
                objectFit: 'contain',
              }}
            />
          ) : null}
        </div>
      </div>
      <div className={'col'}>
        {!certificateRegistered ? (
          <MetadataForm
            tag={tag}
            id={tagId}
            setCertificateRegistered={setCertificateRegistered}
            setSubscription={setSubscription}
            name={name}
            setName={setName}
            description={description}
            chain={chain}
            address={address}
            nftId={nftId}
            setDescription={setDescription}
            image={image}
            setImage={setImage}
            setChain={setChain}
            setAddress={setAddress}
            setNftId={setNftId}
          />
        ) : (
          <MetadataInfo tag={tag} />
        )}
      </div>
    </div>
  );
};

export default Certificate;
