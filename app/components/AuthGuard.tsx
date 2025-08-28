"use client";

import { useEffect, ReactNode } from "react";
import { useRouter, usePathname } from "next/navigation";
import useUser from "@/app/zustand/useUser";

interface AuthGuardProps {
  children: ReactNode;
}

const AuthGuard = ({ children }: AuthGuardProps) => {
  const router = useRouter();
  const pathname = usePathname();
  const { user } = useUser();

  // Public routes that don't require authentication
  const publicRoutes = ["/login", "/signup", "/forgot-password ", "/otpvarify"];
  const isPublicRoute = publicRoutes.includes(pathname);

  useEffect(() => {
    // Only run auth check after component mounts (client-side)
    const checkAuth = () => {
      const hasToken = user?.token && user.token.trim() !== "";

      if (!hasToken && !isPublicRoute) {
        // User is not authenticated and trying to access protected route
        router.push("/login");
      } else if (hasToken && pathname === "/login") {
        // User is authenticated but on login page, redirect to dashboard
        router.push("/"); // or your main app route
      }
    };

    checkAuth();
  }, [user?.token, pathname, router, isPublicRoute]);

  // Show loading or nothing while redirecting
  if (!user?.token && !isPublicRoute) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p>Checking authentication...</p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
};

export default AuthGuard;
