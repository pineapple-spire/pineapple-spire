/* eslint-disable jsx-a11y/control-has-associated-label */

'use client';

import React from 'react';
import { Container, Col, Row, Table, Button } from 'react-bootstrap';

const LoadingSpinner = () => (
  <div className="flex items-center justify-center h-64">
    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500" />
  </div>
);

const AuditData: React.FC = () => {
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <Container fluid className="py-12">
        <h2 className="text-3xl font-bold text-center mb-12">Fiscal Sustainability Model</h2>
        <Row className="justify-content-around g-8">
          {[1, 2, 3].map((i) => (
            <Col key={i} md={3} className="mx-4">
              <LoadingSpinner />
            </Col>
          ))}
        </Row>
      </Container>
    );
  }

  return (
    <Container>
      <Row className="m-3">
        <h2 className="text-3xl font-bold text-center mb-12">Audit Data</h2>
      </Row>
      <Row>
        <form action="#" method="post">
          <Table striped bordered>
            <thead>
              <tr>
                <th>Category</th>
                <th>Year 1</th>
                <th>Year 2</th>
                <th>Year 3</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Revenue</td>
                <td><input type="number" name="revenue1" defaultValue="131345" /></td>
                <td><input type="number" name="revenue2" defaultValue="142341" /></td>
                <td><input type="number" name="revenue3" defaultValue="150772" /></td>
              </tr>
              <tr>
                <td>Net Sales</td>
                <td><input type="number" name="net_sales1" defaultValue="131345" /></td>
                <td><input type="number" name="net_sales2" defaultValue="142341" /></td>
                <td><input type="number" name="net_sales3" defaultValue="150772" /></td>
              </tr>
              <tr>
                <th colSpan={4}>Cost of Goods Sold</th>
              </tr>
              <tr>
                <td>Cost of Contracting</td>
                <td><input type="number" name="cost_contracting1" defaultValue="48456" /></td>
                <td><input type="number" name="cost_contracting2" defaultValue="52587" /></td>
                <td><input type="number" name="cost_contracting3" defaultValue="56643" /></td>
              </tr>
              <tr>
                <td>Overhead</td>
                <td><input type="number" name="overhead1" defaultValue="667" /></td>
                <td><input type="number" name="overhead2" defaultValue="667" /></td>
                <td><input type="number" name="overhead3" defaultValue="667" /></td>
              </tr>
              <tr>
                <td>Cost of Goods Sold</td>
                <td>49123</td>
                <td>53254</td>
                <td>57310</td>
              </tr>
              <tr>
                <td>Gross Profit</td>
                <td>82222</td>
                <td>89087</td>
                <td>93462</td>
              </tr>
              <tr>
                <td>Gross Margin %</td>
                <td>62.6</td>
                <td>62.6</td>
                <td>62.0</td>
              </tr>
              <tr>
                <th colSpan={4}>Operating Expenses</th>
              </tr>
              <tr>
                <td>Salaries and Benefits</td>
                <td><input type="number" name="salaries1" defaultValue="23872" /></td>
                <td><input type="number" name="salaries2" defaultValue="23002" /></td>
                <td><input type="number" name="salaries3" defaultValue="25245" /></td>
              </tr>
              <tr>
                <td>Rent and Overhead</td>
                <td><input type="number" name="rent1" defaultValue="10087" /></td>
                <td><input type="number" name="rent2" defaultValue="11020" /></td>
                <td><input type="number" name="rent3" defaultValue="11412" /></td>
              </tr>
              <tr>
                <td>Depreciation and Amortization</td>
                <td><input type="number" name="depreciation1" defaultValue="17205" /></td>
                <td><input type="number" name="depreciation2" defaultValue="16544" /></td>
                <td><input type="number" name="depreciation3" defaultValue="16080" /></td>
              </tr>
              <tr>
                <td>Interest</td>
                <td><input type="number" name="interest1" defaultValue="1500" /></td>
                <td><input type="number" name="interest2" defaultValue="900" /></td>
                <td><input type="number" name="interest3" defaultValue="900" /></td>
              </tr>
              <tr>
                <td>Total Operating Expenses</td>
                <td>52664</td>
                <td>51466</td>
                <td>53637</td>
              </tr>
              <tr>
                <td>Operating Expenses %</td>
                <td>40.1</td>
                <td>36.2</td>
                <td>35.6</td>
              </tr>
            </tbody>
          </Table>
          <Button type="submit" className="mb-3">Submit Data</Button>
        </form>
      </Row>
    </Container>
  );
};

export default AuditData;
