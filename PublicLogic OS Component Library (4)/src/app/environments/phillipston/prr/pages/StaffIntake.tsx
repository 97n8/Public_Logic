import { zodResolver } from "@hookform/resolvers/zod";
import { format } from "date-fns";
import { useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { z } from "zod";
import { toast } from "sonner";
import { Card } from "../../../../components/ui/card";
import { Button } from "../../../../components/ui/button";
import { Input } from "../../../../components/ui/input";
import { Textarea } from "../../../../components/ui/textarea";
import { addBusinessDays, computeT10 } from "../deadlines";
import {
  CaseSchema,
  createCaseId,
  encodeResidentSubmissionMarkdown,
} from "../vaultprr";
import { saveCase } from "../store";

const Schema = z.object({
  name: z.string().trim().min(2, "Name is required"),
  email: z
    .string()
    .trim()
    .refine(
      (v) => !v || z.string().email().safeParse(v).success,
      "Valid email required",
    ),
  phone: z.string().trim().optional(),
  requestText: z.string().trim().min(3, "Please provide request details"),
  receivedAt: z.string().min(10, "Received date is required"),
});

type FormValues = z.infer<typeof Schema>;

export default function StaffIntake() {
  const [attachments, setAttachments] = useState<File[]>([]);
  const [confirmation, setConfirmation] = useState<{
    caseId: string;
    t10: string;
    reminderT3: string;
    reminderT1: string;
    packet: string;
    attachmentsCount: number;
  } | null>(null);
  const navigate = useNavigate();

  const form = useForm<FormValues>({
    resolver: zodResolver(Schema),
    mode: "onChange",
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      requestText: "",
      receivedAt: new Date().toISOString().slice(0, 10),
    },
  });

  const receivedAtStr = form.watch("receivedAt");
  const receivedAtDate = useMemo(() => {
    const d = new Date(`${receivedAtStr}T12:00:00`);
    return Number.isNaN(d.getTime()) ? null : d;
  }, [receivedAtStr]);
  const t10Preview = useMemo(() => {
    if (!receivedAtDate) return null;
    return computeT10(receivedAtDate);
  }, [receivedAtDate]);
  const reminderT3Preview = useMemo(() => {
    if (!receivedAtDate) return null;
    return addBusinessDays(receivedAtDate, 7);
  }, [receivedAtDate]);
  const reminderT1Preview = useMemo(() => {
    if (!receivedAtDate) return null;
    return addBusinessDays(receivedAtDate, 9);
  }, [receivedAtDate]);

  const fmt = (d: Date | null) =>
    d && !Number.isNaN(d.getTime()) ? format(d, "MMM d, yyyy") : "—";

  function downloadPacket(packet: string, caseId: string) {
    const blob = new Blob([packet], { type: "text/markdown;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${caseId}.md`;
    a.click();
    URL.revokeObjectURL(url);
  }

  async function onSubmit(values: FormValues) {
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
      attachments: attachments.map((f) => ({
        name: f.name,
        type: f.type || undefined,
        size: f.size || undefined,
      })),
      auditLog: [
        {
          at: new Date().toISOString(),
          actor: "staff",
          action: "intake_created",
        },
      ],
    });

    saveCase(caseData);

    const md = encodeResidentSubmissionMarkdown(caseData);
    void navigator.clipboard?.writeText(md).catch(() => {});
    toast.success("Intake saved", {
      description: attachments.length
        ? `Case ${caseId} saved. Packet copied to clipboard. Attachments are listed in the packet (${attachments.length}).`
        : `Case ${caseId} saved. Packet copied to clipboard.`,
    });

    setConfirmation({
      caseId,
      t10: format(t10, "MMM d, yyyy"),
      reminderT3: format(addBusinessDays(receivedAt, 7), "MMM d, yyyy"),
      reminderT1: format(addBusinessDays(receivedAt, 9), "MMM d, yyyy"),
      packet: md,
      attachmentsCount: attachments.length,
    });

    form.reset({
      receivedAt: values.receivedAt,
      name: "",
      email: "",
      phone: "",
      requestText: "",
    });
    setAttachments([]);
  }

  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
      <Card className="lg:col-span-7 rounded-3xl border-border bg-card p-6 shadow-sm">
        <div className="text-xs font-black uppercase tracking-widest text-muted-foreground">
          Staff intake
        </div>
        <div className="mt-2 text-sm font-semibold text-muted-foreground">
          Use for email/phone/in-person PRRs. This model drafts a case packet and
          stores it locally in the browser.
        </div>

        <form
          className="mt-6 grid grid-cols-1 gap-5 md:grid-cols-2"
          onSubmit={form.handleSubmit(onSubmit)}
        >
          <div className="md:col-span-1">
            <div className="mb-1 text-[11px] font-black uppercase tracking-widest text-muted-foreground">
              Received date
            </div>
            <Input type="date" {...form.register("receivedAt")} />
            {form.formState.errors.receivedAt && (
              <div className="mt-1 text-xs font-semibold text-red-600">
                {form.formState.errors.receivedAt.message}
              </div>
            )}
          </div>

          <div className="md:col-span-1">
            <div className="mb-1 text-[11px] font-black uppercase tracking-widest text-muted-foreground">
              Requester name
            </div>
            <Input placeholder="Jane Public" {...form.register("name")} />
            {form.formState.errors.name && (
              <div className="mt-1 text-xs font-semibold text-red-600">
                {form.formState.errors.name.message}
              </div>
            )}
          </div>

          <div className="md:col-span-1">
            <div className="mb-1 text-[11px] font-black uppercase tracking-widest text-muted-foreground">
              Email
            </div>
            <Input placeholder="email@example.com" {...form.register("email")} />
            {form.formState.errors.email && (
              <div className="mt-1 text-xs font-semibold text-red-600">
                {form.formState.errors.email.message}
              </div>
            )}
          </div>

          <div className="md:col-span-1">
            <div className="mb-1 text-[11px] font-black uppercase tracking-widest text-muted-foreground">
              Phone
            </div>
            <Input placeholder="(555) 555-5555" {...form.register("phone")} />
          </div>

          <div className="md:col-span-2">
            <div className="mb-1 text-[11px] font-black uppercase tracking-widest text-muted-foreground">
              Request details
            </div>
            <Textarea
              className="min-h-[200px]"
              placeholder="Paste the resident email or summarize the phone request…"
              {...form.register("requestText")}
            />
            {form.formState.errors.requestText && (
              <div className="mt-1 text-xs font-semibold text-red-600">
                {form.formState.errors.requestText.message}
              </div>
            )}
          </div>

          <div className="md:col-span-2 rounded-2xl border border-border bg-card p-4">
            <div className="mb-2 text-[11px] font-black uppercase tracking-widest text-muted-foreground">
              Forwarded email / attachments (optional)
            </div>
            <input
              type="file"
              multiple
              className="block w-full text-sm"
              onChange={(e) => setAttachments(Array.from(e.target.files || []))}
            />
            <div className="mt-2 text-xs font-semibold text-muted-foreground">
              Files are not uploaded yet; this model lists attachment names inside
              the case packet for staff workflow.
            </div>
          </div>

          <div className="md:col-span-2">
            <Button type="submit" className="rounded-full">
              Create intake
            </Button>
          </div>
        </form>
      </Card>

      <Card className="lg:col-span-5 rounded-3xl border-border bg-card p-6 shadow-sm">
        <div className="text-xs font-black uppercase tracking-widest text-muted-foreground">
          SLA snapshot
        </div>
        <div className="mt-3 rounded-2xl border border-border bg-muted p-4">
          <div className="text-sm font-semibold text-foreground">
            T10 due date
          </div>
          <div className="mt-2 text-lg font-black text-foreground">
            {fmt(t10Preview)}
          </div>
          <div className="mt-3 text-sm font-semibold text-muted-foreground">
            Reminders (model): {fmt(reminderT3Preview)} (T-3) • {fmt(reminderT1Preview)} (T-1)
          </div>
        </div>

        <ul className="mt-4 list-disc space-y-1 pl-5 text-sm font-semibold text-muted-foreground">
          <li>Acknowledgement target: within 1 business day.</li>
          <li>Extensions / fee estimates issued before T10 when applicable.</li>
          <li>All activity logged to an audit trail when wired to SharePoint.</li>
        </ul>

        {confirmation ? (
          <div className="mt-6">
            <div className="text-xs font-black uppercase tracking-widest text-muted-foreground">
              Intake created
            </div>
            <div className="mt-2 rounded-2xl border border-primary/25 bg-accent p-4 font-mono text-sm font-bold text-foreground">
              {confirmation.caseId}
            </div>

            <div className="mt-4 grid grid-cols-1 gap-3">
              <div className="rounded-2xl border border-border bg-card p-4">
                <div className="text-xs font-black uppercase tracking-widest text-muted-foreground">
                  T10
                </div>
                <div className="mt-1 text-sm font-semibold text-foreground">
                  {confirmation.t10}
                </div>
              </div>
              <div className="rounded-2xl border border-border bg-card p-4">
                <div className="text-xs font-black uppercase tracking-widest text-muted-foreground">
                  Triggers (model)
                </div>
                <div className="mt-2 text-sm font-semibold text-muted-foreground">
                  {confirmation.reminderT3} (T-3) • {confirmation.reminderT1} (T-1)
                </div>
                {confirmation.attachmentsCount ? (
                  <div className="mt-2 text-xs font-semibold text-muted-foreground">
                    Attachments listed: {confirmation.attachmentsCount} (not uploaded yet).
                  </div>
                ) : null}
              </div>
            </div>

            <div className="mt-4 flex flex-wrap gap-2">
              <Button
                type="button"
                variant="outline"
                className="rounded-full"
                onClick={() => void navigator.clipboard?.writeText(confirmation.packet).catch(() => {})}
              >
                Copy packet
              </Button>
              <Button
                type="button"
                variant="outline"
                className="rounded-full"
                onClick={() => downloadPacket(confirmation.packet, confirmation.caseId)}
              >
                Download .md
              </Button>
              <Button
                type="button"
                className="rounded-full"
                onClick={() =>
                  navigate(`/phillipston/prr/staff?created=${encodeURIComponent(confirmation.caseId)}`)
                }
              >
                Open CaseSpace
              </Button>
            </div>
          </div>
        ) : (
          <div className="mt-6 text-sm font-semibold text-muted-foreground">
            Create an intake to generate a case ID, packet, and tracking entry in
            CaseSpace.
          </div>
        )}
      </Card>
    </div>
  );
}
