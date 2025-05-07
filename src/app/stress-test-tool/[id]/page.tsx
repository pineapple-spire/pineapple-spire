import { prisma } from '@/lib/prisma';
import Link from 'next/link';
import { notFound } from 'next/navigation';

interface StressScenarioPageProps {
  params: { id: string };
}

export default async function StressScenarioPage({ params }: StressScenarioPageProps) {
  const id = parseInt(params.id, 10);
  const scenario = await prisma.stressScenario.findUnique({ where: { id } });
  if (!scenario) notFound();

  return (
    <div
      style={{
        maxWidth: '800px',
        margin: '0 auto',
        padding: '2rem',
        fontFamily: 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
        color: '#1a1a1a',
      }}
    >
      <nav style={{ marginBottom: '1.5rem' }}>
        <Link
          href="/stress-test-tool"
          style={{
            textDecoration: 'none',
            color: '#555',
            fontSize: '0.9rem',
          }}
        >
          ← All Stress Tests
        </Link>
      </nav>

      <header style={{ marginBottom: '1rem' }}>
        <h1 style={{ fontSize: '2.25rem', margin: 0, lineHeight: 1.2 }}>
          {scenario.title}
        </h1>
      </header>

      <article
        style={{
          background: '#fff',
          borderRadius: '8px',
          padding: '1.5rem',
          boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
          lineHeight: 1.6,
        }}
      >
        <p style={{ marginBottom: '1.5rem', color: '#333' }}>
          {scenario.description}
        </p>

        {scenario.excelWorkbookUrl && (
          <Link href={scenario.excelWorkbookUrl} legacyBehavior>
            <a
              target="_blank"
              href="{scenario.excelWorkbookUrl}"
              rel="noopener noreferrer"
              style={{
                display: 'inline-block',
                padding: '0.75rem 1.25rem',
                backgroundColor: '#0070f3',
                color: '#fff',
                borderRadius: '4px',
                textDecoration: 'none',
                fontWeight: 500,
              }}
            >
              Open Stress Test Workbook
            </a>
          </Link>
        )}
      </article>
    </div>
  );
}
