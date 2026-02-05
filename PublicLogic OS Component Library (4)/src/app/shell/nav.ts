import {
  Building2,
  CalendarDays,
  FolderKanban,
  Gauge,
  GitBranch,
  Globe,
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
  { to: "/today", label: "Today", icon: CalendarDays },
  { to: "/tasks", label: "Tasks", icon: ListTodo },
  { to: "/pipeline", label: "Pipeline", icon: GitBranch },
  { to: "/projects", label: "Projects", icon: FolderKanban },
  { to: "/playbooks", label: "Playbooks", icon: Globe },
  { to: "/tools", label: "Tools", icon: Wrench },
  { to: "/environments", label: "Environments", icon: Building2 },
  { to: "/settings", label: "Settings", icon: Settings },
];
