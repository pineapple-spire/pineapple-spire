'use client';

import React, { useEffect, useState } from 'react';
import { Table, Button, Form } from 'react-bootstrap';
import { useForm } from 'react-hook-form';
import swal from 'sweetalert';
import { submitAuditData, getAuditData } from '@/lib/dbActions';

interface FinancialDataValues {
  year: number;
  revenue: number;
  costContracting: number;
  overhead: number;
  salariesAndBenefits: number;
  rentAndOverhead: number;
  depreciationAndAmortization: number;
  interest: number;
  interestIncome: number;
  interestExpense: number;
  gainOnDisposalAssets: number;
  otherIncome: number;
  incomeTaxes: number;
  cashAndEquivalents: number;
  accountsReceivable: number;
  inventory: number;
  propertyPlantAndEquipment: number;
  investment: number;
  accountsPayable: number;
  currentDebtService: number;
  taxesPayable: number;
  longTermDebtService: number;
  loansPayable: number;
  equityCapital: number;
  retainedEarnings: number;
}
type AuditDataFormValues = [FinancialDataValues, FinancialDataValues, FinancialDataValues];

const defaultFinancialModel = {
  year: 0,
  revenue: 0,
  costContracting: 0,
  overhead: 0,
  salariesAndBenefits: 0,
  rentAndOverhead: 0,
  depreciationAndAmortization: 0,
  interest: 0,
  interestIncome: 0,
  interestExpense: 0,
  gainOnDisposalAssets: 0,
  otherIncome: 0,
  incomeTaxes: 0,
  cashAndEquivalents: 0,
  accountsReceivable: 0,
  inventory: 0,
  propertyPlantAndEquipment: 0,
  investment: 0,
  accountsPayable: 0,
  currentDebtService: 0,
  taxesPayable: 0,
  longTermDebtService: 0,
  loansPayable: 0,
  equityCapital: 0,
  retainedEarnings: 0,
};
const defaultValues: AuditDataFormValues = [defaultFinancialModel, defaultFinancialModel, defaultFinancialModel];

const financialFields = [
  { key: 'revenue', label: 'Revenue' },
  { key: 'costContracting', label: 'Cost Contracting' },
  { key: 'overhead', label: 'Overhead' },
  { key: 'salariesAndBenefits', label: 'Salaries and Benefits' },
  { key: 'rentAndOverhead', label: 'Rent and Overhead' },
  { key: 'depreciationAndAmortization', label: 'Depreciation and Amortization' },
  { key: 'interest', label: 'Interest' },
  { key: 'interestIncome', label: 'Interest Income' },
  { key: 'interestExpense', label: 'Interest Expense' },
  { key: 'gainOnDisposalAssets', label: 'Gain on Disposal of Assets' },
  { key: 'otherIncome', label: 'Other Income' },
  { key: 'incomeTaxes', label: 'Income Taxes' },
  { key: 'cashAndEquivalents', label: 'Cash and Equivalents' },
  { key: 'accountsReceivable', label: 'Accounts Receivable' },
  { key: 'inventory', label: 'Inventory' },
  { key: 'propertyPlantAndEquipment', label: 'Property, Plant, and Equipment' },
  { key: 'investment', label: 'Investment' },
  { key: 'accountsPayable', label: 'Accounts Payable' },
  { key: 'currentDebtService', label: 'Current Debt Service' },
  { key: 'taxesPayable', label: 'Taxes Payable' },
  { key: 'longTermDebtService', label: 'Long-Term Debt Service' },
  { key: 'loansPayable', label: 'Loans Payable' },
  { key: 'equityCapital', label: 'Equity Capital' },
  { key: 'retainedEarnings', label: 'Retained Earnings' },
];

const AuditDataForm: React.FC = () => {
  const { register, handleSubmit, reset } = useForm<AuditDataFormValues>({ defaultValues });
  const [finData, setFinData] = useState([defaultFinancialModel, defaultFinancialModel, defaultFinancialModel]);

  useEffect(() => {
    const fetchData = async () => {
      const data = await getAuditData();
      // @ts-ignore
      setFinData(data);
      // @ts-ignore
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
            <th>{ finData[0].year }</th>
            <th>{ finData[1].year }</th>
            <th>{ finData[2].year }</th>
          </tr>
        </thead>
        <tbody>
          {financialFields.map(({ key, label }) => (
            <tr key={key}>
              <td>{label}</td>
              {[0, 1, 2].map((index) => (
                <td key={index}>
                  <Form.Control
                    type="number"
                    step="0.01"
                    // @ts-ignore
                    {...register(`${index}.${key}`, { valueAsNumber: true })}
                  />
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </Table>
      <Button type="submit" className="mb-3">
        Submit Data
      </Button>
    </Form>
  );
};

export default AuditDataForm;
