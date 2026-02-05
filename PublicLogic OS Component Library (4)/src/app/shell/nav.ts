import {
  Building2,
  Gauge,
  ListTodo,
  Settings,
  Wrench,
} from "lucide-react";
import type { ComponentType } from "react";

export type NavItem = {
  to: string;
  label: string;
  icon: ComponentType<{ className?: string }>;
};

export const NAV_ITEMS: NavItem[] = [
  { to: "/dashboard", label: "Dashboard", icon: Gauge },
  { to: "/lists", label: "Lists", icon: ListTodo },
  { to: "/tools", label: "Tools", icon: Wrench },
  { to: "/environments", label: "Environments", icon: Building2 },
  { to: "/settings", label: "Settings", icon: Settings },
];
