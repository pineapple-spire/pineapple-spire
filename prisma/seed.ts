import { PrismaClient, Role } from '@prisma/client';
import { hash } from 'bcrypt';
import * as config from '../config/settings.development.json';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding the database');
  const password = await hash('changeme', 10);
  config.defaultAccounts.forEach(async (account) => {
    let role: Role = 'USER';
    if (account.role === 'ADMIN') {
      role = 'ADMIN';
    } else if (account.role === 'AUDITOR') {
      role = 'AUDITOR' as Role;
    } else if (account.role === 'ANALYST') {
      role = 'ANALYST' as Role;
    } else if (account.role === 'VIEWER') {
      role = 'VIEWER' as Role;
    }
    console.log(`  Creating user: ${account.email} with role: ${role}`);
    await prisma.user.upsert({
      where: { email: account.email },
      update: {},
      create: {
        email: account.email,
        password,
        role,
      },
    });
  });

  config.defaultData.forEach(async (data) => {
    console.log(`  Creating base data: ${data.year}`);
    await prisma.financialData.upsert({
      where: { year: data.year },
      update: {},
      create: {
        year: data.year,
        revenue: data.revenue,
        costContracting: data.costContracting,
        overhead: data.overhead,
        salariesAndBenefits: data.salariesAndBenefits,
        rentAndOverhead: data.rentAndOverhead,
        depreciationAndAmortization: data.depreciationAndAmortization,
        interest: data.interest,
        interestIncome: data.interestIncome,
        interestExpense: data.interestExpense,
        gainOnDisposalAssets: data.gainOnDisposalAssets,
        otherIncome: data.otherIncome,
        incomeTaxes: data.incomeTaxes,
        cashAndEquivalents: data.cashAndEquivalents,
        accountsReceivable: data.accountsReceivable,
        inventory: data.inventory,
        propertyPlantAndEquipment: data.propertyPlantAndEquipment,
        investment: data.investment,
        accountsPayable: data.accountsPayable,
        currentDebtService: data.currentDebtService,
        taxesPayable: data.taxesPayable,
        longTermDebtService: data.longTermDebtService,
        loansPayable: data.loansPayable,
        equityCapital: data.equityCapital,
        retainedEarnings: data.retainedEarnings,
      },
    });
  });

  config.defaultScenarios.forEach(async (scenario) => {
    console.log('  Creating base stress test scenarios');
    await prisma.stressScenario.upsert({
      where: { id: scenario.id },
      update: {},
      create: {
        title: scenario.title,
        description: scenario.description,
        excelWorkbookUrl: scenario.excelWorkbookUrl,
      },
    });
  });
}
main()
  .then(() => prisma.$disconnect())
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
