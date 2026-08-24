# User Flow 05: Reports Generation & Forensic Audit Trail Inspection

## Document Control
- **Flow ID:** `UF-05`
- **User Role:** `ADMINISTRATOR`
- **Design System:** Aegis UI
- **Source Requirement:** `FR-REP-02`, `FR-AUD-01`, `05-user-flows.md`

---

## 1. Visual User Journey Diagram

```mermaid
flowchart TD
    AdminStarts([Administrator on /admin/reports]) --> SelectFilter{Selects Timeframe}
    
    SelectFilter -->|Preset: Today| FetchToday[GET /api/reports/summary?filter=today]
    SelectFilter -->|Preset: This Week| FetchWeek[GET /api/reports/summary?filter=this_week]
    SelectFilter -->|Custom Date Range| EnterDates[Inputs Start Date & End Date]
    EnterDates --> FetchCustom[GET /api/reports/summary?filter=custom&startDate=...&endDate=...]
    
    FetchToday --> RenderMetrics[Display Total Passes, Approvals, Rejections, Avg Duration]
    FetchWeek --> RenderMetrics
    FetchCustom --> RenderMetrics
    
    RenderMetrics --> UserChoice{Admin Action?}
    UserChoice -->|Export CSV| DownloadCSV[Generates & downloads visitor summary CSV]
    UserChoice -->|Inspect Audit Trail| NavAudit[Navigates to /admin/audit-logs]
    
    NavAudit --> FilterAudit[Filters logs by Action type e.g. REJECTED]
    FilterAudit --> ViewTimeline[Inspects exact UTC timestamp, actor, and remarks]
```

---

## 2. Compliance & Audit Verification
- Provides executive compliance officers with a tamper-evident chain of custody for any visitor on any historical date.
