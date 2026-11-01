import type { ReactNode } from "react";
import CentralManagementFrame from "@/components/management/CentralManagementFrame";
import "./management-theme.css";

export default function ManagementLayout({ children }: { children: ReactNode }) {
  return <CentralManagementFrame>{children}</CentralManagementFrame>;
}
