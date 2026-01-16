import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/app/components/ui/card";
import { Badge } from "@/app/components/ui/badge";
import { FileText, AlertTriangle, CheckCircle, Clock } from "lucide-react";

interface DashboardProps {
  stats: {
    invoices: {
      total: number;
      pending: number;
      approved: number;
      paid: number;
      totalAmount: number;
    };
    w9s: {
      total: number;
      active: number;
      needingRefresh: number;
    };
    disputes: {
      total: number;
      open: number;
      resolved: number;
    };
  };
  reminders: Array<{
    type: string;
    priority: string;
    [key: string]: any;
  }>;
}

export function Dashboard({ stats, reminders }: DashboardProps) {
  const highPriorityReminders = reminders.filter(r => r.priority === "high");

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
        <p className="text-muted-foreground">
          PublicLogic CASE Workspace - Vendor Invoice & W-9 Compliance
        </p>
      </div>

      {highPriorityReminders.length > 0 && (
        <Card className="border-red-200 bg-red-50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-red-700">
              <AlertTriangle className="size-5" />
              Urgent Reminders ({highPriorityReminders.length})
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {highPriorityReminders.map((reminder, idx) => (
              <div key={idx} className="flex items-center justify-between rounded-lg bg-white p-3">
                <div>
                  {reminder.type === "payment_due" ? (
                    <p className="font-medium">Payment Due: {reminder.vendor}</p>
                  ) : (
                    <p className="font-medium">W-9 Refresh: {reminder.vendorName}</p>
                  )}
                  <p className="text-sm text-muted-foreground">
                    {reminder.type === "payment_due"
                      ? `Amount: $${reminder.amount} - Due in ${reminder.daysUntilDue} days`
                      : `Department: ${reminder.department} - Due in ${reminder.daysUntilRefresh} days`}
                  </p>
                </div>
                <Badge variant="destructive">Urgent</Badge>
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Invoices</CardTitle>
            <FileText className="size-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.invoices.total}</div>
            <p className="text-xs text-muted-foreground">
              {stats.invoices.pending} pending verification
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Amount</CardTitle>
            <FileText className="size-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              ${stats.invoices.totalAmount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </div>
            <p className="text-xs text-muted-foreground">
              {stats.invoices.paid} paid, {stats.invoices.approved} approved
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">W-9 Forms</CardTitle>
            <CheckCircle className="size-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.w9s.active}</div>
            <p className="text-xs text-muted-foreground">
              {stats.w9s.needingRefresh} need refresh soon
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Open Disputes</CardTitle>
            <Clock className="size-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.disputes.open}</div>
            <p className="text-xs text-muted-foreground">
              {stats.disputes.resolved} resolved
            </p>
          </CardContent>
        </Card>
      </div>

      {reminders.length > highPriorityReminders.length && (
        <Card>
          <CardHeader>
            <CardTitle>All Reminders</CardTitle>
            <CardDescription>Upcoming deadlines and actions</CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            {reminders.map((reminder, idx) => (
              <div key={idx} className="flex items-center justify-between rounded-lg border p-3">
                <div className="flex-1">
                  {reminder.type === "payment_due" ? (
                    <>
                      <p className="font-medium">Payment Due: {reminder.vendor}</p>
                      <p className="text-sm text-muted-foreground">
                        Amount: ${reminder.amount} - Due in {reminder.daysUntilDue} days
                      </p>
                    </>
                  ) : (
                    <>
                      <p className="font-medium">W-9 Refresh Required: {reminder.vendorName}</p>
                      <p className="text-sm text-muted-foreground">
                        Department: {reminder.department} - Due in {reminder.daysUntilRefresh} days
                      </p>
                    </>
                  )}
                </div>
                <Badge variant={reminder.priority === "high" ? "destructive" : "secondary"}>
                  {reminder.priority === "high" ? "High" : "Medium"}
                </Badge>
              </div>
            ))}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
