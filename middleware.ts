import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server';
// By default, no route is protected by sign in. 
// The developer must specify which routes are protected
// in this project, we are specifying which routes are not protected, but using a "!" to indicate that everything else is protected as done in line 9
// in other words, we are saying this route is not a public route (!isPublicRoute) we use auth().protect() on it
const isPublicRoute = createRouteMatcher(['/sign-in(.*)', '/sign-up(.*)', '/'])

export default clerkMiddleware((auth, request) => {
    if(!isPublicRoute(request)) {
      auth().protect();
    } 
  }, { debug: true });

export const config = {
  matcher: ['/((?!.*\\..*|_next).*)', '/', '/(api|trpc)(.*)'],
};