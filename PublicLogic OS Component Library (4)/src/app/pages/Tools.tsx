import PageHeader from "../components/PageHeader";
import { Card } from "../components/ui/card";

const TOOLS = [
  { label: "Outlook (Mail)", href: "https://outlook.office.com/mail/" },
  { label: "Outlook (Calendar)", href: "https://outlook.office.com/calendar/" },
  { label: "SharePoint Site", href: "https://publiclogic978.sharepoint.com/sites/PL" },
  { label: "OneDrive", href: "https://www.office.com/launch/onedrive" },
  { label: "ChatGPT", href: "https://chatgpt.com/" },
  { label: "Apple Notes (iCloud)", href: "https://www.icloud.com/notes/" },
  { label: "Apple Reminders (iCloud)", href: "https://www.icloud.com/reminders/" },
] as const;

export default function Tools() {
  return (
    <div>
      <PageHeader
        title="Tools"
        subtitle="Convenience links to Microsoft 365 tools."
      />

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        {TOOLS.map((t) => (
          <Card key={t.href} className="rounded-3xl border-slate-200 p-6 shadow-sm">
            <a
              href={t.href}
              target="_blank"
              rel="noreferrer"
              className="text-sm font-black uppercase tracking-widest text-emerald-700 underline underline-offset-4"
            >
              {t.label}
            </a>
            <div className="mt-2 break-all text-xs font-semibold text-slate-500">
              {t.href}
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
