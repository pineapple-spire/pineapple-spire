'use client';

import React from 'react';
import { Nav } from 'react-bootstrap';

/** The Stress Test Tool page. */
const FinancialCompilationNav = () => (
  <Nav justify style={{ backgroundColor: '#d9d9d9' }} className="justify-content-evenly m-3 bg-#e3f2fd" variant="tabs">
    <Nav.Link className="p-1" href="/financial-compilation/income-statement">Income Statement</Nav.Link>
    <Nav.Link className="p-1" href="/financial-compilation/costs-of-goods">Costs of Goods</Nav.Link>
    <Nav.Link className="p-1" href="/financial-compilation/operating-expenses">Operating Expenses</Nav.Link>
    <Nav.Link className="p-1" href="/financial-compilation/assets">Assets</Nav.Link>
    <Nav.Link className="p-1" href="/financial-compilation/liabilities-equity">Liabilities & Equity</Nav.Link>
  </Nav>
);

export default FinancialCompilationNav;
