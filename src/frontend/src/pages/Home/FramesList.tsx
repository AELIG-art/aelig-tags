import { useTags } from '../../contexts/TagsContext';
import React, { useState } from 'react';
import Table from '../../components/Table/Table';
import { Frame } from '../../declarations/backend/backend.did';
import { Link } from 'react-router-dom';
import { nftToOpenSeaUrl } from '../../utils/transformations';
import TransferFrameModal from './TransferFrameModal';

const CertificatesList = () => {
  const { frames, setSub } = useTags();
  const [frameId, setFrameId] = useState<string>('');
  const [modalOpen, setModalOpen] = useState(false);

  return (
    <div>
      <h1 className={'mt-5'}>Your Frames</h1>
      <Table headers={['#', 'Has NFT', 'Lent To', 'Link', 'Action']}>
        {frames.map((frame: Frame, index: number) => {
          const nft = frame.nft.length === 1 ? frame.nft[0] : undefined;
          const lending =
            frame.lending.length === 1 ? frame.lending[0] : undefined;
          return (
            <tr key={index}>
              <td>{frame.id}</td>
              <td>{nft ? 'Yes' : 'No'}</td>
              <td>{lending ? lending.to_address : '-'}</td>
              <td>
                {nft ? (
                  <Link
                    to={nftToOpenSeaUrl(nft)}
                    target="_blank"
                    className="link"
                  >
                    See on OpenSea
                  </Link>
                ) : (
                  '-'
                )}
              </td>
              <td
                className="text-decoration-underline"
                style={{ cursor: 'pointer' }}
                onClick={() => {
                  setFrameId(frame.id);
                  setModalOpen(true);
                }}
              >
                transfer
              </td>
            </tr>
          );
        })}
      </Table>
      <TransferFrameModal
        open={modalOpen}
        close={() => {
          setSub(new Date().toISOString());
          setModalOpen(false);
        }}
        frameId={frameId}
      />
    </div>
  );
};

export default CertificatesList;
