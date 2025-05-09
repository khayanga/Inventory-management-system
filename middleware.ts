import { NextRequest, NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";


const protectedRoutes = ["/users", "/admin", "/client"];
const publicRoutes = [ "/signup", "/"];

export default async function middleware(req: NextRequest) {
    // console.log("Middlware is running")

    const session = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
    const path = req.nextUrl.pathname;
    const isProtectedRoute = protectedRoutes.some(route => path.startsWith(route));
    const isPublicRoute = publicRoutes.includes(path);
    const userRole = session?.role;

    //  console.log({session})
    
    if (isProtectedRoute && !session) {
            return NextResponse.redirect(new URL("/", req.url));
          }

          if (isPublicRoute && session) {
            const redirectPath = userRole === "DUTY_OFFICER" ? "/client" : "/admin";
            
            return NextResponse.redirect(new URL(redirectPath, req.url));
        
        }
    


    return NextResponse.next()
}

export const config = {
    matcher: ["/((?!.+\\.[\\w]+$|_next).*)", "/", "/(api|trpc)(.*)"],
  };

