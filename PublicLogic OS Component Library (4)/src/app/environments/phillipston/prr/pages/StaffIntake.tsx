import { zodResolver } from "@hookform/resolvers/zod";
import { useMsal } from "@azure/msal-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { toast } from "sonner";
import { Card } from "../../../../components/ui/card";
import { Button } from "../../../../components/ui/button";
import { Input } from "../../../../components/ui/input";
import { Textarea } from "../../../../components/ui/textarea";
import { computeT10 } from "../deadlines";
import {
  CaseSchema,
  createCaseId,
} from "../vaultprr";
import { saveCase } from "../store";
import useSharePointClient from "../../../../hooks/useSharePointClient";
import { archivePrrCaseToSharePoint } from "../sharepoint";

const Schema = z.object({
  name: z.string().min(2),
  email: z.string().email().optional().or(z.literal("")),
  phone: z.string().optional().or(z.literal("")),
  requestText: z.string().min(10),
  receivedAt: z.string().min(10),
});

type FormValues = z.infer<typeof Schema>;

export default function StaffIntake() {
  const { accounts } = useMsal();
  const actor = accounts[0]?.username || "staff";
  const sp = useSharePointClient();
  const [attachments, setAttachments] = useState<File[]>([]);

  const form = useForm<FormValues>({
    resolver: zodResolver(Schema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      requestText: "",
      receivedAt: new Date().toISOString().slice(0, 10),
    },
  });

  async function onSubmit(values: FormValues) {
    if (!sp.client) {
      toast.error("SharePoint not connected yet", {
        description: "Finish sign-in and try again.",
      });
      return;
    }

    const receivedAt = new Date(values.receivedAt + "T12:00:00");
    const t10 = computeT10(receivedAt);
    const caseId = createCaseId();

    const caseData = CaseSchema.parse({
      caseId,
      environment: "PHILLIPSTON",
      module: "PRR",
      status: "S100_INTAKE",
      requester: {
        name: values.name,
        email: values.email || undefined,
        phone: values.phone || undefined,
      },
      intake: {
        receivedAt: receivedAt.toISOString(),
        channel: "STAFF",
        requestText: values.requestText,
        legalNoticeAccepted: true,
      },
      deadlines: { t10: t10.toISOString() },
      auditLog: [
        {
          at: new Date().toISOString(),
          actor: "staff",
          action: "intake_created",
        },
      ],
    });

    saveCase(caseData);

    const res = await archivePrrCaseToSharePoint(sp.client as any, caseData, {
      actor,
      attachments,
    });

    toast.success("Intake archived to SharePoint", {
      description: res.markdownWebUrl ? `Case ${caseId} uploaded.` : `Case ${caseId} saved.`,
    });

    form.reset({
      ...form.getValues(),
      name: "",
      email: "",
      phone: "",
      requestText: "",
    });
    setAttachments([]);
  }

  return (
    <Card className="rounded-3xl border-slate-200 p-6 shadow-sm">
      <div className="text-xs font-black uppercase tracking-widest text-slate-500">
        Staff intake
      </div>
      <div className="mt-2 text-sm font-semibold text-slate-600">
        Use for email/phone/in-person PRRs. This model writes directly to
        SharePoint (cases list + vault folder) and appends to an immutable audit
        log list.
      </div>

      <form
        className="mt-6 grid grid-cols-1 gap-5 md:grid-cols-2"
        onSubmit={form.handleSubmit(onSubmit)}
      >
        <div className="md:col-span-1">
          <div className="mb-1 text-[11px] font-black uppercase tracking-widest text-slate-500">
            Received date
          </div>
          <Input type="date" {...form.register("receivedAt")} />
        </div>

        <div className="md:col-span-1">
          <div className="mb-1 text-[11px] font-black uppercase tracking-widest text-slate-500">
            Requester name
          </div>
          <Input placeholder="Jane Public" {...form.register("name")} />
        </div>

        <div className="md:col-span-1">
          <div className="mb-1 text-[11px] font-black uppercase tracking-widest text-slate-500">
            Email
          </div>
          <Input placeholder="email@example.com" {...form.register("email")} />
        </div>

        <div className="md:col-span-1">
          <div className="mb-1 text-[11px] font-black uppercase tracking-widest text-slate-500">
            Phone
          </div>
          <Input placeholder="(555) 555-5555" {...form.register("phone")} />
        </div>

        <div className="md:col-span-2">
          <div className="mb-1 text-[11px] font-black uppercase tracking-widest text-slate-500">
            Request details
          </div>
          <Textarea
            className="min-h-[200px]"
            placeholder="Paste the resident email or summarize the phone request…"
            {...form.register("requestText")}
          />
        </div>

        <div className="md:col-span-2 rounded-2xl border border-slate-200 bg-white p-4">
          <div className="mb-2 text-[11px] font-black uppercase tracking-widest text-slate-500">
            Forwarded email / attachments (optional)
          </div>
          <input
            type="file"
            multiple
            className="block w-full text-sm"
            onChange={(e) => setAttachments(Array.from(e.target.files || []))}
          />
          <div className="mt-2 text-xs font-semibold text-slate-500">
            Attach the forwarded email (.eml/.msg) or any supporting docs; they’ll
            be stored under the case’s SharePoint folder.
          </div>
        </div>

        <div className="md:col-span-2">
          <Button type="submit" className="rounded-full">
            Create intake
          </Button>
        </div>
      </form>
    </Card>
  );
}
