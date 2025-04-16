'use server';

import { Role } from '@prisma/client';
import { hash, compare } from 'bcrypt';
import { redirect } from 'next/navigation';
import { prisma } from './prisma';

export type ChangePasswordCredentials = {
  email: string;
  oldPassword: string;
  password: string;
};

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

export async function deleteUser(userID: number) {
  await prisma.user.delete({
    where: {
      id: userID,
    },
  });
}

/**
 * Changes the password of an existing user in the database.
 * @param credentials, an object with the following properties:
 *    email, old password, current password.
 */
export async function changePassword({
  email,
  oldPassword,
  password,
}: ChangePasswordCredentials): Promise<{ success: boolean }> {
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) {
    throw new Error('User not found.');
  }

  const isValid = await compare(oldPassword, user.password);
  if (!isValid) {
    throw new Error('Incorrect old password.');
  }

  const newHashedPassword = await hash(password, 10);
  await prisma.user.update({
    where: { email },
    data: { password: newHashedPassword },
  });

  return { success: true };
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

export interface FinancialDataValues {
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

export type AuditDataValues = [
  FinancialDataValues,
  FinancialDataValues,
  FinancialDataValues,
];

/**
 * Upserts an audit data record. Audit data is the baseline.
 */
export async function submitAuditData(data: AuditDataValues): Promise<void> {
  await Promise.all(
    data.map((financialData) => prisma.financialData.upsert({
      where: { year: financialData.year },
      update: { ...financialData },
      create: { ...financialData },
    })),
  );

  redirect('/audit-data');
}

/**
 * Retrieves the audit data record.
 * If no record exists, returns 0 for every field.
 */
export async function getAuditData(): Promise<AuditDataValues> {
  const defaultFinancialModel = {
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

  const years = [2022, 2023, 2024];
  const records = await prisma.financialData.findMany({
    where: {
      year: { in: years },
    },
  });

  const results = years.map((year) => {
    const record = records.find((rec) => rec.year === year);
    return record || { year, ...defaultFinancialModel };
  }) as AuditDataValues;

  return results;
}
