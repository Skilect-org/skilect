import { type ReactNode } from "react";
import { DashboardLayout } from "@/components/layout";

export default function AppGroupLayout({
  children,
}: {
  children: ReactNode;
}) {
  return <DashboardLayout>{children}</DashboardLayout>;
}
