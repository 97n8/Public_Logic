import { zodResolver } from "@hookform/resolvers/zod";
import { format } from "date-fns";
import { useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { toast } from "sonner";
import { Card } from "../../../../components/ui/card";
import { Button } from "../../../../components/ui/button";
import { Input } from "../../../../components/ui/input";
import { Textarea } from "../../../../components/ui/textarea";
import { Checkbox } from "../../../../components/ui/checkbox";
import { computeT10 } from "../deadlines";
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
  requestText: z.string().trim().min(10, "Please provide details (10+ chars)"),
  agree: z.literal(true, { message: "Required" }),
});

type FormValues = z.infer<typeof Schema>;

export default function ResidentSubmission() {
  const [confirmation, setConfirmation] = useState<{
    caseId: string;
    t10: string;
    packet: string;
    attachmentsCount: number;
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

    const packet = encodeResidentSubmissionMarkdown(caseData);
    void navigator.clipboard?.writeText(packet).catch(() => {});
    toast.success("Request drafted", {
      description: attachments.length
        ? "Packet copied to clipboard. Attachments are not uploaded in this model."
        : "Packet copied to clipboard.",
    });

    setConfirmation({
      caseId,
      t10: format(t10, "MMM d, yyyy"),
      packet,
      attachmentsCount: attachments.length,
    });
    form.reset({ name: "", email: "", phone: "", requestText: "", agree: false });
    setAttachments([]);
  }

  function downloadPacket() {
    if (!confirmation) return;
    const blob = new Blob([confirmation.packet], { type: "text/markdown;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${confirmation.caseId}.md`;
    a.click();
    URL.revokeObjectURL(url);
  }

  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
      <Card className="lg:col-span-7 rounded-3xl border-border bg-card p-6 shadow-sm">
        <div className="text-xs font-black uppercase tracking-widest text-muted-foreground">
          Public records request
        </div>
        <div className="mt-2 text-sm font-semibold text-muted-foreground">
          Submit a request for public records from the Town of Phillipston. This
          model generates a case packet and deadline for staff review.
        </div>

        <form
          className="mt-6 flex flex-col gap-5"
          onSubmit={form.handleSubmit(onSubmit)}
        >
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div>
              <div className="mb-1 text-[11px] font-black uppercase tracking-widest text-muted-foreground">
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
              <div className="mb-1 text-[11px] font-black uppercase tracking-widest text-muted-foreground">
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
            <div className="mb-1 text-[11px] font-black uppercase tracking-widest text-muted-foreground">
              Phone (optional)
            </div>
            <Input placeholder="(555) 555-5555" {...form.register("phone")} />
          </div>

          <div>
            <div className="mb-1 text-[11px] font-black uppercase tracking-widest text-muted-foreground">
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

          <div className="rounded-2xl border border-border bg-accent p-4">
            <label className="flex cursor-pointer items-start gap-3">
              <Checkbox
                checked={form.watch("agree")}
                onCheckedChange={(v) => form.setValue("agree", v === true)}
              />
              <span className="text-sm font-semibold text-foreground">
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

          <div className="rounded-2xl border border-border bg-card p-4">
            <div className="mb-2 text-[11px] font-black uppercase tracking-widest text-muted-foreground">
              Attachments (optional)
            </div>
            <input
              type="file"
              multiple
              className="block w-full text-sm"
              onChange={(e) => setAttachments(Array.from(e.target.files || []))}
            />
            <div className="mt-2 text-xs font-semibold text-muted-foreground">
              Add PDFs/photos or supporting docs. In this model, files are not
              uploaded yet; include them when you send the request to staff.
            </div>
          </div>

          <Button type="submit" className="rounded-full">
            Submit request
          </Button>
        </form>
      </Card>

      <Card className="lg:col-span-5 rounded-3xl border-border bg-card p-6 shadow-sm">
        <div className="text-xs font-black uppercase tracking-widest text-muted-foreground">
          Confirmation
        </div>
        {confirmation ? (
          <div className="mt-4">
            <div className="text-sm font-semibold text-foreground">
              Case created:
            </div>
            <div className="mt-2 rounded-2xl border border-primary/25 bg-accent p-4 font-mono text-sm font-bold text-foreground">
              {confirmation.caseId}
            </div>
            <div className="mt-4 text-sm font-semibold text-foreground">
              T10 deadline:
            </div>
            <div className="mt-2 rounded-2xl border border-border bg-muted p-4 text-sm font-semibold text-foreground">
              {confirmation.t10}
            </div>
            <div className="mt-4 text-xs font-semibold text-muted-foreground">
              Packet copied to your clipboard.
              {confirmation.attachmentsCount ? (
                <> Attachments selected: {confirmation.attachmentsCount} (not uploaded in this model).</>
              ) : null}
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
                onClick={downloadPacket}
              >
                Download .md
              </Button>
            </div>
          </div>
        ) : (
          <div className="mt-4 text-sm font-semibold text-muted-foreground">
            Submit a request to see the case ID and deadline.
          </div>
        )}
      </Card>
    </div>
  );
}
