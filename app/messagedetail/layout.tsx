import SkypeSidebar from "../sidebar/page";

export default function MessageLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex w-full h-screen">
      <SkypeSidebar />
      <div className="flex-1">{children}</div>
    </div>
  );
}
