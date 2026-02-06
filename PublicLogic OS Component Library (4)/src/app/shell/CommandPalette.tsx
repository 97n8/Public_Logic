import { useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import {
  Building2,
  CalendarClock,
  ExternalLink,
  FileText,
  Gauge,
  Inbox,
  Landmark,
  NotebookPen,
  Search,
  Settings,
  Wrench,
} from "lucide-react";
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
  CommandShortcut,
} from "../components/ui/command";

type CommandPaletteProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onOpenCapture: () => void;
};

type CommandDef = {
  key: string;
  label: string;
  icon?: React.ComponentType<{ className?: string }>;
  shortcut?: string;
  run: () => void;
};

export default function CommandPalette({
  open,
  onOpenChange,
  onOpenCapture,
}: CommandPaletteProps) {
  const navigate = useNavigate();

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      const key = e.key.toLowerCase();

      if ((e.metaKey || e.ctrlKey) && key === "k") {
        e.preventDefault();
        onOpenChange(!open);
        return;
      }

      if (e.altKey && key === "c") {
        e.preventDefault();
        onOpenChange(false);
        onOpenCapture();
      }

      if (e.altKey && key === "d") {
        e.preventDefault();
        onOpenChange(false);
        navigate("/dashboard");
      }

      if (e.altKey && key === "i") {
        e.preventDefault();
        onOpenChange(false);
        navigate("/lists");
      }
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [navigate, onOpenCapture, onOpenChange, open]);

  const commands = useMemo(() => {
    const openUrl = (href: string) => {
      window.open(href, "_blank", "noreferrer");
    };

    const runNav = (to: string) => () => {
      onOpenChange(false);
      navigate(to);
    };

    const runExternal = (href: string) => () => {
      onOpenChange(false);
      openUrl(href);
    };

    const runCapture = () => {
      onOpenChange(false);
      onOpenCapture();
    };

    const groups: { title: string; items: CommandDef[] }[] = [
      {
        title: "Navigate",
        items: [
          {
            key: "nav-dashboard",
            label: "Dashboard",
            icon: Gauge,
            shortcut: "⌥D",
            run: runNav("/dashboard"),
          },
          {
            key: "nav-inbox",
            label: "Inbox",
            icon: Inbox,
            shortcut: "⌥I",
            run: runNav("/lists"),
          },
          {
            key: "nav-tools",
            label: "Tools",
            icon: Wrench,
            run: runNav("/tools"),
          },
          {
            key: "nav-envs",
            label: "Environments",
            icon: Building2,
            run: runNav("/environments"),
          },
          {
            key: "nav-settings",
            label: "Settings",
            icon: Settings,
            run: runNav("/settings"),
          },
        ],
      },
      {
        title: "Town Spaces",
        items: [
          {
            key: "town-phillipston-casespace",
            label: "Phillipston — CaseSpace",
            icon: Landmark,
            run: runNav("/phillipston"),
          },
          {
            key: "town-phillipston-prr-staff",
            label: "Phillipston — PRR (Staff)",
            icon: FileText,
            run: runNav("/phillipston/prr/staff"),
          },
          {
            key: "town-phillipston-prr-resident",
            label: "Phillipston — PRR (Resident)",
            icon: FileText,
            run: runNav("/phillipston/prr/resident"),
          },
        ],
      },
      {
        title: "Actions",
        items: [
          {
            key: "action-capture",
            label: "Capture intake",
            icon: NotebookPen,
            shortcut: "⌥C",
            run: runCapture,
          },
        ],
      },
      {
        title: "Workspaces",
        items: [
          {
            key: "ws-sharepoint",
            label: "Open SharePoint",
            icon: ExternalLink,
            run: runExternal("https://publiclogic978.sharepoint.com/sites/PL"),
          },
          {
            key: "ws-calendar",
            label: "Open Outlook Calendar",
            icon: CalendarClock,
            run: runExternal("https://outlook.office.com/calendar/"),
          },
          {
            key: "ws-chatgpt",
            label: "Open ChatGPT",
            icon: Search,
            run: runExternal("https://chatgpt.com/"),
          },
          {
            key: "ws-notes",
            label: "Open Notes (iCloud)",
            icon: NotebookPen,
            run: runExternal("https://www.icloud.com/notes/"),
          },
          {
            key: "ws-reminders",
            label: "Open Reminders (iCloud)",
            icon: CalendarClock,
            run: runExternal("https://www.icloud.com/reminders/"),
          },
        ],
      },
    ];

    return groups;
  }, [navigate, onOpenCapture, onOpenChange]);

  return (
    <CommandDialog open={open} onOpenChange={onOpenChange}>
      <CommandInput placeholder="Search…" />
      <CommandList>
        <CommandEmpty>No results.</CommandEmpty>
        {commands.map((group, idx) => (
          <div key={group.title}>
            <CommandGroup heading={group.title}>
              {group.items.map((c) => (
                <CommandItem key={c.key} onSelect={c.run}>
                  {c.icon ? <c.icon className="h-4 w-4" /> : null}
                  <span>{c.label}</span>
                  {c.shortcut ? <CommandShortcut>{c.shortcut}</CommandShortcut> : null}
                </CommandItem>
              ))}
            </CommandGroup>
            {idx < commands.length - 1 ? <CommandSeparator /> : null}
          </div>
        ))}
      </CommandList>
    </CommandDialog>
  );
}

