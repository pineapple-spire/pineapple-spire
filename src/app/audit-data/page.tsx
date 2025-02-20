'use client';

import React, { useEffect, useState } from 'react';
import { Container, Col, Row, Table, Button, Form } from 'react-bootstrap';
import { useForm } from 'react-hook-form';
import swal from 'sweetalert';
import { submitAuditData } from '@/lib/dbActions';

interface AuditDataFormValues {
  revenueYear1: number;
  revenueYear2: number;
  revenueYear3: number;
  netSalesYear1: number;
  netSalesYear2: number;
  netSalesYear3: number;
  costContractingYear1: number;
  costContractingYear2: number;
  costContractingYear3: number;
  overheadYear1: number;
  overheadYear2: number;
  overheadYear3: number;
  costOfGoodsSoldYear1: number;
  costOfGoodsSoldYear2: number;
  costOfGoodsSoldYear3: number;
  grossProfitYear1: number;
  grossProfitYear2: number;
  grossProfitYear3: number;
  grossMarginYear1: number;
  grossMarginYear2: number;
  grossMarginYear3: number;
  salariesAndBenefitsYear1: number;
  salariesAndBenefitsYear2: number;
  salariesAndBenefitsYear3: number;
  rentAndOverheadYear1: number;
  rentAndOverheadYear2: number;
  rentAndOverheadYear3: number;
  depreciationAndAmortizationYear1: number;
  depreciationAndAmortizationYear2: number;
  depreciationAndAmortizationYear3: number;
  interestYear1: number;
  interestYear2: number;
  interestYear3: number;
  totalOperatingExpensesYear1: number;
  totalOperatingExpensesYear2: number;
  totalOperatingExpensesYear3: number;
  operatingExpensesPercentYear1: number;
  operatingExpensesPercentYear2: number;
  operatingExpensesPercentYear3: number;
}

const defaultValues: AuditDataFormValues = {
  revenueYear1: 131345,
  revenueYear2: 142341,
  revenueYear3: 150772,
  netSalesYear1: 131345,
  netSalesYear2: 142341,
  netSalesYear3: 150772,
  costContractingYear1: 48456,
  costContractingYear2: 52587,
  costContractingYear3: 56643,
  overheadYear1: 667,
  overheadYear2: 667,
  overheadYear3: 667,
  costOfGoodsSoldYear1: 49123,
  costOfGoodsSoldYear2: 53254,
  costOfGoodsSoldYear3: 57310,
  grossProfitYear1: 82222,
  grossProfitYear2: 89087,
  grossProfitYear3: 93462,
  grossMarginYear1: 62.6,
  grossMarginYear2: 62.6,
  grossMarginYear3: 62.0,
  salariesAndBenefitsYear1: 23872,
  salariesAndBenefitsYear2: 23002,
  salariesAndBenefitsYear3: 25245,
  rentAndOverheadYear1: 10087,
  rentAndOverheadYear2: 11020,
  rentAndOverheadYear3: 11412,
  depreciationAndAmortizationYear1: 17205,
  depreciationAndAmortizationYear2: 16544,
  depreciationAndAmortizationYear3: 16080,
  interestYear1: 1500,
  interestYear2: 900,
  interestYear3: 900,
  totalOperatingExpensesYear1: 52664,
  totalOperatingExpensesYear2: 51466,
  totalOperatingExpensesYear3: 53637,
  operatingExpensesPercentYear1: 40.1,
  operatingExpensesPercentYear2: 36.2,
  operatingExpensesPercentYear3: 35.6,
};

const AuditDataForm: React.FC = () => {
  const { register, handleSubmit, reset } = useForm<AuditDataFormValues>({
    defaultValues,
  });

  const onSubmit = async (data: AuditDataFormValues) => {
    try {
      await submitAuditData(data);
      swal('Success', 'Audit Data submitted successfully', 'success', { timer: 2000 });
      reset(data);
    } catch (error) {
      swal('Error', 'Failed to submit Audit Data', 'error', { timer: 2000 });
    }
  };

  return (
    <Form onSubmit={handleSubmit(onSubmit)}>
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
          {/* Revenue and Net Sales */}
          <tr>
            <td>Revenue</td>
            <td>
              <Form.Control type="number" step="0.01" {...register('revenueYear1', { valueAsNumber: true })} />
            </td>
            <td>
              <Form.Control type="number" step="0.01" {...register('revenueYear2', { valueAsNumber: true })} />
            </td>
            <td>
              <Form.Control type="number" step="0.01" {...register('revenueYear3', { valueAsNumber: true })} />
            </td>
          </tr>
          <tr>
            <td>Net Sales</td>
            <td>
              <Form.Control type="number" step="0.01" {...register('netSalesYear1', { valueAsNumber: true })} />
            </td>
            <td>
              <Form.Control type="number" step="0.01" {...register('netSalesYear2', { valueAsNumber: true })} />
            </td>
            <td>
              <Form.Control type="number" step="0.01" {...register('netSalesYear3', { valueAsNumber: true })} />
            </td>
          </tr>
          {/* Cost of Goods Sold Section */}
          <tr>
            <th colSpan={4}>Cost of Goods Sold</th>
          </tr>
          <tr>
            <td>Cost of Contracting</td>
            <td>
              <Form.Control type="number" step="0.01" {...register('costContractingYear1', { valueAsNumber: true })} />
            </td>
            <td>
              <Form.Control type="number" step="0.01" {...register('costContractingYear2', { valueAsNumber: true })} />
            </td>
            <td>
              <Form.Control type="number" step="0.01" {...register('costContractingYear3', { valueAsNumber: true })} />
            </td>
          </tr>
          <tr>
            <td>Overhead</td>
            <td>
              <Form.Control type="number" step="0.01" {...register('overheadYear1', { valueAsNumber: true })} />
            </td>
            <td>
              <Form.Control type="number" step="0.01" {...register('overheadYear2', { valueAsNumber: true })} />
            </td>
            <td>
              <Form.Control type="number" step="0.01" {...register('overheadYear3', { valueAsNumber: true })} />
            </td>
          </tr>
          <tr>
            <td>Cost of Goods Sold</td>
            <td>
              <Form.Control type="number" step="0.01" {...register('costOfGoodsSoldYear1', { valueAsNumber: true })} />
            </td>
            <td>
              <Form.Control type="number" step="0.01" {...register('costOfGoodsSoldYear2', { valueAsNumber: true })} />
            </td>
            <td>
              <Form.Control type="number" step="0.01" {...register('costOfGoodsSoldYear3', { valueAsNumber: true })} />
            </td>
          </tr>
          <tr>
            <td>Gross Profit</td>
            <td>
              <Form.Control type="number" step="0.01" {...register('grossProfitYear1', { valueAsNumber: true })} />
            </td>
            <td>
              <Form.Control type="number" step="0.01" {...register('grossProfitYear2', { valueAsNumber: true })} />
            </td>
            <td>
              <Form.Control type="number" step="0.01" {...register('grossProfitYear3', { valueAsNumber: true })} />
            </td>
          </tr>
          <tr>
            <td>Gross Margin %</td>
            <td>
              <Form.Control type="number" step="0.01" {...register('grossMarginYear1', { valueAsNumber: true })} />
            </td>
            <td>
              <Form.Control type="number" step="0.01" {...register('grossMarginYear2', { valueAsNumber: true })} />
            </td>
            <td>
              <Form.Control type="number" step="0.01" {...register('grossMarginYear3', { valueAsNumber: true })} />
            </td>
          </tr>
          {/* Operating Expenses Section */}
          <tr>
            <th colSpan={4}>Operating Expenses</th>
          </tr>
          <tr>
            <td>Salaries and Benefits</td>
            <td>
              <Form.Control
                type="number"
                step="0.01"
                {...register('salariesAndBenefitsYear1', { valueAsNumber: true })}
              />
            </td>
            <td>
              <Form.Control
                type="number"
                step="0.01"
                {...register('salariesAndBenefitsYear2', { valueAsNumber: true })}
              />
            </td>
            <td>
              <Form.Control
                type="number"
                step="0.01"
                {...register('salariesAndBenefitsYear3', { valueAsNumber: true })}
              />
            </td>
          </tr>
          <tr>
            <td>Rent and Overhead</td>
            <td>
              <Form.Control type="number" step="0.01" {...register('rentAndOverheadYear1', { valueAsNumber: true })} />
            </td>
            <td>
              <Form.Control type="number" step="0.01" {...register('rentAndOverheadYear2', { valueAsNumber: true })} />
            </td>
            <td>
              <Form.Control type="number" step="0.01" {...register('rentAndOverheadYear3', { valueAsNumber: true })} />
            </td>
          </tr>
          <tr>
            <td>Depreciation and Amortization</td>
            <td>
              <Form.Control
                type="number"
                step="0.01"
                {
                ...register('depreciationAndAmortizationYear1', { valueAsNumber: true })}
              />
            </td>
            <td>
              <Form.Control
                type="number"
                step="0.01"
                {
                ...register('depreciationAndAmortizationYear2', { valueAsNumber: true })}
              />
            </td>
            <td>
              <Form.Control
                type="number"
                step="0.01"
                {...register('depreciationAndAmortizationYear3', { valueAsNumber: true })}
              />
            </td>
          </tr>
          <tr>
            <td>Interest</td>
            <td>
              <Form.Control type="number" step="0.01" {...register('interestYear1', { valueAsNumber: true })} />
            </td>
            <td>
              <Form.Control type="number" step="0.01" {...register('interestYear2', { valueAsNumber: true })} />
            </td>
            <td>
              <Form.Control type="number" step="0.01" {...register('interestYear3', { valueAsNumber: true })} />
            </td>
          </tr>
          <tr>
            <td>Total Operating Expenses</td>
            <td>
              <Form.Control
                type="number"
                step="0.01"
                {...register('totalOperatingExpensesYear1', { valueAsNumber: true })}
              />
            </td>
            <td>
              <Form.Control
                type="number"
                step="0.01"
                {...register('totalOperatingExpensesYear2', { valueAsNumber: true })}
              />
            </td>
            <td>
              <Form.Control
                type="number"
                step="0.01"
                {...register('totalOperatingExpensesYear3', { valueAsNumber: true })}
              />
            </td>
          </tr>
          <tr>
            <td>Operating Expenses %</td>
            <td>
              <Form.Control
                type="number"
                step="0.01"
                {...register('operatingExpensesPercentYear1', { valueAsNumber: true })}
              />
            </td>
            <td>
              <Form.Control
                type="number"
                step="0.01"
                {...register('operatingExpensesPercentYear2', { valueAsNumber: true })}
              />
            </td>
            <td>
              <Form.Control
                type="number"
                step="0.01"
                {...register('operatingExpensesPercentYear3', { valueAsNumber: true })}
              />
            </td>
          </tr>
        </tbody>
      </Table>
      <Button type="submit" className="mb-3">
        Submit Data
      </Button>
    </Form>
  );
};

const AuditDataPage: React.FC = () => {
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
              <div className="spinner-border" role="status">
                <span className="visually-hidden">Loading...</span>
              </div>
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
        <AuditDataForm />
      </Row>
    </Container>
  );
};

export default AuditDataPage;
