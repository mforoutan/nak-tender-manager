import { NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';
import { redirect } from 'next/navigation';

export default async function ParticipateLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ slug: string }>;
}) {
  const session = await getSession();
  const { slug } = await params;

  // Check if user is authenticated
  if (!session) {
    redirect('/auth');
  }

  // Check if account is verified
  const isVerified = session.accountVerificationTask?.status === 'COMPLETED';

  if (!isVerified) {
    // Redirect back to detail page if not verified
    redirect(`/dashboard/pr/${slug}`);
  }

  return <>{children}</>;
}
