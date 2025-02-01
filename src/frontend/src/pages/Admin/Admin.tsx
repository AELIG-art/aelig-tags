import React, { useEffect, useState } from 'react';
import TopBar from './TopBar';
import NewTagModal from './NewTagModal';
import Certificates from './Certificates';
import { backend } from '../../declarations/backend';
import { Nav } from 'react-bootstrap';
import { useLocation, useNavigate } from 'react-router-dom';
import Frames from './Frames';
import './styles.Admin.css';
import { useSiweIdentity } from 'ic-use-siwe-identity';

const Admin = () => {
  const [isAdmin, setIsAdmin] = useState(false);
  const [newTagModalOpen, setNewTagModalOpen] = useState(false);
  const [isNewTagCertificate, setIsNewTagCertificate] = useState(true);
  const [isLogged, setIsLogged] = useState(false);
  const [certificatesSub, setCertificatesSub] = useState('');
  const [framesSub, setFramesSub] = useState('');
  const location = useLocation();
  const hash = location.hash;
  const isCertificatesSection = !hash || hash === '#certificates';
  const navigate = useNavigate();
  const { identity } = useSiweIdentity();

  useEffect(() => {
    if (!hash) {
      navigate('/admin/#certificates');
    }
  }, [hash, navigate]);

  useEffect(() => {
    if (identity) {
      const principal = identity.getPrincipal();
      setIsLogged(true);
      backend.is_admin(principal).then((res) => {
        setIsAdmin(res);
      });
    } else {
      setIsLogged(false);
      setIsAdmin(false);
    }
  }, [identity]);

  return (
    <div>
      <TopBar
        isLogged={isLogged}
        principal={identity?.getPrincipal().toString()}
      />
      {isAdmin ? (
        <div>
          <Nav
            variant="underline"
            defaultActiveKey="admin/#certificates"
            className={'mt-3'}
          >
            <Nav.Item>
              <Nav.Link
                href="admin/#certificates"
                className={isCertificatesSection ? 'navActive' : 'nav'}
              >
                Certificates
              </Nav.Link>
            </Nav.Item>
            <Nav.Item>
              <Nav.Link
                href="admin/#frames"
                className={!isCertificatesSection ? 'navActive' : 'nav'}
              >
                Frames
              </Nav.Link>
            </Nav.Item>
          </Nav>
          {isCertificatesSection ? (
            <Certificates
              tagsSub={certificatesSub}
              openModal={() => {
                setIsNewTagCertificate(true);
                setNewTagModalOpen(true);
              }}
            />
          ) : (
            <Frames
              tagsSub={framesSub}
              openModal={() => {
                setIsNewTagCertificate(false);
                setNewTagModalOpen(true);
              }}
            />
          )}
        </div>
      ) : (
        <div className={'mt-5 text-center'}>
          <p>You are not an admin. Please, login with another account.</p>
        </div>
      )}
      <NewTagModal
        close={() => {
          setNewTagModalOpen(false);
          if (isCertificatesSection) {
            setCertificatesSub(new Date().toString());
          } else {
            setFramesSub(new Date().toString());
          }
        }}
        open={newTagModalOpen}
        isNewTagCertificate={isNewTagCertificate}
      />
    </div>
  );
};

export default Admin;
