import { Navbar } from "@/components/navigation/Navbar";

export default function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Navbar />
      <main className="pb-20 md:pb-0">{children}</main>
    </>
  );
}
