import { Badge } from "@/app/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/app/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/app/components/ui/table";
import { AlertCircle, CheckCircle } from "lucide-react";

interface W9 {
  id: string;
  vendorId: string;
  vendorName: string;
  businessType: string;
  department: string;
  submittedAt: string;
  lastRefreshed: string;
  nextRefreshDue: string;
  status: string;
}

interface W9ArchiveProps {
  w9s: W9[];
}

export function W9Archive({ w9s }: W9ArchiveProps) {
  const getRefreshStatus = (nextRefreshDue: string) => {
    const daysUntil = Math.ceil((new Date(nextRefreshDue).getTime() - Date.now()) / (1000 * 60 * 60 * 24));
    
    if (daysUntil < 0) {
      return <Badge variant="destructive"><AlertCircle className="mr-1 size-3" />Overdue</Badge>;
    } else if (daysUntil <= 30) {
      return <Badge variant="secondary"><AlertCircle className="mr-1 size-3" />Due Soon ({daysUntil} days)</Badge>;
    } else {
      return <Badge variant="default"><CheckCircle className="mr-1 size-3" />Current</Badge>;
    }
  };

  // Group by department
  const byDepartment = w9s.reduce((acc, w9) => {
    if (!acc[w9.department]) {
      acc[w9.department] = [];
    }
    acc[w9.department].push(w9);
    return acc;
  }, {} as Record<string, W9[]>);

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>W-9 Archive</CardTitle>
          <CardDescription>
            Vendor W-9 forms filed by department with automatic annual refresh reminders
          </CardDescription>
        </CardHeader>
        <CardContent>
          {Object.keys(byDepartment).length === 0 ? (
            <p className="text-center text-muted-foreground py-8">
              No W-9 forms on file. Submit your first W-9 to get started.
            </p>
          ) : (
            <div className="space-y-6">
              {Object.entries(byDepartment).map(([department, forms]) => (
                <div key={department}>
                  <h3 className="text-lg font-semibold mb-3">{department} Department</h3>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Vendor ID</TableHead>
                        <TableHead>Vendor Name</TableHead>
                        <TableHead>Business Type</TableHead>
                        <TableHead>Last Refreshed</TableHead>
                        <TableHead>Next Refresh Due</TableHead>
                        <TableHead>Status</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {forms.map((w9) => (
                        <TableRow key={w9.id}>
                          <TableCell className="font-medium">{w9.vendorId}</TableCell>
                          <TableCell>{w9.vendorName}</TableCell>
                          <TableCell>{w9.businessType}</TableCell>
                          <TableCell>{new Date(w9.lastRefreshed).toLocaleDateString()}</TableCell>
                          <TableCell>{new Date(w9.nextRefreshDue).toLocaleDateString()}</TableCell>
                          <TableCell>{getRefreshStatus(w9.nextRefreshDue)}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
