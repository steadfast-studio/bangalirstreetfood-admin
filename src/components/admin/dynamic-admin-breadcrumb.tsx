"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Fragment } from "react";

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";

const HIDDEN_SEGMENTS = new Set(["admin"]);

function isLikelyDynamicSegment(segment: string) {
  if (/^[0-9]+$/.test(segment)) {
    return true;
  }

  // Treat UUID-like segments as dynamic IDs and hide them from breadcrumbs.
  if (/^[0-9a-fA-F-]{16,}$/.test(segment)) {
    return true;
  }

  return false;
}

function toLabel(segment: string) {
  return segment
    .split("-")
    .filter(Boolean)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

export function DynamicAdminBreadcrumb() {
  const pathname = usePathname();
  const pathSegments = pathname.split("/").filter(Boolean);
  const items: Array<{ href: string; label: string }> = [];

  pathSegments.forEach((segment, index) => {
    if (HIDDEN_SEGMENTS.has(segment) || isLikelyDynamicSegment(segment)) {
      return;
    }

    items.push({
      href: `/${pathSegments.slice(0, index + 1).join("/")}`,
      label: toLabel(segment),
    });
  });

  return (
    <Breadcrumb>
      <BreadcrumbList>
        <BreadcrumbItem className={items.length > 0 ? "hidden md:block" : ""}>
          {items.length > 0 ? (
            <BreadcrumbLink asChild>
              <Link href="/admin">Admin</Link>
            </BreadcrumbLink>
          ) : (
            <BreadcrumbPage>Admin</BreadcrumbPage>
          )}
        </BreadcrumbItem>

        {items.length > 0 && (
          <BreadcrumbSeparator className="hidden md:block" />
        )}

        {items.map((item, index) => {
          const isLast = index === items.length - 1;

          return (
            <Fragment key={item.href}>
              <BreadcrumbItem>
                {isLast ? (
                  <BreadcrumbPage>{item.label}</BreadcrumbPage>
                ) : (
                  <BreadcrumbLink asChild>
                    <Link href={item.href}>{item.label}</Link>
                  </BreadcrumbLink>
                )}
              </BreadcrumbItem>
              {!isLast && <BreadcrumbSeparator />}
            </Fragment>
          );
        })}
      </BreadcrumbList>
    </Breadcrumb>
  );
}
