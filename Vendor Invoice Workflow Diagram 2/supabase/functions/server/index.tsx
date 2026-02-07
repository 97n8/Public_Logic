import { Hono } from "npm:hono";
import { cors } from "npm:hono/cors";
import { logger } from "npm:hono/logger";
import * as kv from "./kv_store.tsx";
const app = new Hono();

// Enable logger
app.use('*', logger(console.log));

// Enable CORS for all routes and methods
app.use(
  "/*",
  cors({
    origin: "*",
    allowHeaders: ["Content-Type", "Authorization"],
    allowMethods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    exposeHeaders: ["Content-Length"],
    maxAge: 600,
  }),
);

// Health check endpoint
app.get("/make-server-75bb27b9/health", (c) => {
  return c.json({ status: "ok" });
});

// ===== INVOICES =====

// Create new invoice
app.post("/make-server-75bb27b9/invoices", async (c) => {
  try {
    const body = await c.req.json();
    const id = `invoice:${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    
    const invoice = {
      id,
      ...body,
      status: "pending_verification",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      approvals: [],
      history: [{
        action: "created",
        timestamp: new Date().toISOString(),
        user: body.submittedBy || "System"
      }]
    };
    
    await kv.set(id, invoice);
    return c.json({ success: true, invoice });
  } catch (error) {
    console.error("Error creating invoice:", error);
    return c.json({ success: false, error: String(error) }, 500);
  }
});

// List all invoices
app.get("/make-server-75bb27b9/invoices", async (c) => {
  try {
    const invoices = await kv.getByPrefix("invoice:");
    return c.json({ success: true, invoices });
  } catch (error) {
    console.error("Error listing invoices:", error);
    return c.json({ success: false, error: String(error) }, 500);
  }
});

// Get single invoice
app.get("/make-server-75bb27b9/invoices/:id", async (c) => {
  try {
    const id = c.req.param("id");
    const invoice = await kv.get(id);
    
    if (!invoice) {
      return c.json({ success: false, error: "Invoice not found" }, 404);
    }
    
    return c.json({ success: true, invoice });
  } catch (error) {
    console.error("Error getting invoice:", error);
    return c.json({ success: false, error: String(error) }, 500);
  }
});

// Update invoice
app.put("/make-server-75bb27b9/invoices/:id", async (c) => {
  try {
    const id = c.req.param("id");
    const updates = await c.req.json();
    const invoice = await kv.get(id);
    
    if (!invoice) {
      return c.json({ success: false, error: "Invoice not found" }, 404);
    }
    
    const updatedInvoice = {
      ...invoice,
      ...updates,
      updatedAt: new Date().toISOString(),
      history: [
        ...(invoice.history || []),
        {
          action: "updated",
          timestamp: new Date().toISOString(),
          user: updates.updatedBy || "System",
          changes: updates
        }
      ]
    };
    
    await kv.set(id, updatedInvoice);
    return c.json({ success: true, invoice: updatedInvoice });
  } catch (error) {
    console.error("Error updating invoice:", error);
    return c.json({ success: false, error: String(error) }, 500);
  }
});

// Approve invoice
app.post("/make-server-75bb27b9/invoices/:id/approve", async (c) => {
  try {
    const id = c.req.param("id");
    const { approver, comments, step } = await c.req.json();
    const invoice = await kv.get(id);
    
    if (!invoice) {
      return c.json({ success: false, error: "Invoice not found" }, 404);
    }
    
    const approval = {
      approver,
      step,
      comments,
      timestamp: new Date().toISOString()
    };
    
    const updatedInvoice = {
      ...invoice,
      approvals: [...(invoice.approvals || []), approval],
      status: step === "final" ? "approved" : "pending_approval",
      updatedAt: new Date().toISOString(),
      history: [
        ...(invoice.history || []),
        {
          action: "approved",
          timestamp: new Date().toISOString(),
          user: approver,
          step
        }
      ]
    };
    
    await kv.set(id, updatedInvoice);
    return c.json({ success: true, invoice: updatedInvoice });
  } catch (error) {
    console.error("Error approving invoice:", error);
    return c.json({ success: false, error: String(error) }, 500);
  }
});

// Record payment
app.post("/make-server-75bb27b9/invoices/:id/payment", async (c) => {
  try {
    const id = c.req.param("id");
    const paymentData = await c.req.json();
    const invoice = await kv.get(id);
    
    if (!invoice) {
      return c.json({ success: false, error: "Invoice not found" }, 404);
    }
    
    const paymentId = `payment:${id}:${Date.now()}`;
    const payment = {
      id: paymentId,
      invoiceId: id,
      ...paymentData,
      timestamp: new Date().toISOString()
    };
    
    await kv.set(paymentId, payment);
    
    const updatedInvoice = {
      ...invoice,
      status: "paid",
      payment,
      updatedAt: new Date().toISOString(),
      history: [
        ...(invoice.history || []),
        {
          action: "payment_recorded",
          timestamp: new Date().toISOString(),
          user: paymentData.recordedBy || "System",
          amount: paymentData.amount
        }
      ]
    };
    
    await kv.set(id, updatedInvoice);
    return c.json({ success: true, invoice: updatedInvoice, payment });
  } catch (error) {
    console.error("Error recording payment:", error);
    return c.json({ success: false, error: String(error) }, 500);
  }
});

// ===== W-9 FORMS =====

// Submit W-9
app.post("/make-server-75bb27b9/w9", async (c) => {
  try {
    const body = await c.req.json();
    const id = `w9:${body.vendorId || Date.now()}`;
    
    const w9 = {
      id,
      ...body,
      submittedAt: new Date().toISOString(),
      lastRefreshed: new Date().toISOString(),
      nextRefreshDue: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString(),
      status: "active"
    };
    
    await kv.set(id, w9);
    return c.json({ success: true, w9 });
  } catch (error) {
    console.error("Error submitting W-9:", error);
    return c.json({ success: false, error: String(error) }, 500);
  }
});

// List W-9s
app.get("/make-server-75bb27b9/w9", async (c) => {
  try {
    const w9s = await kv.getByPrefix("w9:");
    return c.json({ success: true, w9s });
  } catch (error) {
    console.error("Error listing W-9s:", error);
    return c.json({ success: false, error: String(error) }, 500);
  }
});

// Get W-9 by vendor ID
app.get("/make-server-75bb27b9/w9/:vendorId", async (c) => {
  try {
    const vendorId = c.req.param("vendorId");
    const id = `w9:${vendorId}`;
    const w9 = await kv.get(id);
    
    if (!w9) {
      return c.json({ success: false, error: "W-9 not found" }, 404);
    }
    
    return c.json({ success: true, w9 });
  } catch (error) {
    console.error("Error getting W-9:", error);
    return c.json({ success: false, error: String(error) }, 500);
  }
});

// Update/Refresh W-9
app.put("/make-server-75bb27b9/w9/:vendorId", async (c) => {
  try {
    const vendorId = c.req.param("vendorId");
    const id = `w9:${vendorId}`;
    const updates = await c.req.json();
    const w9 = await kv.get(id);
    
    if (!w9) {
      return c.json({ success: false, error: "W-9 not found" }, 404);
    }
    
    const updatedW9 = {
      ...w9,
      ...updates,
      lastRefreshed: new Date().toISOString(),
      nextRefreshDue: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString()
    };
    
    await kv.set(id, updatedW9);
    return c.json({ success: true, w9: updatedW9 });
  } catch (error) {
    console.error("Error updating W-9:", error);
    return c.json({ success: false, error: String(error) }, 500);
  }
});

// ===== DISPUTES / EXCEPTIONS =====

// Create dispute
app.post("/make-server-75bb27b9/disputes", async (c) => {
  try {
    const body = await c.req.json();
    const id = `dispute:${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    
    const dispute = {
      id,
      ...body,
      createdAt: new Date().toISOString(),
      status: "open",
      resolution: null
    };
    
    await kv.set(id, dispute);
    return c.json({ success: true, dispute });
  } catch (error) {
    console.error("Error creating dispute:", error);
    return c.json({ success: false, error: String(error) }, 500);
  }
});

// List disputes
app.get("/make-server-75bb27b9/disputes", async (c) => {
  try {
    const disputes = await kv.getByPrefix("dispute:");
    return c.json({ success: true, disputes });
  } catch (error) {
    console.error("Error listing disputes:", error);
    return c.json({ success: false, error: String(error) }, 500);
  }
});

// Update dispute
app.put("/make-server-75bb27b9/disputes/:id", async (c) => {
  try {
    const id = c.req.param("id");
    const updates = await c.req.json();
    const dispute = await kv.get(id);
    
    if (!dispute) {
      return c.json({ success: false, error: "Dispute not found" }, 404);
    }
    
    const updatedDispute = {
      ...dispute,
      ...updates,
      updatedAt: new Date().toISOString()
    };
    
    await kv.set(id, updatedDispute);
    return c.json({ success: true, dispute: updatedDispute });
  } catch (error) {
    console.error("Error updating dispute:", error);
    return c.json({ success: false, error: String(error) }, 500);
  }
});

// ===== REMINDERS =====

// Get active reminders
app.get("/make-server-75bb27b9/reminders", async (c) => {
  try {
    const now = new Date().toISOString();
    const invoices = await kv.getByPrefix("invoice:");
    const w9s = await kv.getByPrefix("w9:");
    
    const reminders = [];
    
    // Check invoices for payment due reminders
    for (const invoice of invoices) {
      if (invoice.status === "approved" && invoice.dueDate) {
        const dueDate = new Date(invoice.dueDate);
        const daysUntilDue = Math.ceil((dueDate.getTime() - Date.now()) / (1000 * 60 * 60 * 24));
        
        if (daysUntilDue <= 7 && daysUntilDue >= 0) {
          reminders.push({
            type: "payment_due",
            priority: daysUntilDue <= 3 ? "high" : "medium",
            invoiceId: invoice.id,
            vendor: invoice.vendor,
            amount: invoice.amount,
            dueDate: invoice.dueDate,
            daysUntilDue
          });
        }
      }
    }
    
    // Check W-9s for refresh reminders
    for (const w9 of w9s) {
      if (w9.nextRefreshDue) {
        const refreshDate = new Date(w9.nextRefreshDue);
        const daysUntilRefresh = Math.ceil((refreshDate.getTime() - Date.now()) / (1000 * 60 * 60 * 24));
        
        if (daysUntilRefresh <= 30 && daysUntilRefresh >= 0) {
          reminders.push({
            type: "w9_refresh",
            priority: daysUntilRefresh <= 7 ? "high" : "medium",
            vendorId: w9.vendorId,
            vendorName: w9.vendorName,
            department: w9.department,
            nextRefreshDue: w9.nextRefreshDue,
            daysUntilRefresh
          });
        }
      }
    }
    
    return c.json({ success: true, reminders });
  } catch (error) {
    console.error("Error getting reminders:", error);
    return c.json({ success: false, error: String(error) }, 500);
  }
});

// ===== ANALYTICS / AUDIT =====

// Get dashboard stats
app.get("/make-server-75bb27b9/stats", async (c) => {
  try {
    const invoices = await kv.getByPrefix("invoice:");
    const w9s = await kv.getByPrefix("w9:");
    const disputes = await kv.getByPrefix("dispute:");
    
    const stats = {
      invoices: {
        total: invoices.length,
        pending: invoices.filter(i => i.status === "pending_verification" || i.status === "pending_approval").length,
        approved: invoices.filter(i => i.status === "approved").length,
        paid: invoices.filter(i => i.status === "paid").length,
        totalAmount: invoices.reduce((sum, i) => sum + (parseFloat(i.amount) || 0), 0)
      },
      w9s: {
        total: w9s.length,
        active: w9s.filter(w => w.status === "active").length,
        needingRefresh: w9s.filter(w => {
          const daysUntil = Math.ceil((new Date(w.nextRefreshDue).getTime() - Date.now()) / (1000 * 60 * 60 * 24));
          return daysUntil <= 30;
        }).length
      },
      disputes: {
        total: disputes.length,
        open: disputes.filter(d => d.status === "open").length,
        resolved: disputes.filter(d => d.status === "resolved").length
      }
    };
    
    return c.json({ success: true, stats });
  } catch (error) {
    console.error("Error getting stats:", error);
    return c.json({ success: false, error: String(error) }, 500);
  }
});

Deno.serve(app.fetch);