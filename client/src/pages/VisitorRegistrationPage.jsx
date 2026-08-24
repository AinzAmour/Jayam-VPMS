import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import visitorService from '../services/visitorService';
import employeeService from '../services/employeeService';
import { useToast } from '../context/ToastContext';
import Input from '../components/Input';
import Select from '../components/Select';
import TextArea from '../components/TextArea';
import Button from '../components/Button';
import PassSlipModal from '../components/PassSlipModal';
import {
  UserPlus,
  Building,
  User,
  Calendar,
  Clock,
  Phone,
  Mail,
  FileText,
  ShieldAlert,
  Info,
  CheckCircle2,
  Sparkles,
} from 'lucide-react';

export const VisitorRegistrationPage = () => {
  const navigate = useNavigate();
  const toast = useToast();

  const getTodayStr = () => {
    const d = new Date();
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  const getCurrentTimeStr = () => {
    const d = new Date();
    const hours = String(d.getHours()).padStart(2, '0');
    const minutes = String(d.getMinutes()).padStart(2, '0');
    return `${hours}:${minutes}`;
  };

  const [employees, setEmployees] = useState([]);
  const [isLoadingEmployees, setIsLoadingEmployees] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [createdPass, setCreatedPass] = useState(null);

  const [formData, setFormData] = useState({
    visitorName: '',
    visitorPhone: '',
    visitorEmail: '',
    visitorCompany: '',
    hostEmployeeId: '',
    visitDate: getTodayStr(),
    expectedArrivalTime: '',
    purpose: '',
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    loadActiveEmployees();
  }, []);

  const loadActiveEmployees = async () => {
    setIsLoadingEmployees(true);
    try {
      const res = await employeeService.getAll({ activeOnly: 'true' });
      setEmployees(res.data || []);
      if (res.data?.length > 0) {
        // Find first employee who has < 3 pending requests
        const availableEmp = res.data.find((e) => !e.isPendingLimitReached) || res.data[0];
        setFormData((prev) => ({ ...prev, hostEmployeeId: availableEmp._id }));
      }
    } catch (err) {
      toast.error(err.message || 'Failed to load staff list.');
    } finally {
      setIsLoadingEmployees(false);
    }
  };

  const validateForm = () => {
    const newErrors = {};
    const today = getTodayStr();
    const currentTime = getCurrentTimeStr();

    if (!formData.visitorName.trim()) newErrors.visitorName = 'Visitor name is required';
    if (!formData.visitorPhone.trim()) newErrors.visitorPhone = 'Visitor phone number is required';
    if (!formData.visitorCompany.trim()) newErrors.visitorCompany = 'Visitor company is required';
    if (!formData.hostEmployeeId) newErrors.hostEmployeeId = 'Please select a host employee';
    if (!formData.visitDate) newErrors.visitDate = 'Visit date is required';
    if (!formData.expectedArrivalTime) newErrors.expectedArrivalTime = 'Arrival time is required';
    if (!formData.purpose.trim() || formData.purpose.trim().length < 3) {
      newErrors.purpose = 'Purpose must be at least 3 characters';
    }

    // no past dates
    if (formData.visitDate && formData.visitDate < today) {
      newErrors.visitDate = 'Visit date cannot be in the past.';
    }

    // if today, arrival time must be in future
    if (formData.visitDate === today && formData.expectedArrivalTime && formData.expectedArrivalTime < currentTime) {
      newErrors.expectedArrivalTime = 'Arrival time must be later than the current time.';
    }

    // host has reached 3 pending limit
    if (selectedHost && selectedHost.isPendingLimitReached) {
      newErrors.hostEmployeeId = `${selectedHost.fullName} already has 3 pending requests awaiting review. Please select another host.`;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) {
      toast.warning('Please fix the form errors highlighted below.');
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await visitorService.register(formData);
      toast.success('Visitor pass registered successfully! Awaiting host review.');
      setCreatedPass(res.data);
    } catch (err) {
      toast.error(err.message || 'Visitor registration failed.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const applyPurposePreset = (presetText) => {
    setFormData((prev) => ({ ...prev, purpose: presetText }));
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
        <h2 className="text-2xl font-bold text-slate-900">Register Visitor</h2>
        <p className="text-xs text-slate-500 mt-1">
          Register a visitor, choose a host, and schedule their visit.
        </p>
      </div>

      {/* Main Registration Form */}
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Section 1: Visitor Information */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-5">
          <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
            <User className="w-5 h-5 text-indigo-600" />
            <div>
              <h3 className="text-base font-bold text-slate-900">1. Visitor Information</h3>
              <p className="text-xs text-slate-500">Legal identity and contact credentials of the guest</p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Visitor Full Name"
              placeholder="e.g. Robert Langdon"
              value={formData.visitorName}
              onChange={(e) => setFormData({ ...formData, visitorName: e.target.value })}
              error={errors.visitorName}
              icon={User}
              required
            />
            <Input
              label="Visitor Mobile Phone"
              placeholder="+1 555-888-1001"
              value={formData.visitorPhone}
              onChange={(e) => setFormData({ ...formData, visitorPhone: e.target.value })}
              error={errors.visitorPhone}
              helperText="Phone number is used to identify the visitor."
              icon={Phone}
              required
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Company / Organization"
              placeholder="e.g. Harvard Institute"
              value={formData.visitorCompany}
              onChange={(e) => setFormData({ ...formData, visitorCompany: e.target.value })}
              error={errors.visitorCompany}
              icon={Building}
              required
            />
            <Input
              label="Email Address (Optional)"
              type="email"
              placeholder="guest@example.com"
              value={formData.visitorEmail}
              onChange={(e) => setFormData({ ...formData, visitorEmail: e.target.value })}
              icon={Mail}
            />
          </div>
        </div>

        {/* Section 2: Host Employee & Scheduling */}
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm space-y-5">
          <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
            <Calendar className="w-5 h-5 text-indigo-600" />
            <div>
              <h3 className="text-base font-bold text-slate-900">2. Host Selection & Schedule</h3>
              <p className="text-xs text-slate-500">Assign company staff host and schedule expected arrival</p>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
              Host Employee <span className="text-rose-500">*</span>
            </label>
            <select
              value={formData.hostEmployeeId}
              onChange={(e) => setFormData({ ...formData, hostEmployeeId: e.target.value })}
              className={`block w-full rounded-lg border text-sm transition-all duration-150 p-2.5 ${
                errors.hostEmployeeId
                  ? 'border-rose-400 text-rose-900 bg-rose-50/30'
                  : 'border-slate-300 text-slate-900 bg-white focus:ring-2 focus:ring-indigo-500'
              }`}
            >
              <option value="">-- Select Host Staff Member --</option>
              {employees.map((emp) => (
                <option key={emp._id} value={emp._id} disabled={emp.isPendingLimitReached}>
                  {emp.fullName} ({emp.employeeCode} - {emp.department}){' '}
                  {emp.isPendingLimitReached ? '[Pending limit reached (3)]' : `[${emp.pendingRequestsCount || 0} / 3 Pending]`}
                </option>
              ))}
            </select>
            {errors.hostEmployeeId && <p className="mt-1 text-xs text-rose-600 font-medium">{errors.hostEmployeeId}</p>}

            {/* Host Capacity Insight Box */}
            {selectedHost && (
              <div
                className={`mt-3 p-3 rounded-lg border flex items-center justify-between text-xs ${
                  selectedHost.isPendingLimitReached
                    ? 'bg-rose-50 border-rose-200 text-rose-900'
                    : selectedHost.pendingRequestsCount > 0
                    ? 'bg-amber-50 border-amber-200 text-amber-900'
                    : 'bg-emerald-50 border-emerald-200 text-emerald-900'
                }`}
              >
                <div className="flex items-center gap-2">
                  {selectedHost.isPendingLimitReached ? (
                    <ShieldAlert className="w-4 h-4 text-rose-600" />
                  ) : (
                    <Info className="w-4 h-4 text-indigo-600" />
                  )}
                  <span>
                    <strong>Host:</strong> {selectedHost.fullName} ({selectedHost.designation}) —{' '}
                    <strong>{selectedHost.pendingRequestsCount || 0}</strong> of 3 pending requests awaiting review.
                  </span>
                </div>
                <span className="font-bold">
                  {selectedHost.isPendingLimitReached ? 'AT CAPACITY' : 'AVAILABLE'}
                </span>
              </div>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Visit Date"
              type="date"
              min={getTodayStr()}
              value={formData.visitDate}
              onChange={(e) => setFormData({ ...formData, visitDate: e.target.value })}
              error={errors.visitDate}
              helperText="Visit date cannot be in the past"
              icon={Calendar}
              required
            />

            <Input
              label="Expected Arrival Time (24h)"
              type="time"
              value={formData.expectedArrivalTime}
              onChange={(e) => setFormData({ ...formData, expectedArrivalTime: e.target.value })}
              error={errors.expectedArrivalTime}
              helperText="Arrival time must be later than current time"
              icon={Clock}
              required
            />
          </div>
        </div>

        {/* Section 3: Purpose of Visit */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-5">
          <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
            <FileText className="w-5 h-5 text-indigo-600" />
            <div>
              <h3 className="text-base font-bold text-slate-900">3. Purpose of Visit</h3>
              <p className="text-xs text-slate-500">Provide reason for admission and meeting agenda</p>
            </div>
          </div>

          {/* Quick Purpose Presets */}
          <div>
            <p className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider mb-2">
              Common reasons:
            </p>
            <div className="flex flex-wrap gap-2">
              {[
                'Technical Architecture Sync & Review',
                'Candidate Interview Assessment',
                'Quarterly Vendor Partner Sync',
                'Facility Safety & Environmental Audit',
                'Client Executive Briefing',
              ].map((preset) => (
                <button
                  key={preset}
                  type="button"
                  onClick={() => applyPurposePreset(preset)}
                  className="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-indigo-50 hover:text-indigo-700 text-slate-700 text-xs font-medium border border-slate-200 transition-colors"
                >
                  + {preset}
                </button>
              ))}
            </div>
          </div>

          <TextArea
            label="Detailed Purpose / Notes"
            rows={3}
            placeholder="Explain reason for visitor admission..."
            value={formData.purpose}
            onChange={(e) => setFormData({ ...formData, purpose: e.target.value })}
            error={errors.purpose}
            required
          />
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-end gap-3 pt-2">
          <Button
            variant="secondary"
            size="md"
            onClick={() => navigate('/receptionist/dashboard')}
            disabled={isSubmitting}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            variant="primary"
            size="md"
            icon={UserPlus}
            isLoading={isSubmitting}
            disabled={selectedHost?.isPendingLimitReached}
            className="shadow-md"
          >
            Create Visitor Pass
          </Button>
        </div>
      </form>

      {/* Success Printable Pass Slip Modal */}
      <PassSlipModal
        isOpen={!!createdPass}
        onClose={() => {
          setCreatedPass(null);
          navigate('/receptionist/dashboard');
        }}
        pass={createdPass}
      />
    </div>
  );
};

export default VisitorRegistrationPage;
