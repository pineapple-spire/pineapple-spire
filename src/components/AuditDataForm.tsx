'use client';

import React, { useEffect } from 'react';
import { Table, Button, Form } from 'react-bootstrap';
import { useForm } from 'react-hook-form';
import swal from 'sweetalert';
import { submitAuditData, getAuditData } from '@/lib/dbActions';

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
  revenueYear1: 0,
  revenueYear2: 0,
  revenueYear3: 0,
  netSalesYear1: 0,
  netSalesYear2: 0,
  netSalesYear3: 0,
  costContractingYear1: 0,
  costContractingYear2: 0,
  costContractingYear3: 0,
  overheadYear1: 0,
  overheadYear2: 0,
  overheadYear3: 0,
  costOfGoodsSoldYear1: 0,
  costOfGoodsSoldYear2: 0,
  costOfGoodsSoldYear3: 0,
  grossProfitYear1: 0,
  grossProfitYear2: 0,
  grossProfitYear3: 0,
  grossMarginYear1: 0,
  grossMarginYear2: 0,
  grossMarginYear3: 0,
  salariesAndBenefitsYear1: 0,
  salariesAndBenefitsYear2: 0,
  salariesAndBenefitsYear3: 0,
  rentAndOverheadYear1: 0,
  rentAndOverheadYear2: 0,
  rentAndOverheadYear3: 0,
  depreciationAndAmortizationYear1: 0,
  depreciationAndAmortizationYear2: 0,
  depreciationAndAmortizationYear3: 0,
  interestYear1: 0,
  interestYear2: 0,
  interestYear3: 0,
  totalOperatingExpensesYear1: 0,
  totalOperatingExpensesYear2: 0,
  totalOperatingExpensesYear3: 0,
  operatingExpensesPercentYear1: 0,
  operatingExpensesPercentYear2: 0,
  operatingExpensesPercentYear3: 0,
};

const AuditDataForm: React.FC = () => {
  const { register, handleSubmit, reset } = useForm<AuditDataFormValues>({ defaultValues });

  useEffect(() => {
    const fetchData = async () => {
      const data = await getAuditData();
      reset(data);
    };

    fetchData();
  }, [reset]);

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
                {...register('depreciationAndAmortizationYear1', { valueAsNumber: true })}
              />
            </td>
            <td>
              <Form.Control
                type="number"
                step="0.01"
                {...register('depreciationAndAmortizationYear2', { valueAsNumber: true })}
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

export default AuditDataForm;
