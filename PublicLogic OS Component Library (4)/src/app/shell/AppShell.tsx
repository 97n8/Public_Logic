import { useMsal } from "@azure/msal-react";
import { LogOut, ShieldCheck } from "lucide-react";
import type { ReactNode } from "react";
import { Link, NavLink } from "react-router-dom";
import { NAV_ITEMS } from "./nav";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarInset,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarSeparator,
  SidebarTrigger,
} from "../components/ui/sidebar";
import { Button } from "../components/ui/button";

export default function AppShell({ children }: { children: ReactNode }) {
  const { instance, accounts } = useMsal();
  const email = accounts[0]?.username ?? "";

  return (
    <SidebarProvider defaultOpen>
      <Sidebar>
        <SidebarHeader>
          <div className="flex items-center gap-3 px-2 py-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-emerald-600 text-white shadow-lg shadow-emerald-600/20">
              <ShieldCheck className="h-5 w-5" />
            </div>
            <div className="min-w-0">
              <div className="truncate text-sm font-black uppercase tracking-widest text-sidebar-foreground">
                PublicLogic
              </div>
              <div className="truncate text-xs font-semibold text-sidebar-foreground/70">
                CaseSpace
              </div>
            </div>
          </div>
        </SidebarHeader>

        <SidebarSeparator />

        <SidebarContent>
          <SidebarMenu>
            {NAV_ITEMS.map((item) => (
              <SidebarMenuItem key={item.to}>
                <SidebarMenuButton asChild>
                  <NavLink
                    to={item.to}
                    className={({ isActive }) =>
                      [
                        "flex items-center gap-3 rounded-xl px-3 py-2 text-sm font-bold transition",
                        isActive
                          ? "bg-sidebar-accent text-sidebar-accent-foreground shadow-lg shadow-sidebar-ring/20"
                          : "text-sidebar-foreground/80 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
                      ].join(" ")
                    }
                  >
                    <item.icon className="h-4 w-4" />
                    <span>{item.label}</span>
                  </NavLink>
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarContent>

        <SidebarFooter>
            <div className="px-2 pb-2">
            <div className="rounded-2xl border border-sidebar-border bg-sidebar-accent/30 p-3">
              <div className="text-[10px] font-black uppercase tracking-[0.22em] text-sidebar-foreground/70">
                Signed in
              </div>
              <div className="mt-1 truncate text-xs font-semibold text-sidebar-foreground">
                {email || "(unknown)"}
              </div>
              <Button
                variant="outline"
                className="mt-3 w-full justify-center"
                onClick={() => instance.logoutRedirect()}
              >
                <LogOut className="mr-2 h-4 w-4" />
                Log out
              </Button>
            </div>
            <div className="mt-2 px-2 text-[10px] font-semibold text-sidebar-foreground/70">
              <Link to="/phillipston/prr" className="underline underline-offset-4">
                Phillipston PRR
              </Link>
            </div>
          </div>
        </SidebarFooter>
      </Sidebar>

      <SidebarInset>
        <header className="sticky top-0 z-20 flex items-center gap-3 border-b border-border bg-background/80 px-4 py-3 backdrop-blur">
          <SidebarTrigger />
          <div className="flex-1 text-sm font-black uppercase tracking-widest text-foreground">
            Operations Portal
          </div>
        </header>
        <main className="min-h-[calc(100vh-56px)] bg-background p-6">
          <div className="mx-auto w-full max-w-6xl">{children}</div>
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}
