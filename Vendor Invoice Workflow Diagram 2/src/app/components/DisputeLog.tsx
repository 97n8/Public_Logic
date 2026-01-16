import { useState } from "react";
import { Button } from "@/app/components/ui/button";
import { Input } from "@/app/components/ui/input";
import { Label } from "@/app/components/ui/label";
import { Textarea } from "@/app/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/app/components/ui/select";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/app/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/app/components/ui/table";
import { Badge } from "@/app/components/ui/badge";
import { AlertTriangle, CheckCircle } from "lucide-react";
import { toast } from "sonner";

interface Dispute {
  id: string;
  invoiceId?: string;
  type: string;
  description: string;
  reportedBy: string;
  status: string;
  createdAt: string;
  resolution?: string;
  resolvedBy?: string;
  resolvedAt?: string;
}

interface DisputeLogProps {
  disputes: Dispute[];
  onUpdate: () => void;
}

const DISPUTE_TYPES = [
  "Invoice Discrepancy",
  "Missing W-9",
  "Payment Issue",
  "Approval Delay",
  "Documentation Error",
  "Other"
];

export function DisputeLog({ disputes, onUpdate }: DisputeLogProps) {
  const [loading, setLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    invoiceId: "",
    type: "",
    description: "",
    reportedBy: ""
  });
  const [resolutionData, setResolutionData] = useState<{ [key: string]: { resolution: string; resolvedBy: string } }>({});

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch(
        `https://${import.meta.env.VITE_SUPABASE_PROJECT_ID}.supabase.co/functions/v1/make-server-75bb27b9/disputes`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
          },
          body: JSON.stringify(formData),
        }
      );

      const data = await response.json();

      if (data.success) {
        toast.success("Dispute logged successfully");
        setFormData({ invoiceId: "", type: "", description: "", reportedBy: "" });
        setShowForm(false);
        onUpdate();
      } else {
        toast.error("Failed to log dispute: " + data.error);
      }
    } catch (error) {
      console.error("Error logging dispute:", error);
      toast.error("An error occurred while logging the dispute");
    } finally {
      setLoading(false);
    }
  };

  const handleResolve = async (disputeId: string) => {
    const resolution = resolutionData[disputeId];
    if (!resolution?.resolution || !resolution?.resolvedBy) {
      toast.error("Please enter resolution details");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(
        `https://${import.meta.env.VITE_SUPABASE_PROJECT_ID}.supabase.co/functions/v1/make-server-75bb27b9/disputes/${disputeId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
          },
          body: JSON.stringify({
            status: "resolved",
            resolution: resolution.resolution,
            resolvedBy: resolution.resolvedBy,
            resolvedAt: new Date().toISOString()
          }),
        }
      );

      const data = await response.json();

      if (data.success) {
        toast.success("Dispute resolved successfully");
        setResolutionData({ ...resolutionData, [disputeId]: { resolution: "", resolvedBy: "" } });
        onUpdate();
      } else {
        toast.error("Failed to resolve dispute: " + data.error);
      }
    } catch (error) {
      console.error("Error resolving dispute:", error);
      toast.error("An error occurred while resolving the dispute");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Dispute & Exception Log</CardTitle>
              <CardDescription>
                Track and resolve invoice discrepancies and compliance issues
              </CardDescription>
            </div>
            <Button onClick={() => setShowForm(!showForm)}>
              {showForm ? "Cancel" : "Log New Dispute"}
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {showForm && (
            <form onSubmit={handleSubmit} className="mb-6 space-y-4 rounded-lg border p-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="invoiceId">Related Invoice ID (Optional)</Label>
                  <Input
                    id="invoiceId"
                    value={formData.invoiceId}
                    onChange={(e) => setFormData({ ...formData, invoiceId: e.target.value })}
                    placeholder="invoice:123..."
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="type">Dispute Type *</Label>
                  <Select
                    value={formData.type}
                    onValueChange={(value) => setFormData({ ...formData, type: value })}
                  >
                    <SelectTrigger id="type">
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                    <SelectContent>
                      {DISPUTE_TYPES.map((type) => (
                        <SelectItem key={type} value={type}>
                          {type}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="reportedBy">Reported By *</Label>
                  <Input
                    id="reportedBy"
                    required
                    value={formData.reportedBy}
                    onChange={(e) => setFormData({ ...formData, reportedBy: e.target.value })}
                    placeholder="Your name"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description *</Label>
                <Textarea
                  id="description"
                  required
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Detailed description of the issue"
                  rows={4}
                />
              </div>

              <Button type="submit" disabled={loading}>
                {loading ? "Logging..." : "Log Dispute"}
              </Button>
            </form>
          )}

          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Type</TableHead>
                <TableHead>Description</TableHead>
                <TableHead>Reported By</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {disputes.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center text-muted-foreground">
                    No disputes logged. System running smoothly!
                  </TableCell>
                </TableRow>
              ) : (
                disputes.map((dispute) => (
                  <TableRow key={dispute.id}>
                    <TableCell className="font-medium">{dispute.type}</TableCell>
                    <TableCell className="max-w-md">
                      <p className="truncate">{dispute.description}</p>
                      {dispute.invoiceId && (
                        <p className="text-xs text-muted-foreground">Invoice: {dispute.invoiceId}</p>
                      )}
                    </TableCell>
                    <TableCell>{dispute.reportedBy}</TableCell>
                    <TableCell>{new Date(dispute.createdAt).toLocaleDateString()}</TableCell>
                    <TableCell>
                      {dispute.status === "open" ? (
                        <Badge variant="secondary">
                          <AlertTriangle className="mr-1 size-3" />
                          Open
                        </Badge>
                      ) : (
                        <Badge variant="default">
                          <CheckCircle className="mr-1 size-3" />
                          Resolved
                        </Badge>
                      )}
                    </TableCell>
                    <TableCell>
                      {dispute.status === "open" ? (
                        <div className="space-y-2">
                          <Input
                            placeholder="Resolution"
                            value={resolutionData[dispute.id]?.resolution || ""}
                            onChange={(e) =>
                              setResolutionData({
                                ...resolutionData,
                                [dispute.id]: {
                                  ...resolutionData[dispute.id],
                                  resolution: e.target.value
                                }
                              })
                            }
                            className="mb-1"
                          />
                          <Input
                            placeholder="Resolved by"
                            value={resolutionData[dispute.id]?.resolvedBy || ""}
                            onChange={(e) =>
                              setResolutionData({
                                ...resolutionData,
                                [dispute.id]: {
                                  ...resolutionData[dispute.id],
                                  resolvedBy: e.target.value
                                }
                              })
                            }
                            className="mb-1"
                          />
                          <Button
                            size="sm"
                            onClick={() => handleResolve(dispute.id)}
                            disabled={loading}
                          >
                            Resolve
                          </Button>
                        </div>
                      ) : (
                        <div className="text-sm">
                          <p className="font-medium">Resolved by {dispute.resolvedBy}</p>
                          <p className="text-muted-foreground">{dispute.resolution}</p>
                          <p className="text-xs text-muted-foreground">
                            {dispute.resolvedAt && new Date(dispute.resolvedAt).toLocaleString()}
                          </p>
                        </div>
                      )}
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
