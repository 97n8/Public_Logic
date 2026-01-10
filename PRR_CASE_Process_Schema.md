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
flowchart TB
    %% ==================================================
    %% VAULTPRR — Public Records Request Lifecycle
    %% ==================================================

    START([PRR Received]) --> INTAKE["Step: Intake<br/>Keeper: Permanent"]

    INTAKE --> CALC["SystemEvent: Compute Timers & Validity<br/>T10 (Initial Response), T20 (Petition), T25 (Municipal Limit)<br/>EffectiveReceiptDate = next business day if weekend/holiday/closure"]

    CALC --> ASSESS["Step: RAO Initial Assessment<br/>Keeper: Permanent"]

    %% --- Clarification (toll / loop) ---
    ASSESS -->|Clarification Needed| CLARIFY["Step: Request Clarification (email)<br/>Keeper: Reference"]
    CLARIFY --> WAIT["Wait State: Requester Response Pending<br/>(No state mutation)"]
    WAIT --> TOLL["SystemEvent: Toll & Recompute Deadlines<br/>Keeper: Permanent"]
    TOLL --> ASSESS

    %% --- No records branch ---
    ASSESS -->|No Responsive Records| NOREC["Document: No Records Response<br/>Keeper: Permanent<br/>LOCKED"]
    NOREC --> CLOSE_NO["Close: No Records<br/>Keeper: Permanent"]

    %% --- Proceed (search) ---
    ASSESS -->|Proceed to Search| GATHER["Step: Gather / Search Records<br/>Keeper: Permanent"]
    GATHER --> EXEMPT["Step: Exemption & Segregability Review<br/>Keeper: Permanent"]

    %% --- All exempt (withholding) ---
    EXEMPT -->|All Exempt| DENY["Document: Withholding Letter<br/>Keeper: Permanent<br/>LOCKED"]
    DENY --> CLOSE_DENY["Close: Withheld<br/>Keeper: Permanent"]

    %% --- Partial/none exempt (redactions?) ---
    EXEMPT -->|Partial or No Exemptions| REDACT{"Redactions Needed?"}
    REDACT -->|Yes| APPLY["Step: Apply Redactions<br/>Keeper: Reference"]
    APPLY --> LEGAL["Step: Counsel Review (optional gate)<br/>Keeper: Reference"]
    LEGAL -->|Approved| PACKAGE["Document: Response Package<br/>(Letter + Records + Exemption Log)<br/>Keeper: Permanent<br/>LOCKED"]
    LEGAL -->|Needs Revision| APPLY
    REDACT -->|No| PACKAGE

    %% --- Timer / fee enforcement gates ---
    PACKAGE --> T10CHECK{"Gate: T10 Met?<br/>(Initial written response within 10 business days)"}

    T10CHECK -->|No| FEEWAIVE["SystemEvent: FeesAllowed = false<br/>(Fee waiver by rule)<br/>Keeper: Permanent"]
    T10CHECK -->|Yes| FEES{"Decision: Fees Required?"}

    %% If T10 missed → force no-fee path
    FEEWAIVE --> DELIVER["Step: Deliver Records (email/link/media)<br/>Keeper: Permanent"]
    FEEWAIVE --> NOTE10["Note: Still must proceed<br/>Capture compliance risk<br/>Keeper: Permanent"]

    %% Normal fees path (only if T10 met)
    FEES -->|No| DELIVER
    FEES -->|Yes| ESTIMATE["Step: Itemized Fee Estimate (if applicable)<br/>Keeper: Permanent"]
    ESTIMATE --> INVOICE["Step: Invoice Fees<br/>Keeper: Transactional"]
    INVOICE --> PAYMENT{"Decision: Payment Received?"}

    PAYMENT -->|Yes| DELIVER
    PAYMENT -->|No - After 30 days| CLOSE_NONPAY["Close: Non-Payment<br/>Keeper: Permanent"]

    %% Final closure
    DELIVER --> CLOSE_OK["Close: Delivered<br/>Keeper: Permanent"]

    %% --- Forecast / Petition logic (T25/T20) ---
    ASSESS --> FORECAST{"SystemEvent: Forecast Completion > T25?"}
    FORECAST -->|No| GATHER
    FORECAST -->|Yes & requester agrees| AGREED["Asset: Requester Agreement to Extend<br/>Keeper: Permanent"]
    AGREED --> GATHER
    FORECAST -->|Yes & no agreement| PETITION["Document: Petition to Supervisor + Copy to Requester<br/>Keeper: Permanent"]
    PETITION --> GATHER

    %% Styling (optional - makes it prettier)
    style INTAKE       fill:#e8f5e9,stroke:#333
    style CALC         fill:#e8f5e9,stroke:#333
    style ASSESS       fill:#fff3e0,stroke:#333
    style GATHER       fill:#e3f2fd,stroke:#333
    style EXEMPT       fill:#fff3e0,stroke:#333
    style APPLY        fill:#e3f2fd,stroke:#333
    style LEGAL        fill:#fff3e0,stroke:#333
    style PACKAGE      fill:#4caf50,stroke:#2e7d32,color:#fff
    style DENY         fill:#4caf50,stroke:#2e7d32,color:#fff
    style NOREC        fill:#4caf50,stroke:#2e7d32,color:#fff
    style FEEWAIVE     fill:#fecaca,stroke:#991b1b
    style CLOSE_OK     fill:#c8e6c9,stroke:#2e7d32
    style CLOSE_NO     fill:#c8e6c9,stroke:#2e7d32
    style CLOSE_DENY   fill:#c8e6c9,stroke:#2e7d32
    style CLOSE_NONPAY fill:#fecaca,stroke:#991b1b
    style PETITION     fill:#fff3e0,stroke:#ef6c00
    style AGREED       fill:#e8f5e9,stroke:#2e7d32
flowchart LR
    CASE["CASE Workspace"] --> PROCESS["Process"]
    PROCESS --> STEP["Step"]
    STEP --> PATH["Path"]
    CASE --> ASSET["Asset"]
    CASE --> LOG["Log"]
    ASSET --> LOG
    STEP --> LOG
flowchart TB
    ASSET["Asset"] --> TYPE["AssetType"]
    ASSET --> RETENTION["RetentionPolicy"]
    ASSET --> LOCK["Locked / VersionChain"]
    ASSET --> HASH["Integrity Hash (optional)"]
    ASSET --> EXEMPT["Exemption Tags / Redaction Status"]
    ASSET --> CASELINK["CASE ID"]

    classDef locked fill:#166534,stroke:#14532d,color:#ffffff
Examples of LOCKED (immutable) Assets:

No Records Letter
Withholding Letter
Response Package
flowchart LR
    ACTION["Any Action"] --> LOG["Audit Log"]
    LOG --> TIMESTAMP["Timestamp"]
    LOG --> ACTOR["Actor"]
    LOG --> STEPREF["StepID"]
    LOG --> ASSETREF["AssetIDs"]
    LOG --> RESULT["Outcome"]
