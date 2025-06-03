import { NextResponse } from "next/server";
import { authMiddleware } from "./middlewares/api/authMiddleware";
import { logMiddleware } from "./middlewares/api/logMiddleware";

// Match and work from api folder
export const config = {
  matcher: "/api/:path",
};

export default function middleware(request: Request) {
  const authResult = authMiddleware(request);

  if (request.url.includes("/api/blogs")) {
    const logResult = logMiddleware(request);
    console.log(logResult.response);
  }

  // Adding checks being specific of the blog to assign middleware to || remove to catch all api request
  if (!authResult?.isValid && request.url.includes("/api/blogs")) {
    return new NextResponse(JSON.stringify({ message: "Unauthorized" }), {
      // Status code 401 for unauthorized
      status: 401,
    });
  }
  return NextResponse.next();
}
