import { AdminProviders } from "@/components/admin/AdminProviders";
import { InactivityTracker } from "@/components/admin/InactivityTracker";
import { AdminHeader } from "@/components/admin/layout/AdminHeader";
import { AdminAppSidebar } from "@/components/admin/layout/AdminSidebar";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { Metadata } from "next";
import React from "react";

export const metadata: Metadata = {
  robots: {
    index: false,
    follow: false,
  },
};

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AdminProviders>
      <SidebarProvider className="admin-panel font-sans antialiased">
        <InactivityTracker />
        <AdminAppSidebar />
        <SidebarInset>
          <AdminHeader />
          <main className="flex-1 p-4 md:p-6 overflow-y-auto w-full">
            {children}
          </main>
        </SidebarInset>
      </SidebarProvider>
    </AdminProviders>
  );
}
