'use client';

import { useSession } from 'next-auth/react';
import { usePathname } from 'next/navigation';
import Image from 'next/image';
import { Container, Nav, Navbar, NavDropdown } from 'react-bootstrap';
import { BoxArrowRight, Lock, PersonFill, PersonPlusFill } from 'react-bootstrap-icons';

const NavBar: React.FC = () => {
  const { data: session } = useSession();
  const currentUser = session?.user?.email;
  const userWithRole = session?.user as { email: string; randomKey: string };
  const role = userWithRole?.randomKey;
  const pathName = usePathname();
  return (
    <Navbar className="navbar" expand="lg">
      <Container>
        <Navbar.Brand href="/" className="d-flex align-items-center">
          <Image
            src="/logo.png"
            alt="Spire Hawaii"
            width={120}
            height={50}
            style={{ objectFit: 'contain' }}
          />
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto justify-content-start">
            {/* TODO: Add auth for navbar options depending on user. */}
            <Nav.Link
              id="about-nav"
              href="/about"
              key="about"
              active={pathName === '/about'}
            >
              About
            </Nav.Link>
            <NavDropdown id="tools-dropdown" title="Browse Tools">
              <NavDropdown.Item id="tools-dropdown-financial-compilation" href="/financial-compilation">
                Financial Compilation
              </NavDropdown.Item>
              <NavDropdown.Item id="tools-dropdown-stress-test-tool" href="/stress-test-tool">
                Stress Test Tool
              </NavDropdown.Item>
              <NavDropdown.Item id="tools-dropdown-audit-data" href="/audit-data">
                Audit Data
              </NavDropdown.Item>
            </NavDropdown>
            {currentUser && role === 'ADMIN' ? (
              <Nav.Link id="admin-stuff-nav" href="/admin" key="admin" active={pathName === '/admin'}>
                Registered Users
              </Nav.Link>
            ) : (
              ''
            )}
          </Nav>
          <Nav>
            {session ? (
              <NavDropdown id="login-dropdown" title={currentUser}>
                <NavDropdown.Item id="login-dropdown-sign-out" href="/api/auth/signout">
                  <BoxArrowRight />
                  Sign Out
                </NavDropdown.Item>
                <NavDropdown.Item id="login-dropdown-change-password" href="/auth/change-password">
                  <Lock />
                  Change Password
                </NavDropdown.Item>
              </NavDropdown>
            ) : (
              <NavDropdown id="login-dropdown" title="Login">
                <NavDropdown.Item id="login-dropdown-sign-in" href="/auth/signin">
                  <PersonFill />
                  Sign in
                </NavDropdown.Item>
                <NavDropdown.Item id="login-dropdown-sign-up" href="/auth/signup">
                  <PersonPlusFill />
                  Sign up
                </NavDropdown.Item>
              </NavDropdown>
            )}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default NavBar;
