import React from 'react';
import Modal from './Modal';
import Button from './Button';
import StatusBadge from './StatusBadge';
import { Printer, ShieldCheck, Building, User, Calendar, Clock, Phone, FileText } from 'lucide-react';
import { printPassSlip } from '../utils/printPassSlip';

export const PassSlipModal = ({ isOpen, onClose, pass }) => {
  if (!pass) return null;

  const handlePrint = () => {
    printPassSlip(pass);
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} maxWidth="max-w-xl" title="Visitor Pass Slip">
      <div className="printable-area pass-slip-wrapper">
        {/* Pass Card Container */}
        <div className="pass-slip-printable-card border border-slate-300 rounded-xl overflow-hidden shadow-sm bg-white">
          {/* Header */}
          <div className="bg-slate-900 text-white px-6 py-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center">
                <ShieldCheck className="w-4 h-4 text-white" />
              </div>
              <div>
                <h4 className="text-sm font-bold tracking-tight">JAYAM VPMS</h4>
                <p className="text-[11px] text-slate-400 font-medium">VISITOR PASS</p>
              </div>
            </div>
            <div className="text-right">
              <span className="font-mono text-xs font-bold bg-slate-800 px-2.5 py-1 rounded border border-slate-700 text-indigo-300">
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
              <div className="bg-slate-50 p-3.5 rounded-lg border border-slate-200">
                <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2 flex items-center gap-1">
                  <User className="w-3.5 h-3.5 text-slate-600" /> Host Details
                </p>
                <p className="font-bold text-slate-900">{pass.hostEmployeeId?.fullName || 'Host Staff'}</p>
                <p className="text-xs text-slate-600 mt-0.5">{pass.hostEmployeeId?.designation} • {pass.hostEmployeeId?.department}</p>
                {pass.hostEmployeeId?.phone && (
                  <p className="text-xs text-slate-500 mt-1 flex items-center gap-1">
                    <Phone className="w-3 h-3 text-slate-400" /> {pass.hostEmployeeId.phone}
                  </p>
                )}
              </div>

              <div className="bg-slate-50 p-3.5 rounded-lg border border-slate-200">
                <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2 flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5 text-slate-600" /> Visit Schedule
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
            <div className="bg-slate-50 p-3.5 rounded-lg border border-slate-200">
              <p className="text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1 flex items-center gap-1">
                <FileText className="w-3.5 h-3.5 text-slate-500" /> Purpose of Visit
              </p>
              <p className="text-sm text-slate-700">{pass.purpose}</p>
            </div>

            {/* Host Remarks (if available) */}
            {pass.hostRemarks && (
              <div className="bg-amber-50 p-3 rounded-lg border border-amber-200 text-xs text-amber-900">
                <span className="font-bold">Host Remarks:</span> {pass.hostRemarks}
              </div>
            )}

            {/* Footer notice */}
            <div className="pt-3 border-t border-slate-100 text-xs text-slate-500 flex items-center justify-between">
              <p>Visitor must display this pass while on site.</p>
              <span className="font-mono text-[10px] text-slate-400">{pass.passId}</span>
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
