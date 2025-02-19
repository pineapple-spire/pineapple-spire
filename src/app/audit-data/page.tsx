'use client';

import React, { useEffect, useState } from 'react';
import {
  Container,
  Col,
  Row,
  Table,
  Button,
  Form,
} from 'react-bootstrap';
import LoadingSpinner from '@/components/LoadingSpinner';

/*
 * AuditData component displays an audit data form.
 */
const AuditData: React.FC = () => {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <Container fluid className="py-5">
        <h2 className="text-center mb-4">Loading Audit Data...</h2>
        <Row className="justify-content-around">
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
    <Container className="py-3">
      <Row className="mb-4">
        <Col>
          <h2 className="text-center">Audit Data</h2>
        </Col>
      </Row>
      <Row>
        <Form action="#" method="post">
          <Table striped bordered responsive>
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
                <td>
                  <Form.Control
                    type="number"
                    name="revenue1"
                    defaultValue="131345"
                    aria-label="Revenue Year 1"
                  />
                </td>
                <td>
                  <Form.Control
                    type="number"
                    name="revenue2"
                    defaultValue="142341"
                    aria-label="Revenue Year 2"
                  />
                </td>
                <td>
                  <Form.Control
                    type="number"
                    name="revenue3"
                    defaultValue="150772"
                    aria-label="Revenue Year 3"
                  />
                </td>
              </tr>
              <tr>
                <td>Net Sales</td>
                <td>
                  <Form.Control
                    type="number"
                    name="net_sales1"
                    defaultValue="131345"
                    aria-label="Net Sales Year 1"
                  />
                </td>
                <td>
                  <Form.Control
                    type="number"
                    name="net_sales2"
                    defaultValue="142341"
                    aria-label="Net Sales Year 2"
                  />
                </td>
                <td>
                  <Form.Control
                    type="number"
                    name="net_sales3"
                    defaultValue="150772"
                    aria-label="Net Sales Year 3"
                  />
                </td>
              </tr>
              <tr>
                <th colSpan={4}>Cost of Goods Sold</th>
              </tr>
              <tr>
                <td>Cost of Contracting</td>
                <td>
                  <Form.Control
                    type="number"
                    name="cost_contracting1"
                    defaultValue="48456"
                    aria-label="Cost of Contracting Year 1"
                  />
                </td>
                <td>
                  <Form.Control
                    type="number"
                    name="cost_contracting2"
                    defaultValue="52587"
                    aria-label="Cost of Contracting Year 2"
                  />
                </td>
                <td>
                  <Form.Control
                    type="number"
                    name="cost_contracting3"
                    defaultValue="56643"
                    aria-label="Cost of Contracting Year 3"
                  />
                </td>
              </tr>
              <tr>
                <td>Overhead</td>
                <td>
                  <Form.Control
                    type="number"
                    name="overhead1"
                    defaultValue="667"
                    aria-label="Overhead Year 1"
                  />
                </td>
                <td>
                  <Form.Control
                    type="number"
                    name="overhead2"
                    defaultValue="667"
                    aria-label="Overhead Year 2"
                  />
                </td>
                <td>
                  <Form.Control
                    type="number"
                    name="overhead3"
                    defaultValue="667"
                    aria-label="Overhead Year 3"
                  />
                </td>
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
                <td>
                  <Form.Control
                    type="number"
                    name="salaries1"
                    defaultValue="23872"
                    aria-label="Salaries and Benefits Year 1"
                  />
                </td>
                <td>
                  <Form.Control
                    type="number"
                    name="salaries2"
                    defaultValue="23002"
                    aria-label="Salaries and Benefits Year 2"
                  />
                </td>
                <td>
                  <Form.Control
                    type="number"
                    name="salaries3"
                    defaultValue="25245"
                    aria-label="Salaries and Benefits Year 3"
                  />
                </td>
              </tr>
              <tr>
                <td>Rent and Overhead</td>
                <td>
                  <Form.Control
                    type="number"
                    name="rent1"
                    defaultValue="10087"
                    aria-label="Rent and Overhead Year 1"
                  />
                </td>
                <td>
                  <Form.Control
                    type="number"
                    name="rent2"
                    defaultValue="11020"
                    aria-label="Rent and Overhead Year 2"
                  />
                </td>
                <td>
                  <Form.Control
                    type="number"
                    name="rent3"
                    defaultValue="11412"
                    aria-label="Rent and Overhead Year 3"
                  />
                </td>
              </tr>
              <tr>
                <td>Depreciation and Amortization</td>
                <td>
                  <Form.Control
                    type="number"
                    name="depreciation1"
                    defaultValue="17205"
                    aria-label="Depreciation and Amortization Year 1"
                  />
                </td>
                <td>
                  <Form.Control
                    type="number"
                    name="depreciation2"
                    defaultValue="16544"
                    aria-label="Depreciation and Amortization Year 2"
                  />
                </td>
                <td>
                  <Form.Control
                    type="number"
                    name="depreciation3"
                    defaultValue="16080"
                    aria-label="Depreciation and Amortization Year 3"
                  />
                </td>
              </tr>
              <tr>
                <td>Interest</td>
                <td>
                  <Form.Control
                    type="number"
                    name="interest1"
                    defaultValue="1500"
                    aria-label="Interest Year 1"
                  />
                </td>
                <td>
                  <Form.Control
                    type="number"
                    name="interest2"
                    defaultValue="900"
                    aria-label="Interest Year 2"
                  />
                </td>
                <td>
                  <Form.Control
                    type="number"
                    name="interest3"
                    defaultValue="900"
                    aria-label="Interest Year 3"
                  />
                </td>
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
          <Button type="submit" className="mb-3">
            Submit Data
          </Button>
        </Form>
      </Row>
    </Container>
  );
};

export default AuditData;
