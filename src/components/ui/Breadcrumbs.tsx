"use client";

import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator
} from "@/components/ui/breadcrumb";
import { Home } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import * as React from "react";

export function Breadcrumbs() {
  const pathname = usePathname();
  
  // Don't show on admin login page or dashboard root
  if (pathname === "/" || pathname === "/admin") return null;

  const pathSegments = pathname.split("/").filter((segment) => segment !== "");

  return (
    <Breadcrumb className="mb-6">
      <BreadcrumbList>
        <BreadcrumbItem>
          <BreadcrumbLink asChild>
            <Link href="/admin" className="flex items-center gap-1">
              <Home className="h-3 w-3" />
              <span>Admin</span>
            </Link>
          </BreadcrumbLink>
        </BreadcrumbItem>
        {pathSegments.map((segment, index) => {
          // Skip 'admin' segment since we added it as root
          if (segment === "admin") return null;
          
          const href = `/${pathSegments.slice(0, index + 1).join("/")}`;
          const isLast = index === pathSegments.length - 1;
          
          // Basic ID detection to avoid showing raw IDs in breadcrumbs
          const isId = /^[0-9a-fA-F]{24}$/.test(segment);
          const label = isId 
            ? "Details" 
            : segment
              .replace(/-/g, " ")
              .replace(/\b\w/g, (l) => l.toUpperCase());

          return (
            <React.Fragment key={href}>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                {isLast ? (
                  <BreadcrumbPage>{label}</BreadcrumbPage>
                ) : (
                  <BreadcrumbLink asChild>
                    <Link href={href}>{label}</Link>
                  </BreadcrumbLink>
                )}
              </BreadcrumbItem>
            </React.Fragment>
          );
        })}
      </BreadcrumbList>
    </Breadcrumb>
  );
}
