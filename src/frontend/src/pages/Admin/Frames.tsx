import React, { useEffect, useState } from 'react';
import { TagExpanded } from '../../utils/types';
import { GetTagsResult } from '../../declarations/backend/backend.did';
import Button from '../../components/Button/Button';
import Table from '../../components/Table/Table';
import { useBackendActor } from '../../contexts/BackendActorContext';

const Frames = (props: { tagsSub: string; openModal: () => void }) => {
  const { tagsSub, openModal } = props;
  const [tags, setTags] = useState([] as TagExpanded[]);
  const { backendActor } = useBackendActor();

  useEffect(() => {
    if (backendActor) {
      backendActor.get_tags().then((res) => {
        const typedRes = res as GetTagsResult;
        if ('Ok' in typedRes) {
          setTags(typedRes.Ok.filter((tag) => !tag.is_certificate));
        }
      });
    }
  }, [tagsSub, backendActor]);

  return (
    <div className={'mt-3'}>
      <Button onClick={openModal}>Register new tag</Button>
      <Table headers={['#', 'Id', 'Owner']}>
        {tags.map((tag) => {
          return (
            <tr key={tag.id}>
              <td>{tag.short_id}</td>
              <td>{tag.id}</td>
              <td>{tag.owner}</td>
            </tr>
          );
        })}
      </Table>
    </div>
  );
};

export default Frames;
