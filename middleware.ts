import { NextRequest, NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";


const protectedRoutes = ["/users", "/admin", "/client"];
const publicRoutes = ["/signin", "/signup", "/"];

export default async function middleware(req: NextRequest) {
    console.log("Middlware is running")

    const session = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
    const path = req.nextUrl.pathname;
    const isProtectedRoute = protectedRoutes.some(route => path.startsWith(route));
    const isPublicRoute = publicRoutes.includes(path);
    const userRole = session?.role;

     console.log({session})
    if (session) {
        console.log("Session exists")
    } else {
        console.log("Session does not exist")


    }

    

    if (isProtectedRoute && !session) {
            return NextResponse.redirect(new URL("/signin", req.url));
          }

          if (isPublicRoute && session) {
            const redirectPath = userRole === "Client" ? "/client" : "/admin";
            
            return NextResponse.redirect(new URL(redirectPath, req.url));
        }
    


    return NextResponse.next()
}

export const config = {
    matcher: ["/((?!.+\\.[\\w]+$|_next).*)", "/", "/(api|trpc)(.*)"],
  };

