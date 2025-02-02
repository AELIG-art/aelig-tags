import React, { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { TagExpanded } from '../../utils/types';
import './styles.Tag.css';
import { GetTagResult } from '../../declarations/backend/backend.did';
import Certificate from './Certificate';
import Frame from './Frame';
import { backend } from '../../declarations/backend';
import { useSiweIdentity } from 'ic-use-siwe-identity';

type ContentProps = {
  isCertificate: boolean;
  id: string;
};

const Content = ({ isCertificate, id }: ContentProps) =>
  isCertificate ? <Certificate tagId={id!} /> : <Frame tagId={id!} />;

const Tag = () => {
  let { id } = useParams();
  const navigate = useNavigate();
  const { identityAddress } = useSiweIdentity();
  const [isLoading, setIsLoading] = useState(true);

  const [tag, setTag] = useState<undefined | TagExpanded>();
  const [isCertificate, setIsCertificate] = useState(false);

  useEffect(() => {
    if (id) {
      backend.get_tag(id).then((tagRes) => {
        const tagResTyped = tagRes as GetTagResult;
        if ('Ok' in tagResTyped) {
          setIsCertificate(tagResTyped.Ok.is_certificate);
          setTag(tagResTyped.Ok);
          setIsLoading(false);
        } else {
          // todo: show tag does not exist error
        }
      });
    }
  }, [id, navigate]);

  return (
    <div className={'pb-3'}>
      <h1 className="mt-5">{tag?.short_id || tag?.id}</h1>
      {Boolean(identityAddress) && (
        <Link to={isCertificate ? '/' : '/#frames'} className="back">
          Tags list
        </Link>
      )}
      {!isLoading && <Content isCertificate={isCertificate} id={id!} />}
    </div>
  );
};

export default Tag;
