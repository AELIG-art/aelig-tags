import React from 'react';
import { Container, Row } from 'react-bootstrap';
import './styles.Footer.css';

const Footer = () => {
  return (
    <Container>
      <hr className="hr" />
      <p>Download the AELIG app for a better experience.</p>
      <Row>
        <div className="col-6 p-3 text-center">
          <a
            href="https://apps.apple.com/it/app/aelig/id6447082070"
            target="_blank"
          >
            App Store
          </a>
        </div>
        <div className="col-6 p-3 text-center">
          <a
            href="https://play.google.com/store/apps/details?id=art.aelig.aeligapp"
            target="_blank"
          >
            Google Play
          </a>
        </div>
      </Row>
    </Container>
  );
};

export default Footer;
