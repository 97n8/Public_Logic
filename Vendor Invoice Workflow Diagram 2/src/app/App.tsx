import { useState, useEffect } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/app/components/ui/tabs";
import { Dashboard } from "@/app/components/Dashboard";
import { InvoiceIntake } from "@/app/components/InvoiceIntake";
import { InvoiceRegister } from "@/app/components/InvoiceRegister";
import { W9Submission } from "@/app/components/W9Submission";
import { W9Archive } from "@/app/components/W9Archive";
import { DisputeLog } from "@/app/components/DisputeLog";
import { OperationsGuide } from "@/app/components/OperationsGuide";
import { Toaster } from "@/app/components/ui/sonner";
import { FileText, LayoutDashboard, Upload, FolderOpen, AlertTriangle, BookOpen, CheckSquare } from "lucide-react";
import { projectId, publicAnonKey } from "/utils/supabase/info";

interface Stats {
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
}

export default function App() {
  const [activeTab, setActiveTab] = useState("dashboard");
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<Stats>({
    invoices: { total: 0, pending: 0, approved: 0, paid: 0, totalAmount: 0 },
    w9s: { total: 0, active: 0, needingRefresh: 0 },
    disputes: { total: 0, open: 0, resolved: 0 }
  });
  const [invoices, setInvoices] = useState([]);
  const [w9s, setW9s] = useState([]);
  const [disputes, setDisputes] = useState([]);
  const [reminders, setReminders] = useState([]);

  const baseUrl = `https://${projectId}.supabase.co/functions/v1/make-server-75bb27b9`;

  const fetchData = async () => {
    setLoading(true);
    try {
      const [statsRes, invoicesRes, w9sRes, disputesRes, remindersRes] = await Promise.all([
        fetch(`${baseUrl}/stats`, {
          headers: { Authorization: `Bearer ${publicAnonKey}` }
        }),
        fetch(`${baseUrl}/invoices`, {
          headers: { Authorization: `Bearer ${publicAnonKey}` }
        }),
        fetch(`${baseUrl}/w9`, {
          headers: { Authorization: `Bearer ${publicAnonKey}` }
        }),
        fetch(`${baseUrl}/disputes`, {
          headers: { Authorization: `Bearer ${publicAnonKey}` }
        }),
        fetch(`${baseUrl}/reminders`, {
          headers: { Authorization: `Bearer ${publicAnonKey}` }
        })
      ]);

      const statsData = await statsRes.json();
      const invoicesData = await invoicesRes.json();
      const w9sData = await w9sRes.json();
      const disputesData = await disputesRes.json();
      const remindersData = await remindersRes.json();

      if (statsData.success) setStats(statsData.stats);
      if (invoicesData.success) setInvoices(invoicesData.invoices);
      if (w9sData.success) setW9s(w9sData.w9s);
      if (disputesData.success) setDisputes(disputesData.disputes);
      if (remindersData.success) setReminders(remindersData.reminders);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      <Toaster />
      
      {/* Header */}
      <header className="border-b bg-white">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">PublicLogic CASE</h1>
              <p className="text-sm text-gray-600">Vendor Invoice & W-9 Compliance Workspace</p>
            </div>
            <div className="rounded-lg bg-blue-50 px-4 py-2">
              <p className="text-sm font-medium text-blue-900">Single Entry Point</p>
              <p className="text-xs text-blue-700">Audit-Ready Compliance System</p>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-7 lg:w-auto">
            <TabsTrigger value="dashboard" className="flex items-center gap-2">
              <LayoutDashboard className="size-4" />
              <span className="hidden sm:inline">Dashboard</span>
            </TabsTrigger>
            <TabsTrigger value="intake" className="flex items-center gap-2">
              <Upload className="size-4" />
              <span className="hidden sm:inline">Invoice Intake</span>
            </TabsTrigger>
            <TabsTrigger value="register" className="flex items-center gap-2">
              <FileText className="size-4" />
              <span className="hidden sm:inline">Invoice Register</span>
            </TabsTrigger>
            <TabsTrigger value="w9-submit" className="flex items-center gap-2">
              <CheckSquare className="size-4" />
              <span className="hidden sm:inline">W-9 Submission</span>
            </TabsTrigger>
            <TabsTrigger value="w9-archive" className="flex items-center gap-2">
              <FolderOpen className="size-4" />
              <span className="hidden sm:inline">W-9 Archive</span>
            </TabsTrigger>
            <TabsTrigger value="disputes" className="flex items-center gap-2">
              <AlertTriangle className="size-4" />
              <span className="hidden sm:inline">Disputes</span>
            </TabsTrigger>
            <TabsTrigger value="guide" className="flex items-center gap-2">
              <BookOpen className="size-4" />
              <span className="hidden sm:inline">Operations Guide</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="dashboard">
            <Dashboard stats={stats} reminders={reminders} />
          </TabsContent>

          <TabsContent value="intake">
            <InvoiceIntake onSuccess={fetchData} />
          </TabsContent>

          <TabsContent value="register">
            <InvoiceRegister invoices={invoices} onUpdate={fetchData} />
          </TabsContent>

          <TabsContent value="w9-submit">
            <W9Submission onSuccess={fetchData} />
          </TabsContent>

          <TabsContent value="w9-archive">
            <W9Archive w9s={w9s} />
          </TabsContent>

          <TabsContent value="disputes">
            <DisputeLog disputes={disputes} onUpdate={fetchData} />
          </TabsContent>

          <TabsContent value="guide">
            <OperationsGuide />
          </TabsContent>
        </Tabs>
      </main>

      {/* Footer */}
      <footer className="border-t bg-white py-6 mt-12">
        <div className="container mx-auto px-4 text-center text-sm text-gray-600">
          <p className="font-medium">Core Governance Safeguards Active</p>
          <div className="mt-2 flex flex-wrap items-center justify-center gap-4 text-xs">
            <span>✓ Automatic Record Creation</span>
            <span>✓ Timers & Reminders</span>
            <span>✓ Single Source of Truth</span>
            <span>✓ Continuity Protection</span>
            <span>✓ Audit-Ready Records</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
