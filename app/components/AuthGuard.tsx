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

  const publicRoutes = [
    "/login",
    "/signup",
    "/forgot-password",
    "/otpvarify",
    "/change-password",
  ];
  const isPublicRoute = publicRoutes.includes(pathname);

  useEffect(() => {
    const checkAuth = () => {
      const hasToken = user?.token && user.token.trim() !== "";

      if (!hasToken && !isPublicRoute) {
        router.push("/login");
      } else if (hasToken && pathname === "/login") {
        router.push("/");
      }
    };

    checkAuth();
  }, [user?.token, pathname, router, isPublicRoute]);

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
