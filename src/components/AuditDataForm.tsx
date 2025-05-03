'use client';

import React, { useEffect, useState } from 'react';
import { Table, Button, Form, InputGroup } from 'react-bootstrap';
import { useForm, Controller, ControllerRenderProps } from 'react-hook-form';
import swal from 'sweetalert';
import {
  submitAuditData,
  getAuditData,
  FinancialDataValues,
  AuditDataValues,
} from '@/lib/dbActions';
import LoadingSpinner from '@/components/LoadingSpinner';

const isPercentField = (key: string) => key.toLowerCase().includes('percent')
  || key.toLowerCase().includes('margin')
  || key.toLowerCase().includes('rate');

type NumericField = Pick<ControllerRenderProps<any, any>, 'value' | 'onChange'>;
interface NumericInputProps {
  field: NumericField;
  isPercent: boolean;
}

const NumericInput: React.FC<NumericInputProps> = ({ field, isPercent }) => {
  const [focused, setFocused] = useState(false);

  const formatted = Number(field.value)
    .toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  const [display, setDisplay] = useState(formatted);

  useEffect(() => {
    if (!focused) {
      setDisplay(formatted);
    }
  }, [formatted, focused]);

  return (
    <InputGroup size="sm">
      {!isPercent && <InputGroup.Text>$</InputGroup.Text>}

      <Form.Control
        type="text"
        value={display}
        onFocus={() => {
          setFocused(true);
          setDisplay(String(field.value));
        }}
        onChange={e => {
          setDisplay(e.target.value);
        }}
        onBlur={() => {
          const raw = display.replace(/,/g, '');
          const num = parseFloat(raw) || 0;
          field.onChange(num);
          setFocused(false);
          setDisplay(
            num.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }),
          );
        }}
      />

      {isPercent && <InputGroup.Text>%</InputGroup.Text>}
    </InputGroup>
  );
};

const defaultFinancialModel: FinancialDataValues = {
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

const defaultValues: AuditDataValues = [
  { ...defaultFinancialModel },
  { ...defaultFinancialModel },
  { ...defaultFinancialModel },
];

const financialFields: Array<{
  key: keyof FinancialDataValues
  label: string
}> = [
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
  const {
    control,
    handleSubmit,
    reset,
    formState: { isSubmitting },
  } = useForm<AuditDataValues>({ defaultValues });
  const [finData, setFinData] = useState<AuditDataValues>(defaultValues);
  const [loading, setLoading] = useState<boolean>(true);

  const fetchData = async () => {
    try {
      const data = (await getAuditData()) as AuditDataValues;
      setFinData(data);
      reset(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [reset]);

  const sanitizeRecord = (record: FinancialDataValues) => {
    const sanitized = { ...defaultFinancialModel };
    for (const k of Object.keys(defaultFinancialModel) as (keyof FinancialDataValues)[]) {
      if (record[k] != null) sanitized[k] = record[k];
    }
    return sanitized;
  };

  const onSubmit = async (data: AuditDataValues) => {
    try {
      await submitAuditData(data.map(sanitizeRecord) as AuditDataValues);
      swal('Success', 'Audit Data submitted successfully', 'success', { timer: 2000 });
      await fetchData();
    } catch (err) {
      console.error(err);
      swal('Error', 'Failed to submit Audit Data', 'error', { timer: 2000 });
    }
  };

  if (loading) return <LoadingSpinner />;

  return (
    <Form onSubmit={handleSubmit(onSubmit)}>
      <Table striped bordered hover responsive>
        <thead>
          <tr>
            <th>Category</th>
            {finData.map((row, i) => <th key={i}>{row.year}</th>)}
          </tr>
        </thead>
        <tbody>
          {financialFields.map(({ key, label }) => (
            <tr key={key}>
              <td>{label}</td>
              {finData.map((_, idx) => (
                <td key={idx}>
                  <Controller
                    name={`${idx}.${key}` as `${0 | 1 | 2}.${keyof FinancialDataValues}`}
                    control={control}
                    defaultValue={finData[idx][key]}
                    render={({ field }) => (
                      <NumericInput
                        field={field}
                        isPercent={isPercentField(key)}
                      />
                    )}
                  />
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </Table>
      <Button type="submit" disabled={isSubmitting}>Submit Data</Button>
    </Form>
  );
};

export default AuditDataForm;
