import { UserDashboardHeader } from "@/components/dashboard_component/UserDashboardHeader";
import { UserDashboardSidebar } from "@/components/dashboard_component/UserDashboardSidebar";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex h-screen overflow-hidden">
      <UserDashboardSidebar />
      <div className="flex flex-col flex-1 min-w-0 overflow-hidden">
        <UserDashboardHeader />
        <main className="flex-1 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
}