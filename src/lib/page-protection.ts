import { redirect } from 'next/navigation';
import { Role } from '@prisma/client';

type Session = { user: { email: string; id: string; randomKey: Role } } | null;

/**
 * Shared guard:
 *  - if no session -> redirect to sign-in
 *  - if allowedRoles is non-empty and user's role isn't in it -> redirect to not-authorized
 */
function protectedPage(session: Session, allowedRoles: Role[] = []): void {
  if (!session) {
    redirect('/auth/signin');
  }
  if (allowedRoles.length > 0 && !allowedRoles.includes(session.user.randomKey)) {
    redirect('/not-authorized');
  }
}

/**
 * Redirects to the login page if the user is not logged in.
 */
export const loggedInProtectedPage = (session: Session): void => {
  protectedPage(session);
};

/**
 * Redirects to the login page if the user is not logged in.
 * Redirects to the not-authorized page if the user is not an admin.
 */
export const adminProtectedPage = (session: Session): void => {
  protectedPage(session, [Role.ADMIN]);
};

/**
 * Redirects to the login page if the user is not logged in.
 * Redirects to the not-authorized page if the user is not an auditor.
 */
export const auditorProtectedPage = (session: Session): void => {
  protectedPage(session, [Role.AUDITOR]);
};

/**
 * Redirects to the login page if the user is not logged in.
 * Redirects to the not-authorized page if the user has the USER role.
 */
export const notUserProtectedPage = (session: Session): void => {
  // Only ADMIN and AUDITOR pass
  protectedPage(session, [Role.ADMIN, Role.AUDITOR]);
};
