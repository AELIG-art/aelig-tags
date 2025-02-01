import React from 'react';
import { Link } from 'react-router-dom';
import { useTags } from '../../contexts/TagsContext';
import './styles.CertificatesList.css';
import Table from '../../components/Table/Table';
import { Certificate } from '../../declarations/backend/backend.did';

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
                  {(() => {
                    if (certificate.registered) {
                      return 'OPEN';
                    } else if (certificate.metadata.length > 0) {
                      return 'REGISTER';
                    } else {
                      return 'UPDATE';
                    }
                  })()}
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
