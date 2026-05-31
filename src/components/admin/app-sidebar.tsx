"use client";

import * as React from "react";
import { Mountain, PieChart } from "lucide-react";

import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar";
import { SidebarItems } from "./sidebar-items";

// This is sample data.
const data = {
  travel: [
    {
      name: "Packages",
      url: "/packages",
      icon: Mountain,
    },
    {
      name: "Bookings",
      url: "/bookings",
      icon: PieChart,
    },
  ],
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar variant="floating" collapsible="offcanvas" {...props}>
      <SidebarHeader>{/* <TeamSwitcher teams={data.teams} /> */}</SidebarHeader>
      <SidebarContent>
        <SidebarItems groupLabel="Travel" items={data.travel} />
      </SidebarContent>

      <SidebarRail />
    </Sidebar>
  );
}
