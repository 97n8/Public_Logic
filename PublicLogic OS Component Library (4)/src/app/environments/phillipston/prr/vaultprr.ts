import { formatISO } from "date-fns";
import { z } from "zod";

export const VaultPrrState = z.enum([
  "S000_CREATED",
  "S100_INTAKE",
  "S200_TIMER_COMPUTE",
  "S300_ASSESSMENT",
  "S400_GATHER",
  "S600_PACKAGE",
  "S800_DELIVERY",
  "S900_CLOSED",
  "S990_ERROR",
]);

export type VaultPrrState = z.infer<typeof VaultPrrState>;

export const RequesterSchema = z.object({
  name: z.string().min(1),
  email: z.string().email().optional(),
  phone: z.string().optional(),
});

export const IntakeSchema = z.object({
  receivedAt: z.string(),
  channel: z.enum(["RESIDENT_FORM", "EMAIL", "PHONE", "IN_PERSON", "STAFF"]).default("RESIDENT_FORM"),
  requestText: z.string().min(1),
  legalNoticeAccepted: z.boolean().default(true),
});

export const DeadlinesSchema = z.object({
  t10: z.string(),
});

export const AuditEntrySchema = z.object({
  at: z.string(),
  actor: z.string(),
  action: z.string(),
  detail: z.string().optional(),
});

export const CaseSchema = z.object({
  caseId: z.string(),
  environment: z.literal("PHILLIPSTON"),
  module: z.literal("PRR"),
  status: VaultPrrState,
  requester: RequesterSchema,
  intake: IntakeSchema,
  deadlines: DeadlinesSchema,
  auditLog: z.array(AuditEntrySchema).default([]),
});

export type VaultPrrCase = z.infer<typeof CaseSchema>;

export function createCaseId() {
  // Not a UUID; user-friendly ID for filenames + cross-channel reference.
  return `PRR-${new Date().getFullYear()}-${Math.random().toString(36).slice(2, 6).toUpperCase()}`;
}

export function encodeYamlFrontmatter(obj: unknown) {
  function yamlScalar(value: unknown) {
    if (value === null || value === undefined) return "null";
    if (typeof value === "number" || typeof value === "boolean") return String(value);
    const s = String(value);
    // Quote scalars to avoid YAML edge cases.
    return JSON.stringify(s);
  }

  function yamlLines(value: unknown, indent = 0): string[] {
    const pad = "  ".repeat(indent);

    if (Array.isArray(value)) {
      if (!value.length) return [`${pad}[]`];
      return value.flatMap((item) => {
        if (item && typeof item === "object" && !Array.isArray(item)) {
          const [firstKey, ...restKeys] = Object.keys(item as Record<string, unknown>);
          if (!firstKey) return [`${pad}- {}`];
          const lines: string[] = [];
          lines.push(`${pad}- ${firstKey}: ${yamlScalar((item as any)[firstKey])}`);
          for (const k of restKeys) {
            lines.push(`${pad}  ${k}: ${yamlScalar((item as any)[k])}`);
          }
          return lines;
        }
        return [`${pad}- ${yamlScalar(item)}`];
      });
    }

    if (value && typeof value === "object") {
      const entries = Object.entries(value as Record<string, unknown>);
      if (!entries.length) return [`${pad}{}`];
      const lines: string[] = [];
      for (const [k, v] of entries) {
        if (v && typeof v === "object") {
          lines.push(`${pad}${k}:`);
          lines.push(...yamlLines(v, indent + 1));
        } else {
          lines.push(`${pad}${k}: ${yamlScalar(v)}`);
        }
      }
      return lines;
    }

    return [`${pad}${yamlScalar(value)}`];
  }

  return `---\n${yamlLines(obj).join("\n")}\n---\n`;
}

export function encodeResidentSubmissionMarkdown(caseData: VaultPrrCase) {
  const frontmatter = encodeYamlFrontmatter({
    caseId: caseData.caseId,
    environment: caseData.environment,
    module: caseData.module,
    status: caseData.status,
    receivedAt: caseData.intake.receivedAt,
    t10: caseData.deadlines.t10,
    requester: caseData.requester,
  });

  return (
    frontmatter +
    `# Public Records Request (PRR)\n\n` +
    `**Case ID:** ${caseData.caseId}\n\n` +
    `## Request\n\n` +
    `${caseData.intake.requestText}\n\n` +
    `## Deadlines\n\n` +
    `- **T10 (10 business days):** ${caseData.deadlines.t10}\n\n` +
    `## Audit Log\n\n` +
    (caseData.auditLog.length
      ? caseData.auditLog
          .map((e) => `- ${e.at} — ${e.actor} — ${e.action}${e.detail ? ` — ${e.detail}` : ""}`)
          .join("\n") + "\n"
      : `- ${formatISO(new Date())} — system — created\n`)
  );
}
