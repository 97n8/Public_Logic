# PRR CASE — Governing Process Schema (Authoritative)

This diagram represents the **authoritative CASE-centric process model** for Public Records Requests.

**Reading rules:**
- The **CASE** is the legal, audit, and retention container.
- **Assets remain town property at all times**. Storage location is external; custody and lifecycle are governed here.
- Steps, paths, expressions, and permissions are **enforcement mechanisms**, not UI choices.
- Logs are immutable and sufficient to reconstruct decisions without staff narrative.

This is **not a UI mock**, **not a feature request**, and **not discretionary logic**.

---

```mermaid
flowchart TB

%% =========================
%% CORE CASE CONTAINER
%% =========================
CASE["CASE
(case_id
type = PRR
owner = RAO
status
retention_policy)"]

%% =========================
%% PROCESS
%% =========================
PROCESS["Process
(versioned
permission-bound)"]

CASE --> PROCESS

%% =========================
%% STEPS
%% =========================
INTAKE["Step: Intake
(FormStep)"]

TIMER["Step: Timer Calculation
(Automated)"]

ASSESS["Step: RAO Assessment
(Review)"]

CLARIFY["Step: Clarification
(SendEmail + Toll)"]

SEARCH["Step: Search & Collection
(Manual / Automated)"]

EXEMPT["Step: Exemption Analysis
(Review)"]

REDACT["Step: Redaction
(Document)"]

RESPONSE["Step: Response Formation
(Document – LOCKED)"]

FEES["Step: Fees & Delivery
(Payment / SendEmail)"]

CLOSE["Step: Closure
(System)"]

RETENTION["Post-Response
Retention & Appeal Window"]

PROCESS --> INTAKE
INTAKE --> TIMER
TIMER --> ASSESS

ASSESS -->|Clarification Needed| CLARIFY
CLARIFY --> ASSESS

ASSESS -->|Proceed| SEARCH
SEARCH --> EXEMPT

EXEMPT -->|Redaction Required| REDACT
REDACT --> RESPONSE

EXEMPT -->|No Redaction| RESPONSE

RESPONSE --> FEES
FEES --> CLOSE
CLOSE --> RETENTION

%% =========================
%% ASSETS
%% =========================
ASSET_INTAKE["Asset
PRR Intake Record
(Permanent)"]

ASSET_TIMER["Asset
Timer Calculation
(Permanent)"]

ASSET_SEARCH["Asset
Search Documentation
(Permanent)"]

ASSET_EXEMPT["Asset
Exemption Log
(Permanent)"]

ASSET_RESPONSE["Asset
Final Response Package
(Permanent, Immutable)"]

ASSET_DELIVERY["Asset
Proof of Delivery
(Permanent)"]

INTAKE --> ASSET_INTAKE
TIMER --> ASSET_TIMER
SEARCH --> ASSET_SEARCH
EXEMPT --> ASSET_EXEMPT
RESPONSE --> ASSET_RESPONSE
FEES --> ASSET_DELIVERY

%% =========================
%% LOGGING (GLOBAL)
%% =========================
LOG["Immutable Log
(time
actor
action
old → new)"]

INTAKE --> LOG
TIMER --> LOG
ASSESS --> LOG
CLARIFY --> LOG
SEARCH --> LOG
EXEMPT --> LOG
REDACT --> LOG
RESPONSE --> LOG
FEES --> LOG
CLOSE --> LOG

%% =========================
%% GOVERNANCE NOTES
%% =========================
NOTE1["RULE:
Nothing exists outside CASE"]
NOTE2["RULE:
Assets remain town property"]
NOTE3["RULE:
All transitions explicit"]
NOTE4["RULE:
Final responses are locked"]
NOTE5["RULE:
Retention completes lifecycle"]

CASE --- NOTE1
CASE --- NOTE2
PROCESS --- NOTE3
RESPONSE --- NOTE4
RETENTION --- NOTE5
