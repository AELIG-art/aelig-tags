import React from 'react';
import { Link } from 'react-router-dom';
import { useTags } from '../../contexts/TagsContext';
import './styles.CertificatesList.css';
import Table from '../../components/Table/Table';
import { Certificate } from '../../declarations/backend/backend.did';

/*
    DRAFT -> User inserted metadata, but the tag is not registered (meaning that metadata can be still updated)
    REGISTERED ->  The metadata is inserted and immutable
    EMPTY -> No metadata is inserted
 */
enum CertificateStatus {
  DRAFT = 'Draft',
  REGISTERED = 'Registered',
  EMPTY = 'Empty',
}

const getCertificateStatus = (certificate: Certificate) => {
  if (certificate.metadata.length === 0) {
    return CertificateStatus.EMPTY;
  }
  if (!certificate.registered) {
    return CertificateStatus.DRAFT;
  }
  return CertificateStatus.REGISTERED;
};

const CertificatesList = () => {
  const { certificates } = useTags();

  return (
    <div>
      <h1 className={'mt-5'}>Your Certificates</h1>
      <Table headers={['#', 'Id', 'Status', 'Is NFT', 'Action']}>
        {certificates.map((certificate: Certificate, index: number) => {
          return (
            <tr key={index}>
              <td>{certificate.short_id}</td>
              <td>{certificate.id}</td>
              <td>{getCertificateStatus(certificate)}</td>
              <td>{certificate.nft_details.length > 0 ? 'Yes' : 'No'}</td>
              <td>
                <Link to={`/tag/${certificate.id}`} className="link">
                  {certificate.registered ? 'DETAILS' : 'MANAGE'}
                </Link>
              </td>
            </tr>
          );
        })}
      </Table>
    </div>
  );
};

export default CertificatesList;
