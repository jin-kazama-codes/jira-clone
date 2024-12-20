import { NextResponse } from "next/server";
import { type NextRequest } from "next/server";
import { cookies } from "next/headers";

// Adjust the path according to your project structure
export function middleware(request: NextRequest) {
  const cookieStore = cookies();
  const token = cookieStore.get("token")?.value;

  // Define routes that do not require authentication
  const publicPaths = [
    "/login",
    "/forgot-password",
    "/reset-password",
    "/images/karya-io-logo.png",
  ];

  const url = request.nextUrl.clone();
  // Check if the user is authenticated
  if (!token && !publicPaths.includes(request.nextUrl.pathname)) {
    // Redirect to the login page if not authenticated
    return NextResponse.redirect(new URL("/login", request.url));
  }

  // Clone the URL for manipulation

  // Match any URL with a dynamic project key, e.g., /{PROJECT-KEY}/backlog
  const projectKeyPattern =
    /^\/([^/]+)\/(backlog|report(?:\/[^/]+)?|users|issue(?:\/[^/]+)?|roadmap|board|settings|document)/;
  const matchResult = url.pathname.match(projectKeyPattern);

  // If the URL matches the project key pattern
  if (matchResult) {
    const [, projectKey, route] = matchResult;

    // Rewrite the URL to remove {PROJECT-KEY} from the path
    url.pathname = `/${route}`;

    // Pass the project key as a query parameter for use in the app
    url.searchParams.set("projectKey", projectKey);

    // Rewrite to the new URL
    return NextResponse.rewrite(url);
  }

  // Allow the request to proceed if authenticated
  return NextResponse.next();
}

// Specify the paths that this middleware should apply to
export const config = {
  matcher: [
    // Apply to all routes except those specified
    "/((?!api|_next/static|_next/image|favicon.ico).*)",
  ],
};
