'use client';

import React from 'react';
import { Nav, Navbar } from 'react-bootstrap';
import { FaAngleDoubleDown, FaHome, FaChartBar, FaCogs, FaFileAlt, FaCog } from 'react-icons/fa';

/* The Financial Compilation Navigation bar */
const FinancialCompilationNav = () => (
  <Navbar expand="lg" style={{ backgroundColor: '#628FCA' }} variant="dark" className="my-3 rounded-4">
    <Navbar.Brand href="/financial-compilation" className="text-white p-3">
      Financial Compilation
    </Navbar.Brand>
    <Navbar.Toggle aria-controls="navbar-nav" className="mx-3">
      <FaAngleDoubleDown />
    </Navbar.Toggle>
    <Navbar.Collapse id="navbar-nav">
      <Nav justify className="w-100">
        <Nav.Link className="p-2" href="/financial-compilation/income-statement">
          <FaFileAlt className="me-2" />
          Income Statement
        </Nav.Link>
        <Nav.Link className="p-2" href="/financial-compilation/costs-of-goods">
          <FaChartBar className="me-2" />
          Costs of Goods
        </Nav.Link>
        <Nav.Link className="p-2" href="/financial-compilation/operating-expenses">
          <FaCogs className="me-2" />
          Operating Expenses
        </Nav.Link>
        <Nav.Link className="p-2" href="/financial-compilation/assets">
          <FaCog className="me-2" />
          Assets
        </Nav.Link>
        <Nav.Link className="p-2" href="/financial-compilation/liabilities-equity">
          <FaHome className="me-2" />
          Liabilities & Equity
        </Nav.Link>
      </Nav>
    </Navbar.Collapse>
  </Navbar>
);

export default FinancialCompilationNav;
