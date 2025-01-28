import { Col, Container, Row } from 'react-bootstrap';
import Image from 'next/image';

/** The Footer appears at the bottom of every page. Rendered by the App Layout component. */
const Footer = () => (
  <footer className="mt-auto py-3 footer">
    <Container>
      <Row>
        {/* TODO: Update this to have links to contact info, social media, disclaimer, and support sections. */}
        <Col className="text-center g-3">
          Contact Us
          <br />
          <a href="https://www.spirehawaii.com/">Visit Spire LLP</a>
        </Col>
        <Col className="text-center g-3">
          <Row className="justify-content-center align-items-center">
            <Col xs="auto">
              <Image
                src="/x.png"
                alt="X"
                width={50}
                height={50}
                style={{ objectFit: 'contain' }}
              />
            </Col>
            <Col xs="auto">
              <Image
                src="/linkedin.png"
                alt="LinkedIn"
                width={50}
                height={50}
                style={{ objectFit: 'contain' }}
              />
            </Col>
          </Row>
          <br />
          @ Spire Hawaii LLP 2025
        </Col>
        <Col className="text-center g-3">
          Disclaimer
          <br />
          Report A Problem
        </Col>
      </Row>
    </Container>
  </footer>
);

export default Footer;
