import { AdminSidebar } from "../layout/adminsidebar.";
import Header from "../layout/header";
import Footer from "../layout/Footer";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Header />
      <div className="flex min-h-[calc(100vh-4rem)]">
        <AdminSidebar />
        <main className="flex-1 p-6 bg-background">{children}</main>
      </div>
      <Footer />
    </>
  );
}
