"use client";

import logo from "@/../public/images/logo/logo.svg";
import {
    FileText, LayoutDashboard, Plane, Settings, Users
} from "lucide-react";
import { useSession } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarGroup,
    SidebarGroupLabel,
    SidebarHeader,
    SidebarMenu, SidebarMenuButton, SidebarMenuItem
} from "@/components/ui/sidebar";
import { motion } from "motion/react";

export function AdminAppSidebar() {
  const pathname = usePathname();
  const { data: session } = useSession();
  const isAdmin = session?.user?.role === "admin";

  // Grouped navigation items
  const data = {
    user: {
      name: session?.user?.name || "User",
      email: session?.user?.email || "",
      avatar: "",
      role: session?.user?.role || "agent",
    },
    navMain: [
      {
        title: "Overview",
        url: "/admin",
        icon: LayoutDashboard,
        isActive: pathname === "/admin",
        items: [],
      },
      {
        title: "Leads Management",
        url: "#", // Group header
        icon: FileText,
        isActive: pathname.startsWith("/admin/leads"),
        items: [
          {
            title: "All Leads",
            url: "/admin/leads",
            exact: true,
          },
          // Future: { title: "Kanban View", url: "/admin/leads/kanban" }
        ],
      },
    ],
    navAdmin: isAdmin
      ? [
          {
            title: "Team Management",
            url: "/admin/agents",
            icon: Users,
            isActive: pathname.startsWith("/admin/agents"),
            items: [],
          },
          {
            title: "System Settings",
            url: "/admin/settings",
            icon: Settings,
            isActive: pathname.startsWith("/admin/settings"),
            items: [],
          },
        ]
      : [],
  };

  return (
    <Sidebar variant="inset" collapsible="icon">
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              <Link href="/admin">
                <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-linear-to-br from-emerald-500 to-emerald-700 text-sidebar-primary-foreground shadow-sm">
                  <Plane className="size-4" />
                </div>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <Image
                    src={logo}
                    alt="Budget Travel Packages"
                    width={120}
                    height={50}
                    className="h-8 w-auto object-contain"
                  />
                </div>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      <SidebarContent>
        {/* Main Dashboard */}
        <SidebarGroup>
          <SidebarGroupLabel>Platform</SidebarGroupLabel>
          <SidebarMenu>
            {data.navMain.map((item, index) => (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <SidebarMenuItem>
                  <SidebarMenuButton
                    asChild
                    tooltip={item.title}
                    isActive={item.isActive}
                    className="transition-all duration-200"
                  >
                    <Link
                      href={
                        item.url === "#" ? item.items[0]?.url || "#" : item.url
                      }
                    >
                      <item.icon />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              </motion.div>
            ))}
          </SidebarMenu>
        </SidebarGroup>

        {/* Admin Section */}
        {data.navAdmin.length > 0 && (
          <SidebarGroup>
            <SidebarGroupLabel>Administration</SidebarGroupLabel>
            <SidebarMenu>
              {data.navAdmin.map((item, index) => (
                <motion.div
                  key={item.title}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.2 + index * 0.1 }}
                >
                  <SidebarMenuItem>
                    <SidebarMenuButton
                      asChild
                      tooltip={item.title}
                      isActive={item.isActive}
                      className="transition-all duration-200"
                    >
                      <Link href={item.url}>
                        <item.icon />
                        <span>{item.title}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                </motion.div>
              ))}
            </SidebarMenu>
          </SidebarGroup>
        )}
      </SidebarContent>

      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              size="lg"
              className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
            >
              <Avatar className="h-8 w-8 rounded-lg">
                <AvatarImage src={data.user.avatar} alt={data.user.name} />
                <AvatarFallback className="rounded-lg bg-emerald-600 text-white font-medium">
                  {data.user.name.slice(0, 2).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-semibold">{data.user.name}</span>
                <span className="truncate text-xs capitalize">
                  {data.user.role}
                </span>
              </div>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
