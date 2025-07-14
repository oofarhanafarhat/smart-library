import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server';

const isProtectedRoute = createRouteMatcher([
  '/admin(.*)', // Protect /admin and subroutes
]);

export default clerkMiddleware(async (auth, req) => {
  if (isProtectedRoute(req)) {
    await auth.protect();
  }
});

export const config = {
  matcher: [
    '/((?!_next|\\.).*)',  // exclude _next and static files
    '/(api|trpc)(.*)',     // match api and trpc routes and subpaths
  ],
};
