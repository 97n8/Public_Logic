import { Badge } from "@/app/components/ui/badge";
import { Button } from "@/app/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/app/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/app/components/ui/table";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/app/components/ui/dialog";
import { Textarea } from "@/app/components/ui/textarea";
import { Label } from "@/app/components/ui/label";
import { Input } from "@/app/components/ui/input";
import { FileText, CheckCircle, Clock, DollarSign, Eye } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

interface Invoice {
  id: string;
  vendor: string;
  invoiceNumber: string;
  amount: string;
  department: string;
  description: string;
  dueDate: string;
  status: string;
  createdAt: string;
  submittedBy: string;
  approvals?: Array<{
    approver: string;
    step: string;
    comments: string;
    timestamp: string;
  }>;
  history?: Array<{
    action: string;
    timestamp: string;
    user: string;
  }>;
  payment?: {
    amount: string;
    method: string;
    timestamp: string;
  };
}

interface InvoiceRegisterProps {
  invoices: Invoice[];
  onUpdate: () => void;
}

export function InvoiceRegister({ invoices, onUpdate }: InvoiceRegisterProps) {
  const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null);
  const [approvalData, setApprovalData] = useState({
    approver: "",
    comments: "",
    step: "initial"
  });
  const [paymentData, setPaymentData] = useState({
    amount: "",
    method: "",
    recordedBy: "",
    reference: ""
  });
  const [loading, setLoading] = useState(false);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "pending_verification":
        return <Badge variant="secondary"><Clock className="mr-1 size-3" />Pending Verification</Badge>;
      case "pending_approval":
        return <Badge variant="secondary"><Clock className="mr-1 size-3" />Pending Approval</Badge>;
      case "approved":
        return <Badge variant="default"><CheckCircle className="mr-1 size-3" />Approved</Badge>;
      case "paid":
        return <Badge variant="default" className="bg-green-600"><DollarSign className="mr-1 size-3" />Paid</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const handleApprove = async () => {
    if (!selectedInvoice || !approvalData.approver) {
      toast.error("Please enter approver name");
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(
        `https://${import.meta.env.VITE_SUPABASE_PROJECT_ID}.supabase.co/functions/v1/make-server-75bb27b9/invoices/${selectedInvoice.id}/approve`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
          },
          body: JSON.stringify(approvalData),
        }
      );

      const data = await response.json();

      if (data.success) {
        toast.success("Invoice approved successfully");
        setApprovalData({ approver: "", comments: "", step: "initial" });
        onUpdate();
      } else {
        toast.error("Failed to approve invoice: " + data.error);
      }
    } catch (error) {
      console.error("Error approving invoice:", error);
      toast.error("An error occurred while approving the invoice");
    } finally {
      setLoading(false);
    }
  };

  const handleRecordPayment = async () => {
    if (!selectedInvoice || !paymentData.amount || !paymentData.method) {
      toast.error("Please fill in all payment details");
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(
        `https://${import.meta.env.VITE_SUPABASE_PROJECT_ID}.supabase.co/functions/v1/make-server-75bb27b9/invoices/${selectedInvoice.id}/payment`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
          },
          body: JSON.stringify(paymentData),
        }
      );

      const data = await response.json();

      if (data.success) {
        toast.success("Payment recorded successfully");
        setPaymentData({ amount: "", method: "", recordedBy: "", reference: "" });
        onUpdate();
      } else {
        toast.error("Failed to record payment: " + data.error);
      }
    } catch (error) {
      console.error("Error recording payment:", error);
      toast.error("An error occurred while recording the payment");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Master Invoice Register</CardTitle>
        <CardDescription>
          Single source of truth for all invoice tracking and history
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Invoice #</TableHead>
              <TableHead>Vendor</TableHead>
              <TableHead>Amount</TableHead>
              <TableHead>Department</TableHead>
              <TableHead>Due Date</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {invoices.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center text-muted-foreground">
                  No invoices found. Submit your first invoice to get started.
                </TableCell>
              </TableRow>
            ) : (
              invoices.map((invoice) => (
                <TableRow key={invoice.id}>
                  <TableCell className="font-medium">{invoice.invoiceNumber}</TableCell>
                  <TableCell>{invoice.vendor}</TableCell>
                  <TableCell>${parseFloat(invoice.amount).toLocaleString(undefined, { minimumFractionDigits: 2 })}</TableCell>
                  <TableCell>{invoice.department}</TableCell>
                  <TableCell>{new Date(invoice.dueDate).toLocaleDateString()}</TableCell>
                  <TableCell>{getStatusBadge(invoice.status)}</TableCell>
                  <TableCell>
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setSelectedInvoice(invoice)}
                        >
                          <Eye className="mr-1 size-3" />
                          View
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="max-h-[90vh] max-w-3xl overflow-y-auto">
                        <DialogHeader>
                          <DialogTitle>Invoice Details</DialogTitle>
                          <DialogDescription>
                            Invoice #{invoice.invoiceNumber} - {invoice.vendor}
                          </DialogDescription>
                        </DialogHeader>

                        <div className="space-y-6">
                          <div className="grid gap-4 md:grid-cols-2">
                            <div>
                              <Label className="text-sm text-muted-foreground">Status</Label>
                              <div className="mt-1">{getStatusBadge(invoice.status)}</div>
                            </div>
                            <div>
                              <Label className="text-sm text-muted-foreground">Amount</Label>
                              <p className="mt-1 text-lg font-semibold">${parseFloat(invoice.amount).toLocaleString(undefined, { minimumFractionDigits: 2 })}</p>
                            </div>
                            <div>
                              <Label className="text-sm text-muted-foreground">Department</Label>
                              <p className="mt-1">{invoice.department}</p>
                            </div>
                            <div>
                              <Label className="text-sm text-muted-foreground">Due Date</Label>
                              <p className="mt-1">{new Date(invoice.dueDate).toLocaleDateString()}</p>
                            </div>
                            <div>
                              <Label className="text-sm text-muted-foreground">Submitted By</Label>
                              <p className="mt-1">{invoice.submittedBy}</p>
                            </div>
                            <div>
                              <Label className="text-sm text-muted-foreground">Submitted Date</Label>
                              <p className="mt-1">{new Date(invoice.createdAt).toLocaleDateString()}</p>
                            </div>
                          </div>

                          <div>
                            <Label className="text-sm text-muted-foreground">Description</Label>
                            <p className="mt-1">{invoice.description}</p>
                          </div>

                          {invoice.approvals && invoice.approvals.length > 0 && (
                            <div>
                              <Label className="text-sm font-semibold">Approval History</Label>
                              <div className="mt-2 space-y-2">
                                {invoice.approvals.map((approval, idx) => (
                                  <div key={idx} className="rounded-lg border p-3">
                                    <div className="flex items-center justify-between">
                                      <p className="font-medium">{approval.approver}</p>
                                      <Badge variant="outline">{approval.step}</Badge>
                                    </div>
                                    {approval.comments && (
                                      <p className="mt-1 text-sm text-muted-foreground">{approval.comments}</p>
                                    )}
                                    <p className="mt-1 text-xs text-muted-foreground">
                                      {new Date(approval.timestamp).toLocaleString()}
                                    </p>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}

                          {invoice.payment && (
                            <div>
                              <Label className="text-sm font-semibold">Payment Information</Label>
                              <div className="mt-2 rounded-lg border p-3">
                                <div className="grid gap-2 md:grid-cols-2">
                                  <div>
                                    <Label className="text-sm text-muted-foreground">Amount Paid</Label>
                                    <p className="font-semibold">${parseFloat(invoice.payment.amount).toLocaleString(undefined, { minimumFractionDigits: 2 })}</p>
                                  </div>
                                  <div>
                                    <Label className="text-sm text-muted-foreground">Method</Label>
                                    <p>{invoice.payment.method}</p>
                                  </div>
                                  <div className="md:col-span-2">
                                    <Label className="text-sm text-muted-foreground">Paid On</Label>
                                    <p>{new Date(invoice.payment.timestamp).toLocaleString()}</p>
                                  </div>
                                </div>
                              </div>
                            </div>
                          )}

                          {invoice.status === "approved" && !invoice.payment && (
                            <div className="space-y-3">
                              <Label className="font-semibold">Record Payment</Label>
                              <div className="grid gap-3 md:grid-cols-2">
                                <div className="space-y-2">
                                  <Label htmlFor="paymentAmount">Amount</Label>
                                  <Input
                                    id="paymentAmount"
                                    type="number"
                                    step="0.01"
                                    value={paymentData.amount}
                                    onChange={(e) => setPaymentData({ ...paymentData, amount: e.target.value })}
                                    placeholder={invoice.amount}
                                  />
                                </div>
                                <div className="space-y-2">
                                  <Label htmlFor="paymentMethod">Method</Label>
                                  <Input
                                    id="paymentMethod"
                                    value={paymentData.method}
                                    onChange={(e) => setPaymentData({ ...paymentData, method: e.target.value })}
                                    placeholder="Check, ACH, Wire, etc."
                                  />
                                </div>
                                <div className="space-y-2">
                                  <Label htmlFor="recordedBy">Recorded By</Label>
                                  <Input
                                    id="recordedBy"
                                    value={paymentData.recordedBy}
                                    onChange={(e) => setPaymentData({ ...paymentData, recordedBy: e.target.value })}
                                    placeholder="Your name"
                                  />
                                </div>
                                <div className="space-y-2">
                                  <Label htmlFor="reference">Reference</Label>
                                  <Input
                                    id="reference"
                                    value={paymentData.reference}
                                    onChange={(e) => setPaymentData({ ...paymentData, reference: e.target.value })}
                                    placeholder="Check # or transaction ID"
                                  />
                                </div>
                              </div>
                              <Button onClick={handleRecordPayment} disabled={loading} className="w-full">
                                {loading ? "Recording..." : "Record Payment"}
                              </Button>
                            </div>
                          )}

                          {(invoice.status === "pending_verification" || invoice.status === "pending_approval") && (
                            <div className="space-y-3">
                              <Label className="font-semibold">Approve Invoice</Label>
                              <div className="space-y-3">
                                <div className="space-y-2">
                                  <Label htmlFor="approver">Approver Name</Label>
                                  <Input
                                    id="approver"
                                    value={approvalData.approver}
                                    onChange={(e) => setApprovalData({ ...approvalData, approver: e.target.value })}
                                    placeholder="Your name"
                                  />
                                </div>
                                <div className="space-y-2">
                                  <Label htmlFor="step">Approval Step</Label>
                                  <Input
                                    id="step"
                                    value={approvalData.step}
                                    onChange={(e) => setApprovalData({ ...approvalData, step: e.target.value })}
                                    placeholder="initial, manager, final"
                                  />
                                </div>
                                <div className="space-y-2">
                                  <Label htmlFor="comments">Comments</Label>
                                  <Textarea
                                    id="comments"
                                    value={approvalData.comments}
                                    onChange={(e) => setApprovalData({ ...approvalData, comments: e.target.value })}
                                    placeholder="Optional approval comments"
                                    rows={3}
                                  />
                                </div>
                              </div>
                              <Button onClick={handleApprove} disabled={loading} className="w-full">
                                {loading ? "Approving..." : "Approve Invoice"}
                              </Button>
                            </div>
                          )}

                          {invoice.history && invoice.history.length > 0 && (
                            <div>
                              <Label className="text-sm font-semibold">Audit Trail</Label>
                              <div className="mt-2 space-y-1">
                                {invoice.history.map((entry, idx) => (
                                  <div key={idx} className="flex items-center justify-between border-l-2 border-blue-500 pl-3 py-1 text-sm">
                                    <div>
                                      <span className="font-medium">{entry.action}</span> by {entry.user}
                                    </div>
                                    <span className="text-xs text-muted-foreground">
                                      {new Date(entry.timestamp).toLocaleString()}
                                    </span>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                      </DialogContent>
                    </Dialog>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
