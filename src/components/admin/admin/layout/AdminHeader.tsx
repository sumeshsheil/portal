"use client";

import {
    getUnreadNotifications,
    markAllNotificationsRead,
    markNotificationRead,
    type NotificationItem
} from "@/app/admin/(dashboard)/actions";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator
} from "@/components/ui/breadcrumb";
import { Button } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { ModeToggle } from "@/components/ui/mode-toggle";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { format } from "date-fns";
import {
    AlertCircle, AlertTriangle, Bell, CheckCircle2, Info, LogOut,
    User
} from "lucide-react";
import { signOut, useSession } from "next-auth/react";
import { usePathname, useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { toast } from "sonner";

const NOTIFICATION_ICONS = {
  info: Info,
  success: CheckCircle2,
  warning: AlertTriangle,
  error: AlertCircle,
};

const NOTIFICATION_COLORS = {
  info: "text-blue-500",
  success: "text-green-500",
  warning: "text-amber-500",
  error: "text-red-500",
};

export function AdminHeader() {
  const { data: session } = useSession();
  const user = session?.user;
  const router = useRouter();
  const pathname = usePathname();

  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch notifications on mount
  useEffect(() => {
    if (session?.user) {
      getUnreadNotifications()
        .then(setNotifications)
        .catch((err) => console.error("Failed to fetch notifications:", err))
        .finally(() => setLoading(false));
    }
  }, [session]);

  const handleMarkAllRead = async () => {
    const previous = [...notifications];
    setNotifications([]); // Optimistic update
    try {
      await markAllNotificationsRead();
      toast.success("All notifications marked as read");
    } catch {
      setNotifications(previous);
      toast.error("Failed to mark all as read");
    }
  };

  const handleNotificationClick = async (notification: NotificationItem) => {
    // Optimistic removal from list
    setNotifications((prev) => prev.filter((n) => n._id !== notification._id));
    try {
      await markNotificationRead(notification._id);
      if (notification.link) {
        router.push(notification.link);
      }
    } catch (err) {
      console.error("Failed to mark read", err);
    }
  };

  const initials = user?.name
    ? user.name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2)
    : "U";

  // Breadcrumbs generation
  const paths = pathname?.split("/").filter((p) => p) || [];
  const breadcrumbs = paths.map((path, index) => {
    const href = `/${paths.slice(0, index + 1).join("/")}`;
    const label = path.charAt(0).toUpperCase() + path.slice(1);
    const isLast = index === paths.length - 1;
    return { href, label, isLast };
  });

  return (
    <header className="flex h-16 shrink-0 items-center justify-between gap-2 px-4 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12 bg-background/50 backdrop-blur-md sticky top-0 z-10 border-b border-sidebar-border/50">
      <div className="flex items-center gap-2">
        <SidebarTrigger className="-ml-1" />
        <Separator orientation="vertical" className="mr-2 h-4" />
        <Breadcrumb className="hidden md:block">
          <BreadcrumbList>
            <BreadcrumbItem className="hidden md:block">
              <BreadcrumbLink href="/admin">Dashboard</BreadcrumbLink>
            </BreadcrumbItem>
            {breadcrumbs.length > 1 && (
              <BreadcrumbSeparator className="hidden md:block" />
            )}
            {breadcrumbs.slice(1).map((item) => (
              <React.Fragment key={item.href}>
                <BreadcrumbItem>
                  {item.isLast ? (
                    <BreadcrumbPage>{item.label}</BreadcrumbPage>
                  ) : (
                    <BreadcrumbLink href={item.href}>
                      {item.label}
                    </BreadcrumbLink>
                  )}
                </BreadcrumbItem>
                {!item.isLast && <BreadcrumbSeparator />}
              </React.Fragment>
            ))}
          </BreadcrumbList>
        </Breadcrumb>
      </div>

      <div className="flex items-center gap-2">
        <ModeToggle />

        {/* Notifications Dropdown */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="relative text-muted-foreground hover:text-foreground"
            >
              <Bell className="h-5 w-5" />
              {notifications.length > 0 && (
                <span className="absolute top-2.5 right-2.5 h-2 w-2 rounded-full bg-red-500 border border-background animate-pulse" />
              )}
              <span className="sr-only">Notifications</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-80" align="end" forceMount>
            <div className="flex items-center justify-between px-4 py-2 border-b">
              <span className="font-semibold text-sm">Notifications</span>
              {notifications.length > 0 && (
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-auto px-2 py-1 text-xs text-muted-foreground hover:text-foreground"
                  onClick={(e) => {
                    e.preventDefault();
                    handleMarkAllRead();
                  }}
                >
                  Mark all read
                </Button>
              )}
            </div>
            <ScrollArea className="h-[300px]">
              {loading ? (
                <div className="p-8 text-center text-muted-foreground text-sm">
                  Loading...
                </div>
              ) : notifications.length === 0 ? (
                <div className="flex flex-col items-center justify-center p-8 text-center text-muted-foreground">
                  <Bell className="h-8 w-8 mb-2 opacity-50" />
                  <p className="text-sm">No new notifications</p>
                </div>
              ) : (
                <div className="py-1">
                  {notifications.map((notification) => {
                    const Icon =
                      NOTIFICATION_ICONS[notification.type] ||
                      NOTIFICATION_ICONS.info;

                    return (
                      <DropdownMenuItem
                        key={notification._id}
                        className="flex items-start gap-3 p-3 cursor-pointer focus:bg-accent focus:text-accent-foreground"
                        onClick={() => handleNotificationClick(notification)}
                      >
                        <div
                          className={`mt-0.5 ${NOTIFICATION_COLORS[notification.type]}`}
                        >
                          <Icon className="h-4 w-4" />
                        </div>
                        <div className="flex-1 space-y-1">
                          <p className="text-sm font-medium leading-none">
                            {notification.title}
                          </p>
                          <p className="text-xs text-muted-foreground line-clamp-2">
                            {notification.message}
                          </p>
                          <p className="text-[10px] text-muted-foreground pt-1">
                            {format(
                              new Date(notification.createdAt),
                              "MMM d, h:mm a",
                            )}
                          </p>
                        </div>
                        {!notification.isRead && (
                          <span className="h-2 w-2 rounded-full bg-blue-500 mt-1.5 shrink-0" />
                        )}
                      </DropdownMenuItem>
                    );
                  })}
                </div>
              )}
            </ScrollArea>
          </DropdownMenuContent>
        </DropdownMenu>

        {/* User Dropdown */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="relative h-9 w-9 rounded-full">
              <Avatar className="h-9 w-9 border border-border">
                <AvatarImage src="" alt={user?.name || "User"} />
                <AvatarFallback className="bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-medium">
                  {initials}
                </AvatarFallback>
              </Avatar>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-56" align="end" forceMount>
            <DropdownMenuLabel className="font-normal">
              <div className="flex flex-col space-y-1">
                <p className="text-sm font-medium leading-none">{user?.name}</p>
                <p className="text-xs leading-none text-muted-foreground">
                  {user?.email}
                </p>
                <span className="inline-flex items-center rounded-full border border-emerald-200 bg-emerald-50 px-2 py-0.5 text-xs font-semibold text-emerald-700 w-fit mt-1 capitalize">
                  {user?.role}
                </span>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem>
              <User className="mr-2 h-4 w-4" />
              <span>Profile</span>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={() => signOut({ callbackUrl: "/" })}
              className="text-red-600 focus:text-red-600 focus:bg-red-50"
            >
              <LogOut className="mr-2 h-4 w-4" />
              <span>Log out</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
