"use client";

import SkypeSidebar from "../sidebar/page";

export default function MessageLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <SkypeSidebar />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col">{children}</div>
    </div>
  );
}
