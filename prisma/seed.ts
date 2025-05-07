import { PrismaClient, Role } from '@prisma/client';
import { hash } from 'bcrypt';
import config from '../config/settings.development.json';

const prisma = new PrismaClient();

const roleMap: Record<string, Role> = {
  ADMIN: 'ADMIN',
  AUDITOR: 'AUDITOR',
  ANALYST: 'ANALYST',
  EXECUTIVE: 'EXECUTIVE',
  USER: 'USER',
};

async function seedUsers() {
  const passwordHash = await hash('changeme', 10);
  console.log('Seeding users...');
  const ops = config.defaultAccounts.map(account => {
    const key = account.role ?? 'USER';
    const role: Role = roleMap[key] ?? 'USER';
    console.log(`  Upserting user ${account.email} as ${role}`);
    return prisma.user.upsert({
      where: { email: account.email },
      update: {},
      create: {
        email: account.email,
        password: passwordHash,
        role,
      },
    });
  });
  await Promise.all(ops);
}

async function seedContactUs() {
  console.log('Seeding Contact Us messages...');
  const ops = config.defaultContactUsMsgs.map(msg => prisma.contactUsData.upsert({
    where: { id: msg.id },
    update: {},
    create: {
      id: msg.id,
      email: msg.email,
      message: msg.message,
    },
  }));
  await Promise.all(ops);
}

async function seedReportAProblem() {
  console.log('Seeding Report a Problem messages...');
  const ops = config.defaultReportAProblemMsgs.map(msg => prisma.reportPageData.upsert({
    where: { id: msg.id },
    update: {},
    create: {
      id: msg.id,
      email: msg.email,
      problem: msg.problem,
    },
  }));
  await Promise.all(ops);
}

async function seedFinancialData() {
  console.log('Seeding financial base data...');
  const ops = config.defaultData.map(data => prisma.financialData.upsert({
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
  }));
  await Promise.all(ops);
}

async function seedStressScenarios() {
  console.log('Seeding base stress scenarios...');
  const ops = config.defaultScenarios.map(scenario => prisma.stressScenario.upsert({
    where: { id: scenario.id },
    update: {},
    create: {
      id: scenario.id,
      title: scenario.title,
      description: scenario.description,
      excelWorkbookUrl: scenario.excelWorkbookUrl,
    },
  }));
  await Promise.all(ops);
}

async function seedStressTestVersions() {
  console.log('Seeding FSM stress-test versions...');

  // StressTest1 versions
  await prisma.stressTest1Scenario.upsert({
    where: { id: 1 },
    update: {},
    create: {
      id: 1,
      title: 'Baseline 30% Drop',
      data: {
        presentValue: 50000,
        interestRate: 4.2,
        term: 30,
        monthlyContribution: 1000,
        dropRate: 30,
      },
    },
  });
  await prisma.stressTest1Scenario.upsert({
    where: { id: 2 },
    update: {},
    create: {
      id: 2,
      title: 'Aggressive 50% Drop',
      data: {
        presentValue: 75000,
        interestRate: 5.0,
        term: 25,
        monthlyContribution: 500,
        dropRate: 50,
      },
    },
  });
  await prisma.stressTest1Scenario.upsert({
    where: { id: 3 },
    update: {},
    create: {
      id: 3,
      title: 'Mild 10% Drop',
      data: {
        presentValue: 60000,
        interestRate: 3.8,
        term: 20,
        monthlyContribution: 800,
        dropRate: 10,
      },
    },
  });

  // StressTest2 version
  await prisma.stressTest2Scenario.upsert({
    where: { id: 1 },
    update: {},
    create: {
      id: 1,
      title: '2.25% Revenue Drop',
      initialPercent: 2.25,
      baseRevenue: 153034,
      growthRate: 0.015,
      startYear: 2025,
      totalYears: 5,
    },
  });

  // StressTest3 version
  await prisma.stressTest3Scenario.upsert({
    where: { id: 1 },
    update: {},
    create: {
      id: 1,
      title: 'One-Time $50k Event',
      annualRate: 6.02,
      events: [{ year: 2027, amount: 50000 }],
    },
  });

  // StressTest4 version
  await prisma.stressTest4Scenario.upsert({
    where: { id: 1 },
    update: {},
    create: {
      id: 1,
      title: '2.5% Expense Growth',
      initialExpense: 52589,
      increaseRate: 2.5,
      returnRate: 6.02,
    },
  });

  // StressTest5 version
  await prisma.stressTest5Scenario.upsert({
    where: { id: 1 },
    update: {},
    create: {
      id: 1,
      title: 'Bond Return Hit by Inflation',
      presentValue: 5000,
      interestRate: 6.0,
      term: 10,
      fullyFunded: 100,
      contributions: Array.from({ length: 10 }, (_, i) => ({
        year: 2025 + i,
        contribution: i === 5 ? 1000 : 0,
      })),
    },
  });

  const tablesToResetIndexFor = [
    'StressTest1Scenario',
    'StressTest2Scenario',
    'StressTest3Scenario',
    'StressTest4Scenario',
    'StressTest5Scenario',
    'StressScenario',
    'report_page_data',
    'contact_us_data',
  ];

  await Promise.all(
    tablesToResetIndexFor.map((table) => prisma.$executeRawUnsafe(`
      SELECT setval(
        pg_get_serial_sequence('"public"."${table}"','id'),
        COALESCE((SELECT MAX(id) FROM "public"."${table}"), 1)
      );
    `)),
  );
}

async function main() {
  console.log('Starting database seed...');
  await seedUsers();
  await seedContactUs();
  await seedReportAProblem();
  await seedFinancialData();
  await seedStressScenarios();
  await seedStressTestVersions();
  console.log('Database seed completed successfully.');
}

main()
  .catch((e) => {
    console.error('Seed error:', e);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
