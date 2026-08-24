import React from 'react';
import Modal from './Modal';
import Button from './Button';
import StatusBadge from './StatusBadge';
import { Printer, ShieldCheck, Building, User, Calendar, Clock, Phone, FileText } from 'lucide-react';

export const PassSlipModal = ({ isOpen, onClose, pass }) => {
  if (!pass) return null;

  const handlePrint = () => {
    window.print();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} maxWidth="max-w-xl" title="Visitor Pass Slip">
      <div className="printable-area">
        {/* Pass Card Container */}
        <div className="border-2 border-indigo-600 rounded-2xl overflow-hidden shadow-md bg-white">
          {/* Header */}
          <div className="bg-indigo-700 text-white px-6 py-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-indigo-500/40 flex items-center justify-center border border-indigo-400/40">
                <ShieldCheck className="w-5 h-5 text-white" />
              </div>
              <div>
                <h4 className="text-base font-bold tracking-tight">JAYAM SECURITY & OPERATIONS</h4>
                <p className="text-xs text-indigo-200 font-medium">OFFICIAL VISITOR PASS</p>
              </div>
            </div>
            <div className="text-right">
              <span className="font-mono text-sm font-bold bg-indigo-900/60 px-3 py-1 rounded-md border border-indigo-500/50">
                {pass.passId}
              </span>
            </div>
          </div>

          {/* Body */}
          <div className="p-6 space-y-5">
            {/* Top row: Visitor Details & Status */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
              <div>
                <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Visitor Name</p>
                <h3 className="text-xl font-bold text-slate-900 mt-0.5">{pass.visitorName}</h3>
                <p className="text-sm text-slate-600 flex items-center gap-1.5 mt-0.5">
                  <Building className="w-3.5 h-3.5 text-slate-400" />
                  {pass.visitorCompany}
                </p>
              </div>
              <div className="sm:text-right">
                <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">Pass Status</p>
                <StatusBadge status={pass.status} />
              </div>
            </div>

            {/* Grid Information */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
              <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200/70">
                <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2 flex items-center gap-1">
                  <User className="w-3.5 h-3.5 text-indigo-600" /> Host Details
                </p>
                <p className="font-bold text-slate-900">{pass.hostEmployeeId?.fullName || 'Host Staff'}</p>
                <p className="text-xs text-slate-600 mt-0.5">{pass.hostEmployeeId?.designation} • {pass.hostEmployeeId?.department}</p>
                {pass.hostEmployeeId?.phone && (
                  <p className="text-xs text-slate-500 mt-1 flex items-center gap-1">
                    <Phone className="w-3 h-3" /> {pass.hostEmployeeId.phone}
                  </p>
                )}
              </div>

              <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200/70">
                <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2 flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5 text-indigo-600" /> Visit Schedule
                </p>
                <p className="font-bold text-slate-900">Date: {pass.visitDate}</p>
                <p className="text-xs text-slate-600 mt-0.5 flex items-center gap-1">
                  <Clock className="w-3 h-3 text-slate-400" /> Expected Arrival: {pass.expectedArrivalTime}
                </p>
                {pass.checkInTime && (
                  <p className="text-xs text-emerald-700 mt-1 font-medium">
                    Checked In: {new Date(pass.checkInTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </p>
                )}
                {pass.checkOutTime && (
                  <p className="text-xs text-slate-600 mt-0.5 font-medium">
                    Checked Out: {new Date(pass.checkOutTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </p>
                )}
              </div>
            </div>

            {/* Purpose */}
            <div className="bg-indigo-50/50 p-3.5 rounded-xl border border-indigo-100">
              <p className="text-xs font-semibold text-indigo-900 uppercase tracking-wider mb-1 flex items-center gap-1">
                <FileText className="w-3.5 h-3.5 text-indigo-600" /> Purpose of Visit
              </p>
              <p className="text-sm text-slate-700">{pass.purpose}</p>
            </div>

            {/* Host Remarks (if available) */}
            {pass.hostRemarks && (
              <div className="bg-amber-50/50 p-3 rounded-lg border border-amber-100 text-xs text-amber-900">
                <span className="font-bold">Host Remarks:</span> {pass.hostRemarks}
              </div>
            )}

            {/* Footer security disclaimer & QR verification mock */}
            <div className="flex items-center justify-between pt-3 border-t border-slate-100 text-xs text-slate-400">
              <div>
                <p className="font-semibold text-slate-500">Security Notice:</p>
                <p>Visitor must visibly wear pass badge at all times while inside premises.</p>
              </div>
              <div className="border border-slate-300 rounded p-1 text-center bg-white font-mono text-[10px] text-slate-600">
                [SEC-VERIFIED]
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="mt-6 flex items-center justify-end gap-3 no-print">
        <Button variant="secondary" size="sm" onClick={onClose}>
          Close
        </Button>
        <Button variant="primary" size="sm" icon={Printer} onClick={handlePrint}>
          Print Pass Slip
        </Button>
      </div>
    </Modal>
  );
};

export default PassSlipModal;
