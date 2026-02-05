# Phillipston Governance OS - Operator Manual

## System Overview
This is a municipal-grade operating system designed for compliance with M.G.L. c. 66. Every record created is immediately archived in the **Phillipston Vault** (SharePoint).

## Core Principles
- **Archive-First**: No data exists in a temporary state. Creation is Archival.
- **Identity Gating**: Only authorized `@phillipston-ma.gov` or approved consultant domains can commit records.
- **Immutability**: Once a record reaches the "Approved" or "Archived" stage, it is locked. Changes require a new record that "Supersedes" the previous ID.

## Standard Operating Procedures

### 1. Public Records Request (PRR) Intake
1. Navigate to **Case Space**.
2. Click **New Intake**.
3. Fill out the requestor metadata.
4. The system automatically calculates the 10-business-day deadline based on Massachusetts law.
5. Upon submission, a unique `PRR-YYYY-XXXX` ID is assigned.

### 2. Record Lifecycle
- **Draft**: Work in progress.
- **UnderReview**: Pending Town Clerk or Department Head approval.
- **Approved**: Finalized and locked.
- **Archived**: Permanent retention.

## Failure & Recovery
- **Staff Departure**: All records are stored in SharePoint. A new Town Clerk simply needs to be added to the SharePoint site and Entra ID group to regain full control.
- **Audit**: Auditors can reconstruct the entire history of any record by viewing the `ARCHIEVE` list metadata, which includes the `CreatedByActor` and `SystemVersion`.
