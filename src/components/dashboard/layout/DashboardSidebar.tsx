"use client";

import logo from "@/../public/images/logo/footer-logo.svg";
import logoDark from "@/../public/images/logo/logo.svg";
import { Home, Plane, UserIcon } from "lucide-react";
import { useSession } from "next-auth/react";
import { useTheme } from "next-themes";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarGroup,
    SidebarGroupLabel,
    SidebarHeader,
    SidebarMenu, SidebarMenuButton, SidebarMenuItem, useSidebar
} from "@/components/ui/sidebar";
import { cn } from "@/lib/utils";
import { AnimatePresence, motion } from "motion/react";

export function DashboardSidebar() {
  const pathname = usePathname();
  const { data: session } = useSession();
  const { state, isMobile, setOpenMobile } = useSidebar();
  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const isDark = mounted && resolvedTheme === "dark";

  const user = {
    name: session?.user?.name || "Guest",
    email: session?.user?.email || "",
  };

  const navItems = [
    {
      title: "Overview",
      url: "/dashboard",
      icon: Home,
      isActive: pathname === "/dashboard",
    },
    {
      title: "My Bookings",
      url: "/dashboard/bookings",
      icon: Plane,
      isActive: pathname.startsWith("/dashboard/bookings"),
    },
    {
      title: "Profile",
      url: "/dashboard/profile",
      icon: UserIcon,
      isActive: pathname.startsWith("/dashboard/profile"),
    },
  ];

  const isCollapsed = state === "collapsed";

  const handleLinkClick = () => {
    if (isMobile) {
      setOpenMobile(false);
    }
  };

  return (
    <Sidebar variant="inset" collapsible="icon">
      {/* Logo Header */}
      <SidebarHeader className="pb-4">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              size="lg"
              asChild
              className="hover:bg-transparent"
            >
              <Link
                href="/dashboard"
                className="flex items-center"
                onClick={handleLinkClick}
              >
                <AnimatePresence mode="wait" initial={false}>
                  {isCollapsed ? (
                    <motion.div
                      key="icon"
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.8 }}
                      transition={{ duration: 0.2 }}
                      className="flex aspect-square size-9 items-center justify-center rounded-xl bg-linear-to-br from-emerald-400 to-emerald-700 text-white shadow-lg shadow-emerald-500/30"
                    >
                      <Plane className="size-4" />
                    </motion.div>
                  ) : (
                    <motion.div
                      key="logo"
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -10 }}
                      transition={{ duration: 0.2 }}
                      className="flex flex-1 items-center py-1"
                    >
                      {isDark ? (
                        <Image
                          src={logoDark}
                          alt="Budget Travel Packages"
                          width={180}
                          height={60}
                          className="h-10 w-auto object-contain"
                          priority
                        />
                      ) : (
                        <Image
                          src={logo}
                          alt="Budget Travel Packages"
                          width={180}
                          height={60}
                          className="h-10 w-auto object-contain"
                          priority
                        />
                      )}
                    </motion.div>
                  )}
                </AnimatePresence>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>

        {/* Subtle divider */}
        {!isCollapsed && (
          <div className="mx-3 h-px bg-linear-to-r from-transparent via-emerald-500/30 to-transparent mt-2" />
        )}
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          {!isCollapsed && (
            <SidebarGroupLabel className="text-[10px] font-bold uppercase tracking-[0.15em] text-slate-500 dark:text-slate-600 mb-1 px-3">
              Navigation
            </SidebarGroupLabel>
          )}
          <SidebarMenu className="gap-1">
            {navItems.map((item, index) => (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, x: -12 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.08, duration: 0.3 }}
              >
                <SidebarMenuItem>
                  <SidebarMenuButton
                    asChild
                    tooltip={item.title}
                    isActive={item.isActive}
                    className={cn(
                      "relative transition-all duration-200 rounded-xl mx-1 py-5 group",
                      item.isActive
                        ? "bg-emerald-500/10 dark:bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 hover:bg-emerald-500/15 dark:hover:bg-emerald-500/20"
                        : "text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800/60 hover:text-slate-900 dark:hover:text-white",
                    )}
                  >
                    <Link
                      href={item.url}
                      className="flex items-center gap-3 px-1"
                      onClick={handleLinkClick}
                    >
                      {/* Active indicator bar */}
                      {item.isActive && (
                        <motion.div
                          layoutId="activeBar"
                          className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-emerald-500 rounded-r-full shadow-[0_0_8px_rgba(16,185,129,0.6)]"
                          transition={{
                            type: "spring",
                            bounce: 0.3,
                            duration: 0.4,
                          }}
                        />
                      )}
                      <item.icon
                        className={cn(
                          "size-5 shrink-0 transition-all duration-200",
                          item.isActive
                            ? "text-emerald-600 dark:text-emerald-400"
                            : "text-slate-500 dark:text-slate-500 group-hover:text-slate-700 dark:group-hover:text-slate-300",
                        )}
                      />
                      <span
                        className={cn(
                          "text-sm font-semibold tracking-wide transition-colors duration-200",
                          item.isActive
                            ? "text-emerald-700 dark:text-emerald-300"
                            : "group-hover:text-slate-900 dark:group-hover:text-white",
                        )}
                      >
                        {item.title}
                      </span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              </motion.div>
            ))}
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>

      {/* Footer — User Info */}
      <SidebarFooter className="pb-2">
        {!isCollapsed && (
          <div className="mx-2 h-px bg-linear-to-r from-transparent via-slate-200 dark:via-slate-700 to-transparent mb-2" />
        )}
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              size="lg"
              className={cn(
                "rounded-xl mx-1 transition-all duration-200",
                "bg-slate-50 dark:bg-slate-800/60 hover:bg-slate-100 dark:hover:bg-slate-800",
                "border border-slate-200 dark:border-slate-700/50",
              )}
            >
              <Avatar className="h-8 w-8 rounded-lg shrink-0">
                <AvatarFallback className="rounded-lg bg-linear-to-br from-emerald-500 to-emerald-700 text-white font-bold text-sm shadow-md shadow-emerald-500/20">
                  {user.name.slice(0, 2).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div className="grid flex-1 text-left text-sm leading-tight ml-1 min-w-0">
                <span className="truncate font-bold text-slate-900 dark:text-white text-sm">
                  {user.name}
                </span>
                <span className="truncate text-xs text-slate-500 dark:text-slate-400">
                  {user.email}
                </span>
              </div>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
