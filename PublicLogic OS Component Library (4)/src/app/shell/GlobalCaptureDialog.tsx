import { useMsal } from "@azure/msal-react";
import { useQueryClient } from "@tanstack/react-query";
import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import { createArchieveRecord } from "../lib/archieve";
import useSharePointClient from "../hooks/useSharePointClient";
import { Button } from "../components/ui/button";
import { Textarea } from "../components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "../components/ui/dialog";

type GlobalCaptureDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

export default function GlobalCaptureDialog({
  open,
  onOpenChange,
}: GlobalCaptureDialogProps) {
  const qc = useQueryClient();
  const { accounts } = useMsal();
  const actor = accounts[0]?.username || "unknown";
  const { client: sp, isLoading: isConnecting, error: connectError } =
    useSharePointClient();

  const [text, setText] = useState("");

  useEffect(() => {
    if (!open) setText("");
  }, [open]);

  const connectionLabel = useMemo(() => {
    if (isConnecting) return "Connecting…";
    if (connectError) return "Connection error";
    if (sp) return "Microsoft 365 connected";
    return "Not connected";
  }, [connectError, isConnecting, sp]);

  async function save() {
    const trimmed = text.trim();
    if (!trimmed) return;

    const title = trimmed.split("\n")[0].trim().slice(0, 120) || "Capture";
    const body = trimmed;

    if (!sp) {
      try {
        await navigator.clipboard.writeText(body);
        toast.message("Copied to clipboard", {
          description: "Connect Microsoft 365 to save to ARCHIEVE.",
        });
        onOpenChange(false);
      } catch {
        toast.error("Connect Microsoft 365 to save to ARCHIEVE.");
      }
      return;
    }

    const tid = toast.loading("Saving to ARCHIEVE…");
    try {
      const res = await createArchieveRecord(sp as any, {
        title,
        body,
        recordType: "CAPTURE",
        status: "INBOX",
        actor,
        environment: "PUBLICLOGIC",
        module: "CAPTURE",
        sourceUrl: window.location.href,
      });
      toast.success("Saved", { id: tid, description: res.recordId });
      await qc.invalidateQueries({ queryKey: ["archieve"] });
      onOpenChange(false);
    } catch (e) {
      toast.error("Could not save", {
        id: tid,
        description: e instanceof Error ? e.message : String(e),
      });
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Capture intake</DialogTitle>
          <DialogDescription>
            Capture an issue, decision, observation, or link for review. Saving
            writes to ARCHIEVE (SharePoint).
          </DialogDescription>
        </DialogHeader>

        <div className="mt-1">
          <div className="mb-2 flex items-center justify-between gap-3">
            <div className="text-xs font-black uppercase tracking-widest text-muted-foreground">
              {connectionLabel}
            </div>
            {connectError ? (
              <div className="text-xs font-semibold text-red-700">
                {connectError instanceof Error ? connectError.message : String(connectError)}
              </div>
            ) : null}
          </div>

          <Textarea
            className="min-h-[220px]"
            placeholder="Write plainly. Include the link and the decision context if relevant."
            value={text}
            onChange={(e) => setText(e.target.value)}
          />

          <div className="mt-4 flex flex-wrap items-center justify-end gap-2">
            <Button
              type="button"
              variant="outline"
              className="rounded-full"
              onClick={() => onOpenChange(false)}
            >
              Close
            </Button>
            <Button
              type="button"
              className="rounded-full"
              onClick={() => void save()}
              disabled={!text.trim()}
            >
              Save
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

