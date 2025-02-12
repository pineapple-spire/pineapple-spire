import { getServerSession } from 'next-auth';
import { notFound } from 'next/navigation';
import { User } from '@prisma/client';
import authOptions from '@/lib/authOptions';
import { loggedInProtectedPage } from '@/lib/page-protection';
import { prisma } from '@/lib/prisma';
import ChangeRoleForm from '@/components/ChangeRoleForm';

export default async function ChangeRolePage({ params }: { params: { id: string | string[] } }) {
  // Protect the page, only logged in users can access it.
  const session = await getServerSession(authOptions);
  loggedInProtectedPage(
    session as {
      user: { email: string; id: string; randomKey: string };
      // eslint-disable-next-line @typescript-eslint/comma-dangle
    } | null,
  );
  const id = Number(Array.isArray(params?.id) ? params?.id[0] : params?.id);
  // console.log(id);
  const user: User | null = await prisma.user.findUnique({
    where: { id },
  });
  // console.log(stuff);
  if (!user) {
    return notFound();
  }

  return (
    <main>
      <ChangeRoleForm user={user} />
    </main>
  );
}
