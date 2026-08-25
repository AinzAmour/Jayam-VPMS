/**
 * Standalone Pass Slip Generator & Print Maker Script
 * Generates an isolated, pixel-perfect printable pass document in a clean print frame.
 * Completely eliminates background page leaks, modal overlays, and browser layout artifacts.
 */
export const printPassSlip = (pass) => {
  if (!pass) return;

  const originalTitle = document.title;
  const sanitizedVisitorName = (pass.visitorName || 'Visitor')
    .trim()
    .replace(/[^a-zA-Z0-9_-]/g, '_');
  const passId = pass.passId || 'VP-PASS';
  const visitDate = pass.visitDate || '';

  // Specific, professional PDF file name: e.g. Visitor_Pass_VP-20260826-001_uvi_2026-08-26
  const passFileName = `Visitor_Pass_${passId}_${sanitizedVisitorName}${visitDate ? '_' + visitDate : ''}`;

  // Set top-level document title so Chrome/Edge Save As PDF adopts this specific filename
  document.title = passFileName;

  // Restore main window title after print dialog closes
  const restoreTitle = () => {
    document.title = originalTitle;
    window.removeEventListener('afterprint', restoreTitle);
  };
  window.addEventListener('afterprint', restoreTitle);

  // Fallback timer to ensure title restoration
  setTimeout(() => {
    document.title = originalTitle;
  }, 4000);

  // Remove any leftover print iframe
  const existingIframe = document.getElementById('pass-slip-print-frame');
  if (existingIframe) {
    existingIframe.remove();
  }

  const iframe = document.createElement('iframe');
  iframe.id = 'pass-slip-print-frame';
  iframe.style.position = 'fixed';
  iframe.style.right = '0';
  iframe.style.bottom = '0';
  iframe.style.width = '0';
  iframe.style.height = '0';
  iframe.style.border = '0';
  iframe.style.zIndex = '-9999';

  document.body.appendChild(iframe);

  const doc = iframe.contentWindow.document;
  doc.open();
  doc.write(`<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>${passFileName}</title>
  <style>
    @page {
      size: A4 portrait;
      margin: 12mm 15mm;
    }
    * {
      box-sizing: border-box;
      margin: 0;
      padding: 0;
      -webkit-print-color-adjust: exact !important;
      print-color-adjust: exact !important;
    }
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
      background: #ffffff !important;
      color: #0f172a !important;
      padding: 10px 0;
    }
    .pass-card {
      max-width: 580px;
      margin: 0 auto;
      border: 2px solid #0f172a;
      border-radius: 12px;
      overflow: hidden;
      background: #ffffff;
      box-shadow: none;
    }
    .pass-header {
      background: #0f172a !important;
      color: #ffffff !important;
      padding: 16px 22px;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
    .brand-title {
      font-size: 16px;
      font-weight: 800;
      letter-spacing: 0.5px;
      color: #ffffff;
    }
    .brand-subtitle {
      font-size: 10px;
      color: #94a3b8;
      font-weight: 600;
      letter-spacing: 1px;
      margin-top: 2px;
    }
    .pass-id-badge {
      background: #1e293b !important;
      color: #818cf8 !important;
      border: 1px solid #334155;
      padding: 6px 14px;
      border-radius: 6px;
      font-family: 'Courier New', Courier, monospace;
      font-size: 13px;
      font-weight: 700;
      letter-spacing: 0.5px;
    }
    .pass-body {
      padding: 22px;
    }
    .section-title {
      font-size: 10px;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 0.8px;
      color: #64748b;
      margin-bottom: 4px;
    }
    .visitor-hero {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      padding-bottom: 16px;
      border-bottom: 1px solid #e2e8f0;
      margin-bottom: 16px;
    }
    .visitor-name {
      font-size: 22px;
      font-weight: 800;
      color: #0f172a;
      line-height: 1.2;
    }
    .visitor-company {
      font-size: 13px;
      color: #475569;
      font-weight: 600;
      margin-top: 3px;
    }
    .status-badge {
      display: inline-block;
      padding: 4px 12px;
      border-radius: 9999px;
      font-size: 11px;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }
    .status-APPROVED { background: #dcfce7 !important; color: #166534 !important; border: 1px solid #86efac; }
    .status-CHECKED_IN { background: #e0e7ff !important; color: #3730a3 !important; border: 1px solid #a5b4fc; }
    .status-CHECKED_OUT { background: #f1f5f9 !important; color: #475569 !important; border: 1px solid #cbd5e1; }
    .status-PENDING_APPROVAL { background: #fef3c7 !important; color: #92400e !important; border: 1px solid #fde68a; }
    .status-REJECTED { background: #ffe4e6 !important; color: #9f1239 !important; border: 1px solid #fecdd3; }
    .status-CANCELLED { background: #f8fafc !important; color: #64748b !important; border: 1px solid #e2e8f0; }

    .grid-2 {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 14px;
      margin-bottom: 14px;
    }
    .info-box {
      background: #f8fafc !important;
      border: 1px solid #e2e8f0;
      border-radius: 8px;
      padding: 12px 14px;
    }
    .info-main {
      font-size: 13px;
      font-weight: 700;
      color: #0f172a;
      margin-top: 2px;
    }
    .info-sub {
      font-size: 11px;
      color: #475569;
      margin-top: 2px;
    }
    .purpose-box {
      background: #f8fafc !important;
      border: 1px solid #e2e8f0;
      border-radius: 8px;
      padding: 12px 14px;
      margin-bottom: 14px;
    }
    .remarks-box {
      background: #fffbeb !important;
      border: 1px solid #fef3c7;
      border-radius: 8px;
      padding: 10px 14px;
      font-size: 11px;
      color: #92400e;
      margin-bottom: 14px;
    }
    .security-notice {
      border: 1px dashed #94a3b8;
      border-radius: 8px;
      padding: 10px 14px;
      font-size: 10px;
      color: #475569;
      line-height: 1.45;
      margin-bottom: 18px;
      background: #fafafa !important;
    }
    .signature-row {
      display: flex;
      justify-content: space-between;
      gap: 20px;
      padding-top: 24px;
      border-top: 1px solid #e2e8f0;
      margin-top: 6px;
    }
    .signature-col {
      flex: 1;
      text-align: center;
    }
    .signature-line {
      border-top: 1px solid #0f172a;
      margin-bottom: 4px;
    }
    .signature-label {
      font-size: 9px;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 0.5px;
      color: #64748b;
    }
    .pass-footer {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding-top: 12px;
      border-top: 1px solid #f1f5f9;
      margin-top: 14px;
      font-size: 9px;
      color: #94a3b8;
      font-family: 'Courier New', Courier, monospace;
    }
  </style>
</head>
<body>
  <div class="pass-card">
    <div class="pass-header">
      <div>
        <div class="brand-title">JAYAM VPMS</div>
        <div class="brand-subtitle">FACILITY VISITOR PASS</div>
      </div>
      <div class="pass-id-badge">${pass.passId || 'VP-PASS'}</div>
    </div>

    <div class="pass-body">
      <div class="visitor-hero">
        <div>
          <div class="section-title">Visitor Identification</div>
          <div class="visitor-name">${pass.visitorName || 'Guest'}</div>
          <div class="visitor-company">${pass.visitorCompany || 'Independent Visitor'}</div>
          <div class="info-sub" style="margin-top:4px;">Phone: ${pass.visitorPhone || '—'}${pass.visitorEmail ? ' • ' + pass.visitorEmail : ''}</div>
        </div>
        <div style="text-align: right;">
          <div class="section-title">Pass Status</div>
          <span class="status-badge status-${pass.status || 'APPROVED'}">${(pass.status || '').replace('_', ' ')}</span>
        </div>
      </div>

      <div class="grid-2">
        <div class="info-box">
          <div class="section-title">Host Employee</div>
          <div class="info-main">${pass.hostEmployeeId?.fullName || 'Host Staff'}</div>
          <div class="info-sub">${pass.hostEmployeeId?.designation || 'Staff'}${pass.hostEmployeeId?.department ? ' • ' + pass.hostEmployeeId.department : ''}</div>
          ${pass.hostEmployeeId?.phone ? `<div class="info-sub">Host Phone: ${pass.hostEmployeeId.phone}</div>` : ''}
          ${pass.hostEmployeeId?.employeeCode ? `<div class="info-sub">Code: ${pass.hostEmployeeId.employeeCode}</div>` : ''}
        </div>

        <div class="info-box">
          <div class="section-title">Visit Schedule & Timestamps</div>
          <div class="info-main">Date: ${pass.visitDate || '—'}</div>
          <div class="info-sub">Expected Arrival: ${pass.expectedArrivalTime || '—'}</div>
          ${pass.checkInTime ? `<div class="info-sub" style="color:#166534; font-weight:600;">Check-In: ${new Date(pass.checkInTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</div>` : ''}
          ${pass.checkOutTime ? `<div class="info-sub" style="color:#475569; font-weight:600;">Check-Out: ${new Date(pass.checkOutTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</div>` : ''}
        </div>
      </div>

      <div class="purpose-box">
        <div class="section-title">Purpose of Visit</div>
        <div class="info-main" style="font-weight: 500; font-size: 12px; color: #1e293b;">${pass.purpose || 'Official Visit'}</div>
      </div>

      ${pass.hostRemarks ? `
        <div class="remarks-box">
          <strong>Host Remarks / Instructions:</strong> ${pass.hostRemarks}
        </div>
      ` : ''}

      <div class="security-notice">
        <strong>Security & Access Guidelines:</strong><br>
        1. This pass is non-transferable and must be visibly displayed at all times on site.<br>
        2. Visitors must remain accompanied by authorized host staff in restricted zones.<br>
        3. Surrender this pass slip to the reception / security gate upon departure.
      </div>

      <div class="signature-row">
        <div class="signature-col">
          <div class="signature-line"></div>
          <div class="signature-label">Security Officer</div>
        </div>
        <div class="signature-col">
          <div class="signature-line"></div>
          <div class="signature-label">Visitor Signature</div>
        </div>
        <div class="signature-col">
          <div class="signature-line"></div>
          <div class="signature-label">Host Employee</div>
        </div>
      </div>

      <div class="pass-footer">
        <span>ISSUED: ${new Date().toLocaleString()}</span>
        <span>VERIFIED PASS: ${pass.passId || 'VP'}</span>
      </div>
    </div>
  </div>
</body>
</html>`);
  doc.close();

  // Print automatically once iframe document is parsed
  setTimeout(() => {
    iframe.contentWindow.focus();
    iframe.contentWindow.print();
    setTimeout(() => {
      iframe.remove();
    }, 2500);
  }, 200);
};

export default printPassSlip;
