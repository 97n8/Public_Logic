import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/app/components/ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/app/components/ui/accordion";
import { BookOpen, FileText, CheckCircle, AlertCircle, Clock, DollarSign } from "lucide-react";

export function OperationsGuide() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <BookOpen className="size-5" />
          Staff Operations Guide
        </CardTitle>
        <CardDescription>
          Standard procedures for invoice & W-9 compliance management
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Accordion type="single" collapsible className="w-full">
          <AccordionItem value="item-1">
            <AccordionTrigger className="text-left">
              <div className="flex items-center gap-2">
                <FileText className="size-4" />
                <span>How to Submit an Invoice</span>
              </div>
            </AccordionTrigger>
            <AccordionContent className="space-y-3 text-sm">
              <p className="font-medium">Single Entry Point Process:</p>
              <ol className="list-decimal space-y-2 pl-5">
                <li>Navigate to the "Invoice Intake" tab</li>
                <li>Complete all required fields:
                  <ul className="list-disc pl-5 mt-1">
                    <li>Vendor name and invoice number</li>
                    <li>Invoice amount (exact dollar amount)</li>
                    <li>Department to be charged</li>
                    <li>Due date for payment</li>
                    <li>Brief description of services/goods</li>
                    <li>Your name as submitter</li>
                  </ul>
                </li>
                <li>In production, attach invoice PDF or scan</li>
                <li>Click "Submit Invoice"</li>
                <li>System automatically creates audit trail entry</li>
                <li>Invoice enters "Pending Verification" status</li>
              </ol>
              <p className="rounded-lg bg-blue-50 p-3 text-blue-900">
                <strong>Key Principle:</strong> All invoices must enter through this single interface - no parallel systems or informal email chains.
              </p>
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="item-2">
            <AccordionTrigger className="text-left">
              <div className="flex items-center gap-2">
                <CheckCircle className="size-4" />
                <span>Invoice Approval Workflow</span>
              </div>
            </AccordionTrigger>
            <AccordionContent className="space-y-3 text-sm">
              <p className="font-medium">Structured Approval Steps:</p>
              <ol className="list-decimal space-y-2 pl-5">
                <li><strong>Department Verification:</strong> Department head verifies invoice accuracy and budget availability</li>
                <li><strong>Approval Routing:</strong> 
                  <ul className="list-disc pl-5 mt-1">
                    <li>Initial approval: Department manager</li>
                    <li>Secondary approval: Finance review (amounts over $1,000)</li>
                    <li>Final approval: Authorized signatory</li>
                  </ul>
                </li>
                <li>Each approver:
                  <ul className="list-disc pl-5 mt-1">
                    <li>Reviews invoice in Master Invoice Register</li>
                    <li>Clicks "View" to see full details</li>
                    <li>Enters their name and approval step</li>
                    <li>Adds comments if needed</li>
                    <li>Clicks "Approve Invoice"</li>
                  </ul>
                </li>
                <li>System records signature and timestamp automatically</li>
                <li>Invoice advances to next approval step or "Approved" status</li>
              </ol>
              <p className="rounded-lg bg-green-50 p-3 text-green-900">
                <strong>Audit Protection:</strong> All approvals are automatically timestamped and recorded in the permanent audit trail.
              </p>
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="item-3">
            <AccordionTrigger className="text-left">
              <div className="flex items-center gap-2">
                <DollarSign className="size-4" />
                <span>Recording Payments</span>
              </div>
            </AccordionTrigger>
            <AccordionContent className="space-y-3 text-sm">
              <p className="font-medium">Payment Authorization Process:</p>
              <ol className="list-decimal space-y-2 pl-5">
                <li>Only "Approved" invoices can receive payments</li>
                <li>Navigate to Master Invoice Register</li>
                <li>Click "View" on approved invoice</li>
                <li>Scroll to "Record Payment" section</li>
                <li>Enter:
                  <ul className="list-disc pl-5 mt-1">
                    <li>Amount paid (should match invoice amount)</li>
                    <li>Payment method (Check, ACH, Wire, etc.)</li>
                    <li>Your name as recorder</li>
                    <li>Reference number (check #, transaction ID)</li>
                  </ul>
                </li>
                <li>Click "Record Payment"</li>
                <li>Invoice status automatically updates to "Paid"</li>
                <li>Payment record linked to invoice permanently</li>
              </ol>
              <p className="rounded-lg bg-purple-50 p-3 text-purple-900">
                <strong>Proof of Payment:</strong> Payment records create permanent proof-of-payment trail for audits.
              </p>
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="item-4">
            <AccordionTrigger className="text-left">
              <div className="flex items-center gap-2">
                <FileText className="size-4" />
                <span>W-9 Form Management</span>
              </div>
            </AccordionTrigger>
            <AccordionContent className="space-y-3 text-sm">
              <p className="font-medium">Annual Refresh Requirements:</p>
              <ol className="list-decimal space-y-2 pl-5">
                <li><strong>Initial Submission:</strong>
                  <ul className="list-disc pl-5 mt-1">
                    <li>Navigate to "W-9 Submission" tab</li>
                    <li>Enter vendor information completely</li>
                    <li>In production, attach signed W-9 PDF</li>
                    <li>System records submission date</li>
                    <li>Automatic refresh reminder set for 1 year</li>
                  </ul>
                </li>
                <li><strong>Annual Refresh:</strong>
                  <ul className="list-disc pl-5 mt-1">
                    <li>System sends automatic reminder 30 days before due</li>
                    <li>High-priority alert at 7 days</li>
                    <li>Submit refreshed W-9 using same form</li>
                    <li>System updates last refresh date automatically</li>
                  </ul>
                </li>
                <li><strong>Archive Access:</strong>
                  <ul className="list-disc pl-5 mt-1">
                    <li>W-9s organized by department</li>
                    <li>View all forms in "W-9 Archive" tab</li>
                    <li>Status indicators show refresh requirements</li>
                  </ul>
                </li>
              </ol>
              <p className="rounded-lg bg-orange-50 p-3 text-orange-900">
                <strong>Compliance Protection:</strong> Never miss a W-9 refresh. System automatically surfaces overdue forms.
              </p>
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="item-5">
            <AccordionTrigger className="text-left">
              <div className="flex items-center gap-2">
                <AlertCircle className="size-4" />
                <span>Handling Disputes & Exceptions</span>
              </div>
            </AccordionTrigger>
            <AccordionContent className="space-y-3 text-sm">
              <p className="font-medium">Exception Handling Process:</p>
              <ol className="list-decimal space-y-2 pl-5">
                <li>Navigate to "Disputes" tab</li>
                <li>Click "Log New Dispute"</li>
                <li>Select dispute type:
                  <ul className="list-disc pl-5 mt-1">
                    <li>Invoice Discrepancy</li>
                    <li>Missing W-9</li>
                    <li>Payment Issue</li>
                    <li>Approval Delay</li>
                    <li>Documentation Error</li>
                  </ul>
                </li>
                <li>Enter related invoice ID if applicable</li>
                <li>Provide detailed description</li>
                <li>System timestamps and tracks the dispute</li>
                <li>To resolve:
                  <ul className="list-disc pl-5 mt-1">
                    <li>Enter resolution details</li>
                    <li>Enter your name as resolver</li>
                    <li>Click "Resolve"</li>
                    <li>System records resolution permanently</li>
                  </ul>
                </li>
              </ol>
              <p className="rounded-lg bg-red-50 p-3 text-red-900">
                <strong>Early Correction:</strong> Logging exceptions creates upstream evidence for early issue detection and correction.
              </p>
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="item-6">
            <AccordionTrigger className="text-left">
              <div className="flex items-center gap-2">
                <Clock className="size-4" />
                <span>Understanding System Reminders</span>
              </div>
            </AccordionTrigger>
            <AccordionContent className="space-y-3 text-sm">
              <p className="font-medium">Automatic Timer & Reminder System:</p>
              <div className="space-y-3">
                <div>
                  <p className="font-medium text-blue-700">Payment Due Reminders:</p>
                  <ul className="list-disc pl-5 mt-1">
                    <li>Appear when payment due date is within 7 days</li>
                    <li>High priority (red) when due within 3 days</li>
                    <li>Show vendor name, amount, and days remaining</li>
                  </ul>
                </div>
                <div>
                  <p className="font-medium text-blue-700">W-9 Refresh Reminders:</p>
                  <ul className="list-disc pl-5 mt-1">
                    <li>Appear 30 days before annual refresh due</li>
                    <li>High priority (red) when due within 7 days</li>
                    <li>Show vendor name, department, and days remaining</li>
                  </ul>
                </div>
                <div>
                  <p className="font-medium text-blue-700">Dashboard View:</p>
                  <ul className="list-disc pl-5 mt-1">
                    <li>Urgent reminders highlighted at top of dashboard</li>
                    <li>All upcoming reminders listed below statistics</li>
                    <li>Real-time updates as deadlines approach</li>
                  </ul>
                </div>
              </div>
              <p className="rounded-lg bg-yellow-50 p-3 text-yellow-900">
                <strong>Proactive Management:</strong> Timers surface issues early, preventing last-minute scrambles and missed deadlines.
              </p>
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="item-7">
            <AccordionTrigger className="text-left">
              <div className="flex items-center gap-2">
                <CheckCircle className="size-4" />
                <span>Continuity & Turnover Protection</span>
              </div>
            </AccordionTrigger>
            <AccordionContent className="space-y-3 text-sm">
              <p className="font-medium">Key Continuity Principles:</p>
              <div className="space-y-3">
                <div className="rounded-lg bg-blue-50 p-3">
                  <p className="font-medium text-blue-900">No Informal Knowledge Required</p>
                  <ul className="list-disc pl-5 mt-1 text-blue-900">
                    <li>All procedures documented in this guide</li>
                    <li>No reliance on tribal knowledge or email chains</li>
                    <li>New staff can onboard using this system immediately</li>
                  </ul>
                </div>
                <div className="rounded-lg bg-green-50 p-3">
                  <p className="font-medium text-green-900">Single Source of Truth</p>
                  <ul className="list-disc pl-5 mt-1 text-green-900">
                    <li>Master Invoice Register contains all invoice data</li>
                    <li>No parallel spreadsheets or tracking systems</li>
                    <li>Complete audit trail preserved permanently</li>
                  </ul>
                </div>
                <div className="rounded-lg bg-purple-50 p-3">
                  <p className="font-medium text-purple-900">Automatic Record Creation</p>
                  <ul className="list-disc pl-5 mt-1 text-purple-900">
                    <li>System creates records automatically</li>
                    <li>Timestamps and user tracking built-in</li>
                    <li>No manual tracking or reconstruction needed</li>
                  </ul>
                </div>
                <div className="rounded-lg bg-orange-50 p-3">
                  <p className="font-medium text-orange-900">Audit-Ready Years Later</p>
                  <ul className="list-disc pl-5 mt-1 text-orange-900">
                    <li>Complete history preserved for every invoice</li>
                    <li>Payment proof linked permanently</li>
                    <li>W-9 records organized and accessible</li>
                    <li>No need to reconstruct records from memory or emails</li>
                  </ul>
                </div>
              </div>
            </AccordionContent>
          </AccordionItem>
        </Accordion>

        <div className="mt-6 space-y-3 rounded-lg border-2 border-blue-200 bg-blue-50 p-4">
          <p className="font-semibold text-blue-900">System Benefits Summary:</p>
          <ul className="space-y-1 text-sm text-blue-900">
            <li>✓ Single entry point prevents parallel systems</li>
            <li>✓ Automatic audit trails for compliance</li>
            <li>✓ Structured workflows eliminate confusion</li>
            <li>✓ Timers and reminders prevent missed deadlines</li>
            <li>✓ Complete payment proof trail</li>
            <li>✓ Annual W-9 refresh automation</li>
            <li>✓ Continuity protection against staff turnover</li>
            <li>✓ Audit-ready records years later without reconstruction</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  );
}
