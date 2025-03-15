'use server';

import { Role } from '@prisma/client';
import { hash } from 'bcrypt';
import { redirect } from 'next/navigation';
import { prisma } from './prisma';

/**
 * Creates a new user in the database.
 * @param credentials, an object with the following properties: email, password.
 */
export async function createUser(credentials: { email: string; password: string }) {
  const password = await hash(credentials.password, 10);
  await prisma.user.create({
    data: {
      email: credentials.email,
      password,
    },
  });
}

/**
 * Changes the password of an existing user in the database.
 * @param credentials, an object with the following properties: email, password.
 */
export async function changePassword(credentials: { email: string; password: string }) {
  const password = await hash(credentials.password, 10);
  await prisma.user.update({
    where: { email: credentials.email },
    data: {
      password,
    },
  });
}

/**
 * Changes the role of an existing user in the database.
 * @param credentials, an object with the following properties: email, password.
 */
export async function changeRole(credentials: { email: string; role: Role }) {
  await prisma.user.update({
    where: { email: credentials.email },
    data: {
      role: credentials.role,
    },
  });
}

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
type AuditDataValues = [FinancialDataValues, FinancialDataValues, FinancialDataValues];
/**
 * Upserts an audit data record. Audit data is the baseline for forecasting.
 */
export async function submitAuditData(data:AuditDataValues) {
  // TODO: Should AuditData be different per user, user group, etc?
  await prisma.financialData.upsert({
    where: { year: data[0].year },
    update: {
      ...data[0],
    },
    create: {
      // Creates an instance of the data if not found
      ...data[0],
    },
  });
  await prisma.financialData.upsert({
    where: { year: data[1].year },
    update: {
      ...data[1],
    },
    create: {
      // Creates an instance of the data if not found
      ...data[1],
    },
  });
  await prisma.financialData.upsert({
    where: { year: data[2].year },
    update: {
      ...data[2],
    },
    create: {
      // Creates an instance of the data if not found
      ...data[2],
    },
  });

  redirect('/audit-data');
}

/**
 * Retrieves the audit data record.
 * If no record exists, returns 0 for every field.
 */
export async function getAuditData() {
  const defaultFinancialModel = {
    revenue: 1000,
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
  // eslint-disable-next-line max-len
  const records = [await prisma.financialData.findUnique({ where: { year: 2022 } }), await prisma.financialData.findUnique({ where: { year: 2023 } }), await prisma.financialData.findUnique({ where: { year: 2024 } })];
  for (let i = 0; i < records.length; i++) {
    if (!records[i]) {
      console.log('default model generated in dbActions');
      records[i] = {
        year: 2022 + i,
        ...defaultFinancialModel,
      };
    }
  }

  console.log('default model generated in dbActions');
  return records;
}
