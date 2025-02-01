import React, { useEffect, useRef, useState } from 'react';
import { Form } from 'react-bootstrap';
import {
  NFTDetails,
  NFTMetadata,
  UpdateResult,
} from '../../declarations/backend/backend.did';
import { backend } from '../../declarations/backend';
import { SupportedChain, TagExpanded } from '../../utils/types';
import { useTags } from '../../contexts/TagsContext';
import Button from '../../components/Button/Button';
import { alertToast } from '../../utils/alerts';
import { useSiweIdentity } from 'ic-use-siwe-identity';
import { useBackendActor } from '../../contexts/BackendActorContext';
import { SUPPORTED_CHAINS_FOR_SELECT } from '../../utils/constants';

const MetadataForm = (props: {
  id: string | undefined;
  tag: TagExpanded | undefined;
  setSubscription: (sub: string) => void;
  setCertificateRegistered: (registered: boolean) => void;
  image: string | undefined;
  name: string | undefined;
  description: string | undefined;
  chain: SupportedChain | undefined;
  address: string | undefined;
  nftId: string | undefined;
  setName: (name: string) => void;
  setDescription: (description: string) => void;
  setImage: (image: string) => void;
  setChain: (chain: SupportedChain) => void;
  setAddress: (address: string) => void;
  setNftId: (id: string) => void;
}) => {
  const {
    id,
    setCertificateRegistered,
    tag,
    setSubscription,
    name,
    setName,
    description,
    chain,
    address,
    nftId,
    setDescription,
    image,
    setImage,
    setChain,
    setAddress,
    setNftId,
  } = props;

  const inputRef = useRef<HTMLInputElement>(null);

  const [dataUpdated, setDataUpdated] = useState(false);
  const [isLoadingButton, setIsLoadingButton] = useState(false);
  const [isDataMissing, setIsDataMissing] = useState(true);
  const [buttonText, setButtonText] = useState('');
  const [isNFT, setIsNFT] = useState(Boolean(tag?.nftDetails));
  const [buttonAction, setButtonAction] = useState(
    'save' as 'save' | 'register'
  );

  const { identityAddress, identity } = useSiweIdentity();

  const { setSub } = useTags();

  const { backendActor } = useBackendActor();

  useEffect(() => {
    const isMetadataMissing =
      !image ||
      image === '' ||
      !name ||
      name === '' ||
      !description ||
      description === '';
    if (isNFT) {
      const isNftDetailsMissing =
        !address || address === '' || !nftId || nftId === '';
      setIsDataMissing(isMetadataMissing || isNftDetailsMissing);
    } else {
      setIsDataMissing(isMetadataMissing);
    }
  }, [image, name, description, isNFT, address, nftId, chain]);

  useEffect(() => {
    if (tag) {
      if (!tag.registered) {
        setCertificateRegistered(false);
        setButtonText(
          isLoadingButton
            ? 'Updating…'
            : dataUpdated || isDataMissing
              ? 'Save'
              : 'Register'
        );
        setButtonAction(dataUpdated || isDataMissing ? 'save' : 'register');
      } else {
        setCertificateRegistered(true);
      }
    }
  }, [
    tag,
    dataUpdated,
    isLoadingButton,
    isDataMissing,
    setCertificateRegistered,
  ]);

  const uploadFile = () => {
    if (inputRef.current?.files && identity) {
      const file = inputRef.current.files[0];
      file.arrayBuffer().then((buffer) => {
        const bytes = new Uint8Array(buffer);
        if (id && backendActor) {
          backendActor
            .upload_media(id, {
              content: bytes,
              content_encoding: 'identity',
              content_type: file.type,
              key: `/${id!}`,
              sha256: [],
            })
            .then((res) => {
              const typedRes = res as UpdateResult;
              if ('Ok' in typedRes) {
                backend.get_storage_principal(id!).then((res) => {
                  if ('Ok' in res) {
                    setImage(
                      // todo: use localhost domain for local development
                      `https://${res.Ok.toString()}.icp0.io/${id!}`
                    );
                    alertToast('File updated');
                  } else {
                    alertToast(res.Err.toString(), true);
                  }
                });
              } else {
                alertToast('Server error', true);
                // todo: fix this code ->  alertToast(typedRes.Err.Err.msg, true);
              }
            })
            .catch(() => {
              alertToast('Server error', true);
            });
        } else {
          alertToast('Id not found', true);
        }
      });
    }
  };

  const formAction = () => {
    setIsLoadingButton(true);
    if (tag && id && identityAddress && backendActor) {
      if (buttonAction === 'save') {
        const metadata = {
          name: name || tag?.metadata?.name || '',
          description: description || tag?.metadata?.description || '',
          image: image || tag?.metadata?.image || '',
          attributes: [],
        } as NFTMetadata;
        const nftDetails = isNFT
          ? ([
              {
                chain: chain || tag?.nftDetails?.chain || '',
                address: address || tag?.nftDetails?.address || '',
                id: nftId || tag?.nftDetails?.id || '',
              },
            ] as NFTDetails[])
          : [];

        backendActor
          .save_certificate(id!, metadata, nftDetails)
          .then((res: unknown) => {
            const typedResult = res as UpdateResult;
            setDataUpdated(false);
            if ('Ok' in typedResult) {
              alertToast('Success');
              setSub(new Date().toISOString());
              setSubscription(new Date().toISOString());
            } else {
              alertToast(typedResult.Err.toString(), true);
            }
            setIsLoadingButton(false);
          })
          .catch(() => {
            alertToast('Server error', true);
            setIsLoadingButton(false);
          });
      } else {
        backendActor.register_certificate(id!).then((res: unknown) => {
          const typedResult = res as UpdateResult;
          if ('Ok' in typedResult) {
            alertToast('Success');
            setCertificateRegistered(true);
            setSubscription(new Date().toISOString());
            setSub(new Date().toISOString());
          } else {
            alertToast(typedResult.Err.toString(), true);
          }
          setIsLoadingButton(false);
        });
      }
    }
  };

  return (
    <div>
      <Form>
        <Form.Group className="mb-3">
          <Form.Label>Name</Form.Label>
          <Form.Control
            type="text"
            placeholder="Name"
            value={name || tag?.metadata?.name || ''}
            onChange={(event) => {
              setName(event.target.value);
              setDataUpdated(true);
            }}
            className={'rounded-0'}
          />
          <Form.Text className="text-muted">
            The name of the certificate.
          </Form.Text>
        </Form.Group>

        <Form.Group className="mb-3" controlId="formBasicPassword">
          <Form.Label>Description</Form.Label>
          <Form.Control
            type="text"
            as="textarea"
            rows={10}
            placeholder="Description"
            value={description || tag?.metadata?.description || ''}
            onChange={(event) => {
              setDescription(event.target.value);
              setDataUpdated(true);
            }}
            className={'rounded-0'}
          />
          <Form.Text className="text-muted">
            The description of the certificate.
          </Form.Text>
        </Form.Group>

        <Form.Group controlId="formFile" className="mb-3">
          <Form.Label>Image</Form.Label>
          <Form.Control
            type="file"
            ref={inputRef}
            accept="image/*,video/*"
            onChange={uploadFile}
            className={'rounded-0'}
          />
          <Form.Text className="text-muted">
            The image of the certificate.
          </Form.Text>
        </Form.Group>

        <Form.Group controlId="isNFT" className="mb-3">
          <Form.Check
            type="checkbox"
            onChange={(event) => setIsNFT(event.target.checked)}
            className="rounded-0"
            label="Is NFT"
            checked={isNFT}
          />
        </Form.Group>

        {isNFT && (
          <div>
            <Form.Group controlId="formFile" className="mb-3">
              <Form.Label>Chain</Form.Label>
              <Form.Select
                onChange={(event) => {
                  setChain(event.target.value as SupportedChain);
                  setDataUpdated(true);
                }}
                value={chain || tag?.nftDetails?.chain || ''}
                className={'rounded-0'}
              >
                <option disabled value="">
                  -- Select an option --
                </option>
                {SUPPORTED_CHAINS_FOR_SELECT.map((chain, index) => (
                  <option key={index} value={chain.value}>
                    {chain.label}
                  </option>
                ))}
              </Form.Select>
              <Form.Text className="text-muted">
                The chain in which the NFT is minted
              </Form.Text>
            </Form.Group>
            <Form.Group className="mb-3" controlId="formBasicPassword">
              <Form.Label>Address</Form.Label>
              <Form.Control
                type="text"
                placeholder="Smart contract's address"
                value={address || tag?.nftDetails?.address || ''}
                onChange={(event) => {
                  setAddress(event.target.value);
                  setDataUpdated(true);
                }}
                className={'rounded-0'}
              />
              <Form.Text className="text-muted">
                The address of the NFT's smart contract
              </Form.Text>
            </Form.Group>
            <Form.Group className="mb-3" controlId="formBasicPassword">
              <Form.Label>Id</Form.Label>
              <Form.Control
                type="text"
                placeholder="NFT's Id"
                value={nftId || tag?.nftDetails?.id || ''}
                onChange={(event) => {
                  setNftId(event.target.value);
                  setDataUpdated(true);
                }}
                className={'rounded-0'}
              />
              <Form.Text className="text-muted">The id of the NFT</Form.Text>
            </Form.Group>
          </div>
        )}
      </Form>
      <div className={'d-flex flex-row-reverse'}>
        {tag && id && identityAddress ? (
          <Button
            variant="primary"
            disabled={isLoadingButton || isDataMissing}
            onClick={formAction}
          >
            {buttonText}
          </Button>
        ) : null}
      </div>
    </div>
  );
};

export default MetadataForm;
