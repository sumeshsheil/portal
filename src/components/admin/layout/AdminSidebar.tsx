"use client";

import logoDark from "@/../public/images/logo/footer-logo.svg";
import logo from "@/../public/images/logo/logo.svg";
import {
    ChevronsUpDown, CreditCard, FileText, HelpCircle, LayoutDashboard, LogOut, Plane, Settings, UserCircle, Users
} from "lucide-react";
import { useSession } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarGroup,
    SidebarGroupLabel,
    SidebarHeader,
    SidebarMenu, SidebarMenuButton, SidebarMenuItem, useSidebar
} from "@/components/ui/sidebar";
import { motion } from "motion/react";
import { signOut } from "next-auth/react";

export function AdminAppSidebar() {
  const pathname = usePathname();
  const { data: session } = useSession();
  const isAdmin = session?.user?.role === "admin";
  const isAgent = session?.user?.role === "agent";
  const { isMobile, state, setOpenMobile } = useSidebar();

  const collapsed = state === "collapsed";
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
        title: "Inquiries",
        url: "#", // Group header
        icon: FileText,
        isActive: pathname.startsWith("/admin/leads"),
        items: [
          {
            title: "All Inquiries",
            url: "/admin/leads",
            exact: true,
          },
          // Future: { title: "Kanban View", url: "/admin/leads/kanban" }
        ],
      },
      ...(isAdmin
        ? [
            {
              title: "Platform Users",
              url: "/admin/customers",
              icon: UserCircle,
              isActive: pathname.startsWith("/admin/customers"),
              items: [],
            },
            {
              title: "Leads",
              url: "/admin/contacts",
              icon: Users,
              isActive: pathname.startsWith("/admin/contacts"),
              items: [],
            },
          ]
        : []),
      ...(isAgent
        ? [
            {
              title: "Leads",
              url: "/admin/contacts",
              icon: UserCircle,
              isActive: pathname.startsWith("/admin/contacts"),
              items: [],
            },
            {
              title: "Finance & Earnings",
              url: "/admin/finance",
              icon: CreditCard,
              isActive: pathname.startsWith("/admin/finance"),
              items: [],
            },
            {
              title: "Subscription",
              url: "/admin/subscription",
              icon: CreditCard,
              isActive: pathname === "/admin/subscription",
              items: [],
            },
            {
              title: "Help",
              url: "/admin/help",
              icon: HelpCircle,
              isActive: pathname === "/admin/help",
              items: [],
            },
          ]
        : []),
    ],
    navAdmin: isAdmin
      ? [
          {
            title: "Finance & Earnings",
            url: "/admin/finance",
            icon: Plane, // Reusing Plane for now as a generic icon, can be changed
            isActive: pathname.startsWith("/admin/finance"),
            items: [],
          },
          {
            title: "Team Management",
            url: "/admin/agents",
            icon: Users,
            isActive: pathname.startsWith("/admin/agents"),
            items: [],
          },
          {
            title: "Subscriptions",
            url: "/admin/subscriptions",
            icon: CreditCard,
            isActive: pathname.startsWith("/admin/subscriptions"),
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
              <Link
                href="/admin"
                onClick={() => isMobile && setOpenMobile(false)}
              >
                {collapsed ? (
                  <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-linear-to-br from-emerald-500 to-emerald-700 text-sidebar-primary-foreground shadow-sm">
                    <Plane className="size-4" />
                  </div>
                ) : (
                  <div className="grid flex-1 text-left text-sm leading-tight">
                    <Image
                      src={logo}
                      alt="Budget Travel Packages"
                      width={120}
                      height={50}
                      className="h-8 w-auto object-contain hidden dark:block"
                    />
                    <Image
                      src={logoDark}
                      alt="Budget Travel Packages"
                      width={120}
                      height={50}
                      className="h-8 w-auto object-contain block dark:hidden"
                    />
                  </div>
                )}
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
                      onClick={() => isMobile && setOpenMobile(false)}
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
                      <Link
                        href={item.url}
                        onClick={() => isMobile && setOpenMobile(false)}
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
        )}
      </SidebarContent>

      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
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
                    <span className="truncate font-semibold">
                      {data.user.name}
                    </span>
                    <span className="truncate text-xs capitalize">
                      {data.user.role === "agent" ? "Travel Partner" : data.user.role}
                    </span>
                  </div>
                  <ChevronsUpDown className="ml-auto size-4" />
                </SidebarMenuButton>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg"
                side="bottom"
                align="end"
                sideOffset={4}
              >
                <DropdownMenuItem asChild>
                  {isAdmin ? (
                    <Link href="/admin/settings" className="flex items-center gap-2">
                    <Settings className="size-4" />
                    <span>System Settings</span>
                  </Link>
                  ) : (
                    <Link href="/admin/profile" className="flex items-center gap-2">
                    <UserCircle className="size-4" />
                    <span>View Profile</span>
                  </Link>
                  )}
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  className="text-red-600 focus:text-red-700 focus:bg-red-50 dark:focus:bg-red-950/30"
                  onClick={() => signOut({ callbackUrl: "/" })}
                >
                  <LogOut className="mr-2 size-4" />
                  Log out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
