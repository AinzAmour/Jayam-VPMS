import React, { useState, useEffect } from 'react';
import Modal from './Modal';
import Button from './Button';
import visitorService from '../services/visitorService';
import { History, User, Clock, CheckCircle2, XCircle, LogIn, LogOut, Ban, FilePlus } from 'lucide-react';

const actionIconMap = {
  CREATED: { icon: FilePlus, color: 'text-indigo-600 bg-indigo-50 border-indigo-200' },
  APPROVED: { icon: CheckCircle2, color: 'text-emerald-600 bg-emerald-50 border-emerald-200' },
  REJECTED: { icon: XCircle, color: 'text-rose-600 bg-rose-50 border-rose-200' },
  CHECKED_IN: { icon: LogIn, color: 'text-indigo-600 bg-indigo-50 border-indigo-200' },
  CHECKED_OUT: { icon: LogOut, color: 'text-slate-600 bg-slate-100 border-slate-200' },
  CANCELLED: { icon: Ban, color: 'text-gray-600 bg-gray-100 border-gray-200' },
};

export const AuditTimelineModal = ({ isOpen, onClose, passId, passRef }) => {
  const [activities, setActivities] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (isOpen && passRef?._id) {
      loadActivities();
    }
  }, [isOpen, passRef]);

  const loadActivities = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await visitorService.getActivities(passRef._id);
      setActivities(res.data || []);
    } catch (err) {
      setError(err.message || 'Failed to load activity timeline.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      maxWidth="max-w-lg"
      title="Activity & Audit History"
      subtitle={`Audit trail for Pass ID: ${passRef?.passId || passId}`}
    >
      {isLoading ? (
        <div className="py-8 space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="flex gap-4 animate-pulse">
              <div className="w-8 h-8 rounded-full bg-slate-200 shrink-0" />
              <div className="flex-1 space-y-2">
                <div className="h-4 bg-slate-200 rounded w-1/3" />
                <div className="h-3 bg-slate-200 rounded w-2/3" />
              </div>
            </div>
          ))}
        </div>
      ) : error ? (
        <div className="py-6 text-center text-rose-600 text-sm">{error}</div>
      ) : activities.length === 0 ? (
        <div className="py-8 text-center text-slate-500 text-sm">No activity recorded for this pass.</div>
      ) : (
        <div className="py-2">
          <div className="relative pl-6 space-y-6 before:absolute before:left-3 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-200">
            {activities.map((act) => {
              const config = actionIconMap[act.action] || actionIconMap.CREATED;
              const IconComp = config.icon;

              return (
                <div key={act._id} className="relative group">
                  {/* Icon Node */}
                  <div
                    className={`absolute -left-6 top-0.5 w-6 h-6 rounded-full border flex items-center justify-center ${config.color}`}
                  >
                    <IconComp className="w-3.5 h-3.5" />
                  </div>

                  {/* Content */}
                  <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200/80">
                    <div className="flex items-center justify-between gap-2">
                      <span className="font-bold text-sm text-slate-900">{act.action}</span>
                      <span className="text-xs text-slate-500 flex items-center gap-1 font-mono">
                        <Clock className="w-3 h-3 text-slate-400" />
                        {new Date(act.timestamp).toLocaleString()}
                      </span>
                    </div>

                    <p className="text-xs text-slate-600 mt-1 flex items-center gap-1">
                      <User className="w-3 h-3 text-slate-400" />
                      Performed by: <span className="font-semibold text-slate-800">{act.performedByName}</span>
                      <span className="text-slate-400">({act.performedByRole})</span>
                    </p>

                    {act.remarks && (
                      <p className="text-xs text-slate-700 bg-white p-2 rounded-lg border border-slate-200 mt-2 italic">
                        "{act.remarks}"
                      </p>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      <div className="mt-6 flex justify-end">
        <Button variant="secondary" size="sm" onClick={onClose}>
          Close
        </Button>
      </div>
    </Modal>
  );
};

export default AuditTimelineModal;
