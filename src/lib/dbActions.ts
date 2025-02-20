'use server';

import { Stuff, Condition, Role } from '@prisma/client';
import { hash } from 'bcrypt';
import { redirect } from 'next/navigation';
import { prisma } from './prisma';

/**
 * Adds a new stuff to the database.
 * @param stuff, an object with the following properties: name, quantity, owner, condition.
 */
export async function addStuff(stuff: { name: string; quantity: number; owner: string; condition: string }) {
  // console.log(`addStuff data: ${JSON.stringify(stuff, null, 2)}`);
  let condition: Condition = 'good';
  if (stuff.condition === 'poor') {
    condition = 'poor';
  } else if (stuff.condition === 'excellent') {
    condition = 'excellent';
  } else {
    condition = 'fair';
  }
  await prisma.stuff.create({
    data: {
      name: stuff.name,
      quantity: stuff.quantity,
      owner: stuff.owner,
      condition,
    },
  });
  // After adding, redirect to the list page
  redirect('/list');
}

/**
 * Edits an existing stuff in the database.
 * @param stuff, an object with the following properties: id, name, quantity, owner, condition.
 */
export async function editStuff(stuff: Stuff) {
  // console.log(`editStuff data: ${JSON.stringify(stuff, null, 2)}`);
  await prisma.stuff.update({
    where: { id: stuff.id },
    data: {
      name: stuff.name,
      quantity: stuff.quantity,
      owner: stuff.owner,
      condition: stuff.condition,
    },
  });
  // After updating, redirect to the list page
  redirect('/list');
}

/**
 * Deletes an existing stuff from the database.
 * @param id, the id of the stuff to delete.
 */
export async function deleteStuff(id: number) {
  // console.log(`deleteStuff id: ${id}`);
  await prisma.stuff.delete({
    where: { id },
  });
  // After deleting, redirect to the list page
  redirect('/list');
}

/**
 * Creates a new user in the database.
 * @param credentials, an object with the following properties: email, password.
 */
export async function createUser(credentials: { email: string; password: string }) {
  // console.log(`createUser data: ${JSON.stringify(credentials, null, 2)}`);
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
  // console.log(`changePassword data: ${JSON.stringify(credentials, null, 2)}`);
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
