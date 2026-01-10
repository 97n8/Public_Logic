# VAULTPRR™ — Canonical Architecture for Massachusetts Public Records Requests

**Framework-as-a-Standard™ • v1.0**  
**Authority:** M.G.L. c. 66, §10 • 950 CMR 32.00  
**Stewardship:** PublicLogic™

---

## 1. What This Is

VAULTPRR™ is a **CASE-based, statute-enforced operating architecture** for handling Massachusetts Public Records Requests (PRR).

It exists to guarantee that:

- statutory deadlines are **enforced by system logic**, not human memory  
- legal consequences are **automatic and auditable**  
- records are **retained, locked, and destroyed lawfully**  
- institutional risk is carried by **structure**, never by individuals

This is **not** a UI mockup.  
This is **not** an SOP.  
This is **not** training material.

This is the **canonical architecture contract** every runtime must satisfy.

---

## 2. Core Premise

Public Records Requests are **regulated legal cases**, not support tickets.

Therefore:

- every request lives inside a **CASE Workspace**  
- every document is an **Asset**  
- every action is **logged**  
- every deadline is **computed and enforced**  
- every retention rule is **explicit**

If it is not in the CASE → it does not exist.  
If it is not logged → it is not defensible.

---

## 3. Governing Law → System Behavior Mapping

### M.G.L. c. 66, §10

| Statute Requirement                       | Enforced System Behavior                          |
|-------------------------------------------|---------------------------------------------------|
| 10 business day initial response          | **T10 gate** controls fee eligibility             |
| 25 business day municipal outer limit     | **T25 forecast gate** + agreement/petition logic  |
| Fees prohibited if late                   | `FeesAllowed = false` enforced automatically      |
| Written responses required                | Final artifacts must be **LOCKED**                |

### 950 CMR 32.00

| Regulation                               | Enforced System Behavior                          |
|------------------------------------------|---------------------------------------------------|
| 20-day petition window                   | **T20 timer** enforced on CASE                    |
| Extension limits                         | Petition artifacts **LOCKED**                     |
| 90-day appeal rights                     | **T90** tracked post-closure                      |

---

## 4. CASE Workspace — The Foundational Legal Container

A **CASE Workspace** is the single, indivisible unit of:

- authority  
- retention  
- audit  
- survivability through staff turnover

### CASE Responsibilities
- compute & store all statutory timers  
- own all Assets (documents, evidence, correspondence)  
- enforce retention & destruction schedules  
- maintain the single, authoritative audit trail

No PRR work exists outside a CASE Workspace.

---

## 5. Retention & Immutability Model

Retention is **declared**, never inferred.

### Record Classes

| Class          | Retention     | Typical Examples                              |
|----------------|---------------|-----------------------------------------------|
| **KEEPER**     | Permanent     | Final responses, deadline history, closure    |
| **Reference**  | 7 years       | Redaction work, counsel notes, search evidence|
| **Transactional** | 1–2 years  | Invoices, payment receipts (policy choice)    |

### Immutability Rules
- Final response artifacts are **LOCKED** on creation  
- No in-place edits allowed  
- Corrections require **versioned replacement**  
- Superseded versions remain linked & retained

---

## 6. Statutory Timers — First-Class CASE Objects

All timers are derived from **EffectiveReceiptDate**  
(next business day if received on weekend, holiday, or unexpected closure).

| Timer | Meaning                                   |
|-------|-------------------------------------------|
| **T10** | Initial written response due              |
| **T20** | Petition window                           |
| **T25** | Municipal outer production limit          |
| **T90** | Appeal window (tracked post-closure)      |

Timers live on the **CASE**, not on individual steps.

---

# SYSTEM VIEWS (MERMAID)

Each diagram below is:

- valid Mermaid syntax  
- independently renderable (copy → Mermaid Live)  
- GitHub-friendly

Together they constitute the complete VAULTPRR™ architecture.

### 7. System Orientation — What Exists

```mermaid
flowchart LR
    CASE["PRR CASE Workspace"]:::core
    CASE --> PROCESS["Process<br/>(active execution)"]
    CASE --> ASSETS["Assets<br/>(all documents)"]
    CASE --> LOG["Audit Log"]
    CASE --> TIMERS["T10 • T20 • T25 • T90"]

    PROCESS --> STEPS["Typed Steps"]
    STEPS --> PATHS["Conditional Paths"]

    classDef core fill:#1e3a8a,stroke:#60a5fa,color:#ffffff,font-weight:bold
