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

/**
 * Upserts an audit data record. Audit data is the baseline for forecasting.
 */
export async function submitAuditData(data: {
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
}) {
  // TODO: Should AuditData be different per user, user group, etc?
  await prisma.auditData.upsert({
    where: { id: 1 },
    update: {
      ...data,
    },
    create: {
      id: 1, // Force the primary key to 1 if no record exists.
      ...data,
    },
  });

  redirect('/audit-data');
}

/**
 * Retrieves the audit data record.
 * If no record exists, returns 0 for every field.
 */
export async function getAuditData() {
  const record = await prisma.auditData.findUnique({ where: { id: 1 } });
  if (!record) {
    return {
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
  }

  return { ...record };
}
