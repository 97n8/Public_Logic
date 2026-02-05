import { zodResolver } from "@hookform/resolvers/zod";
import { format } from "date-fns";
import { useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { toast } from "sonner";
import { useMsal } from "@azure/msal-react";
import { Card } from "../../../../components/ui/card";
import { Button } from "../../../../components/ui/button";
import { Input } from "../../../../components/ui/input";
import { Textarea } from "../../../../components/ui/textarea";
import { Checkbox } from "../../../../components/ui/checkbox";
import { computeT10 } from "../deadlines";
import {
  CaseSchema,
  createCaseId,
} from "../vaultprr";
import { saveCase } from "../store";
import useSharePointClient from "../../../../hooks/useSharePointClient";
import { archivePrrCaseToSharePoint } from "../sharepoint";

const Schema = z.object({
  name: z.string().trim().min(2, "Name is required"),
  email: z.union([z.literal(""), z.string().trim().email("Valid email required")]),
  phone: z.union([z.literal(""), z.string().trim()]).optional(),
  requestText: z.string().trim().min(10, "Please provide details (10+ chars)"),
  agree: z.literal(true, { message: "Required" }),
});

type FormValues = z.infer<typeof Schema>;

export default function ResidentSubmission() {
  const { accounts } = useMsal();
  const actor = accounts[0]?.username || "staff";
  const sp = useSharePointClient();

  const [confirmation, setConfirmation] = useState<{
    caseId: string;
    t10: string;
    webUrl?: string;
  } | null>(null);

  const form = useForm<FormValues>({
    resolver: zodResolver(Schema),
    mode: "onChange",
    defaultValues: { agree: false, email: "", phone: "" },
  });

  const receivedAt = useMemo(() => new Date(), []);
  const t10 = useMemo(() => computeT10(receivedAt), [receivedAt]);
  const [attachments, setAttachments] = useState<File[]>([]);

  async function onSubmit(values: FormValues) {
    if (!sp.client) {
      toast.error("SharePoint not connected yet", {
        description: "Finish sign-in and try again.",
      });
      return;
    }

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
        channel: "RESIDENT_FORM",
        requestText: values.requestText,
        legalNoticeAccepted: true,
      },
      deadlines: { t10: t10.toISOString() },
      auditLog: [
        {
          at: new Date().toISOString(),
          actor: "resident",
          action: "submitted",
        },
      ],
    });

    saveCase(caseData);

    const res = await archivePrrCaseToSharePoint(sp.client as any, caseData, {
      actor,
      attachments,
    });

    toast.success("Request archived to SharePoint", {
      description: res.markdownWebUrl ? "Case file uploaded successfully." : "Case saved.",
    });

    setConfirmation({
      caseId,
      t10: format(t10, "MMM d, yyyy"),
      webUrl: res.markdownWebUrl,
    });
    form.reset({ name: "", email: "", phone: "", requestText: "", agree: false });
    setAttachments([]);
  }

  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
      <Card className="lg:col-span-7 rounded-3xl border-slate-200 p-6 shadow-sm">
        <div className="text-xs font-black uppercase tracking-widest text-slate-500">
          Resident submission
        </div>
        <div className="mt-2 text-sm font-semibold text-slate-600">
          Use this form to capture resident requests. This model writes directly
          to SharePoint (cases list + vault folder) using your Microsoft sign-in.
        </div>

        <form
          className="mt-6 flex flex-col gap-5"
          onSubmit={form.handleSubmit(onSubmit)}
        >
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div>
              <div className="mb-1 text-[11px] font-black uppercase tracking-widest text-slate-500">
                Full name
              </div>
              <Input placeholder="Jane Public" {...form.register("name")} />
              {form.formState.errors.name && (
                <div className="mt-1 text-xs font-semibold text-red-600">
                  {form.formState.errors.name.message}
                </div>
              )}
            </div>
            <div>
              <div className="mb-1 text-[11px] font-black uppercase tracking-widest text-slate-500">
                Email (optional)
              </div>
              <Input placeholder="email@example.com" {...form.register("email")} />
              {form.formState.errors.email && (
                <div className="mt-1 text-xs font-semibold text-red-600">
                  {form.formState.errors.email.message}
                </div>
              )}
            </div>
          </div>

          <div>
            <div className="mb-1 text-[11px] font-black uppercase tracking-widest text-slate-500">
              Phone (optional)
            </div>
            <Input placeholder="(555) 555-5555" {...form.register("phone")} />
          </div>

          <div>
            <div className="mb-1 text-[11px] font-black uppercase tracking-widest text-slate-500">
              Request details
            </div>
            <Textarea
              className="min-h-[180px]"
              placeholder="Describe the records requested with specific dates, departments, and topics…"
              {...form.register("requestText")}
            />
            {form.formState.errors.requestText && (
              <div className="mt-1 text-xs font-semibold text-red-600">
                {form.formState.errors.requestText.message}
              </div>
            )}
          </div>

          <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
            <label className="flex cursor-pointer items-start gap-3">
              <Checkbox
                checked={form.watch("agree")}
                onCheckedChange={(v) => form.setValue("agree", v === true)}
              />
              <span className="text-sm font-semibold text-slate-700">
                I acknowledge this is a public records request under M.G.L. c. 66
                §10.
              </span>
            </label>
            {form.formState.errors.agree && (
              <div className="mt-2 text-xs font-semibold text-red-600">
                {form.formState.errors.agree.message}
              </div>
            )}
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-4">
            <div className="mb-2 text-[11px] font-black uppercase tracking-widest text-slate-500">
              Attachments (optional)
            </div>
            <input
              type="file"
              multiple
              className="block w-full text-sm"
              onChange={(e) => setAttachments(Array.from(e.target.files || []))}
            />
            <div className="mt-2 text-xs font-semibold text-slate-500">
              Use for forwarded emails (.eml/.msg), PDFs, photos, or any provided
              documents. Stored under the case folder.
            </div>
          </div>

          <Button type="submit" className="rounded-full">
            Submit PRR
          </Button>
        </form>
      </Card>

      <Card className="lg:col-span-5 rounded-3xl border-slate-200 p-6 shadow-sm">
        <div className="text-xs font-black uppercase tracking-widest text-slate-500">
          Confirmation
        </div>
        {confirmation ? (
          <div className="mt-4">
            <div className="text-sm font-semibold text-slate-700">
              Case created:
            </div>
            <div className="mt-2 rounded-2xl border border-emerald-200 bg-emerald-50 p-4 font-mono text-sm font-bold text-emerald-800">
              {confirmation.caseId}
            </div>
            <div className="mt-4 text-sm font-semibold text-slate-700">
              T10 deadline:
            </div>
            <div className="mt-2 rounded-2xl border border-slate-200 bg-slate-50 p-4 text-sm font-semibold text-slate-800">
              {confirmation.t10}
            </div>
            <div className="mt-4 text-xs font-semibold text-slate-500">
              Case archived to SharePoint.
              {confirmation.webUrl ? (
                <>
                  {" "}
                  <a
                    className="underline underline-offset-4"
                    href={confirmation.webUrl}
                    target="_blank"
                    rel="noreferrer"
                  >
                    Open case file
                  </a>
                  .
                </>
              ) : null}
            </div>
          </div>
        ) : (
          <div className="mt-4 text-sm font-semibold text-slate-600">
            Submit a request to see the case ID and deadline.
          </div>
        )}
      </Card>
    </div>
  );
}
