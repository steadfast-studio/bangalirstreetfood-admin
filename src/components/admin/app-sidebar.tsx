"use client";

import * as React from "react";
import { Mountain, PieChart } from "lucide-react";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar";
import { SidebarItems } from "./sidebar-items";
import LogoutButton from "../logout";

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
      <SidebarFooter>
        <LogoutButton />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
