'use client';

import React, { useState } from 'react';
import { Col, Container, Row, Modal, Button } from 'react-bootstrap';
import { FaXTwitter, FaLinkedin, FaRegCopyright } from 'react-icons/fa6';
import Link from 'next/link';

/** The Footer appears at the bottom of every page. Rendered by the App Layout component. */
const Footer: React.FC = () => {
  const [showDisclaimer, setShowDisclaimer] = useState(false);
  const handleClose = () => setShowDisclaimer(false);
  const handleShow = () => setShowDisclaimer(true);

  return (
    <>
      <footer className="mt-auto py-3 footer" style={{ zIndex: 2 }}>
        <Container>
          <Row>
            {/* Contact & Spire link */}
            <Col className="text-center g-3">
              <Link href="/contact" legacyBehavior>
                <a href="/contact">Contact Us</a>
              </Link>
              <br />
              <a href="https://www.spirehawaii.com/" target="_blank" rel="noopener noreferrer">
                Visit Spire LLP
              </a>
            </Col>

            {/* Social icons & copyright */}
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

            {/* Links including Disclaimer trigger */}
            <Col className="text-center g-3">
              <Link href="/report" legacyBehavior>
                <a href="/report">Report A Problem</a>
              </Link>
              <br />
              {/* eslint-disable-next-line jsx-a11y/anchor-is-valid */}
              <a href="#" onClick={(e) => { e.preventDefault(); handleShow(); }}>
                Disclaimer
              </a>
            </Col>
          </Row>
        </Container>
      </footer>

      {/* Disclaimer Modal */}
      <Modal show={showDisclaimer} onHide={handleClose} centered>
        <Modal.Header closeButton>
          <Modal.Title>Disclaimer</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>
            All information on the site is provided in good faith;
            however, we make no representation or warranty of any kind regarding
            the accuracy, adequacy, validity, reliability, availability, or
            completeness of any information or data on the site.
          </p>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default Footer;
