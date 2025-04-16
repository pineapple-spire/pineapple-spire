import { Col, Container, Row } from 'react-bootstrap';
import { FaXTwitter, FaLinkedin, FaRegCopyright } from 'react-icons/fa6';
import Link from 'next/link';

/** The Footer appears at the bottom of every page. Rendered by the App Layout component. */
const Footer = () => (
  <footer className="mt-auto py-3 footer" style={{ zIndex: 2 }}>
    <Container>
      <Row>
        {/* TODO: Update this to have link to disclaimer. */}
        <Col className="text-center g-3">
          <a href="/contact" rel="noopener noreferrer">Contact Us</a>
          <br />
          <a href="https://www.spirehawaii.com/" target="_blank" rel="noopener noreferrer">Visit Spire LLP</a>
        </Col>
        <Col className="text-center g-3">
          <Row className="justify-content-center align-items-center">
            <Col xs="auto">
              <Link
                href="https://x.com/spirehawaii"
                target="_blank"
                rel="noopener noreferrer"
                style={{ textDecoration: 'none', color: 'inherit' }}
              >
                <FaXTwitter size={50} />
              </Link>
            </Col>
            <Col xs="auto">
              <Link
                href="https://www.linkedin.com/company/spire-hawaii-llp"
                target="_blank"
                rel="noopener noreferrer"
                style={{ textDecoration: 'none', color: 'inherit' }}
              >
                <FaLinkedin size={50} />
              </Link>
            </Col>
          </Row>
          <br />
          <FaRegCopyright />
          {' '}
          Spire Hawaii LLP 2025
        </Col>
        <Col className="text-center g-3">
          {/* TODO: link to disclaimer */}
          <a href="/" rel="noopener noreferrer">Disclaimer</a>
          <br />
          <a href="/report" rel="noopener noreferrer">Report A Problem</a>
        </Col>
      </Row>
    </Container>
  </footer>
);

export default Footer;
