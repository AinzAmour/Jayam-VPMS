import React, { useState, useEffect } from 'react';
import employeeService from '../services/employeeService';
import { useToast } from '../context/ToastContext';
import DataTable from '../components/DataTable';
import Button from '../components/Button';
import Input from '../components/Input';
import Select from '../components/Select';
import Modal from '../components/Modal';
import { Users, UserPlus, Search, Edit3, ShieldAlert, CheckCircle2, XCircle } from 'lucide-react';

export const AdminEmployeesPage = () => {
  const [employees, setEmployees] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [departmentFilter, setDepartmentFilter] = useState('ALL');

  // Add / Edit Modal States
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingEmployee, setEditingEmployee] = useState(null);
  const [formSubmitting, setFormSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    employeeCode: '',
    fullName: '',
    email: '',
    phone: '',
    department: '',
    designation: '',
    isActive: true,
  });

  const toast = useToast();

  useEffect(() => {
    loadEmployees();
  }, [departmentFilter]);

  const loadEmployees = async () => {
    setIsLoading(true);
    try {
      const res = await employeeService.getAll({
        department: departmentFilter !== 'ALL' ? departmentFilter : undefined,
      });
      setEmployees(res.data || []);
    } catch (err) {
      toast.error(err.message || 'Failed to load employees.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleOpenCreateModal = () => {
    setEditingEmployee(null);
    setFormData({
      employeeCode: `EMP-${Math.floor(1000 + Math.random() * 9000)}`,
      fullName: '',
      email: '',
      phone: '',
      department: 'Engineering',
      designation: '',
      isActive: true,
    });
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (emp) => {
    setEditingEmployee(emp);
    setFormData({
      employeeCode: emp.employeeCode,
      fullName: emp.fullName,
      email: emp.email,
      phone: emp.phone,
      department: emp.department,
      designation: emp.designation,
      isActive: emp.isActive,
    });
    setIsModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormSubmitting(true);
    try {
      if (editingEmployee) {
        await employeeService.update(editingEmployee._id, formData);
        toast.success(`Updated details for ${formData.fullName}`);
      } else {
        await employeeService.create(formData);
        toast.success(`Created employee ${formData.fullName}`);
      }
      setIsModalOpen(false);
      loadEmployees();
    } catch (err) {
      toast.error(err.message || 'Failed to save employee profile.');
    } finally {
      setFormSubmitting(false);
    }
  };

  const filteredEmployees = employees.filter((emp) => {
    if (!searchTerm.trim()) return true;
    const term = searchTerm.toLowerCase();
    return (
      emp.fullName?.toLowerCase().includes(term) ||
      emp.employeeCode?.toLowerCase().includes(term) ||
      emp.email?.toLowerCase().includes(term) ||
      emp.designation?.toLowerCase().includes(term)
    );
  });

  const columns = [
    {
      header: 'Code',
      accessor: 'employeeCode',
      render: (row) => <span className="font-mono text-xs font-bold text-slate-800">{row.employeeCode}</span>,
    },
    {
      header: 'Full Name & Email',
      render: (row) => (
        <div>
          <div className="font-bold text-slate-900">{row.fullName}</div>
          <div className="text-xs text-slate-500">{row.email} • {row.phone}</div>
        </div>
      ),
    },
    {
      header: 'Department & Role',
      render: (row) => (
        <div>
          <div className="font-semibold text-slate-800 text-xs">{row.department}</div>
          <div className="text-xs text-slate-500">{row.designation}</div>
        </div>
      ),
    },
    {
      header: 'Pending Requests',
      render: (row) => {
        const count = row.pendingRequestsCount || 0;
        const isLimit = count >= 3;
        return (
          <div className="flex items-center gap-2">
            <span
              className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold border ${
                isLimit
                  ? 'bg-rose-50 border-rose-200 text-rose-700'
                  : count > 0
                  ? 'bg-amber-50 border-amber-200 text-amber-700'
                  : 'bg-slate-100 border-slate-200 text-slate-600'
              }`}
            >
              {isLimit && <ShieldAlert className="w-3 h-3 text-rose-600" />}
              <span>{count} / 3 Pending</span>
            </span>
          </div>
        );
      },
    },
    {
      header: 'Status',
      render: (row) => (
        <span
          className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold border ${
            row.isActive
              ? 'bg-emerald-50 border-emerald-200 text-emerald-700'
              : 'bg-slate-100 border-slate-200 text-slate-500'
          }`}
        >
          {row.isActive ? <CheckCircle2 className="w-3 h-3 text-emerald-600" /> : <XCircle className="w-3 h-3 text-slate-400" />}
          {row.isActive ? 'Active' : 'Inactive'}
        </span>
      ),
    },
    {
      header: 'Actions',
      align: 'right',
      render: (row) => (
        <Button
          variant="secondary"
          size="xs"
          icon={Edit3}
          onClick={() => handleOpenEditModal(row)}
        >
          Edit
        </Button>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
        <div>
          <h2 className="text-xl font-bold text-slate-900">Staff Directory</h2>
          <p className="text-xs text-slate-500 mt-0.5">Manage employee profiles, departments, and host availability</p>
        </div>
        <Button variant="primary" size="sm" icon={UserPlus} onClick={handleOpenCreateModal}>
          Add Employee
        </Button>
      </div>

      {/* Filter & Search Bar */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex flex-col sm:flex-row gap-3 items-center justify-between">
        <div className="w-full sm:w-72">
          <Input
            placeholder="Search by name, code, role..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            icon={Search}
          />
        </div>
        <div className="w-full sm:w-56">
          <Select
            value={departmentFilter}
            onChange={(e) => setDepartmentFilter(e.target.value)}
            placeholder="All Departments"
            options={[
              { value: 'ALL', label: 'All Departments' },
              { value: 'Engineering', label: 'Engineering' },
              { value: 'Human Resources', label: 'Human Resources' },
              { value: 'Product Management', label: 'Product Management' },
              { value: 'Operations', label: 'Operations' },
              { value: 'Sales & Marketing', label: 'Sales & Marketing' },
            ]}
          />
        </div>
      </div>

      {/* Data Table */}
      <DataTable
        columns={columns}
        data={filteredEmployees}
        isLoading={isLoading}
        emptyMessage="No employees found matching filter criteria."
      />

      {/* Create / Edit Employee Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingEmployee ? 'Edit Staff Profile' : 'Add New Staff Member'}
        subtitle="Staff members can be selected as hosts for visitor passes"
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Employee Code"
              value={formData.employeeCode}
              onChange={(e) => setFormData({ ...formData, employeeCode: e.target.value })}
              required
              disabled={!!editingEmployee}
            />
            <Input
              label="Full Name"
              placeholder="e.g. David Chen"
              value={formData.fullName}
              onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
              required
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Corporate Email"
              type="email"
              placeholder="e.g. david.chen@jayam.com"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              required
            />
            <Input
              label="Contact Phone"
              placeholder="+1 555-010-2001"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              required
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Select
              label="Department"
              value={formData.department}
              onChange={(e) => setFormData({ ...formData, department: e.target.value })}
              required
              options={[
                { value: 'Engineering', label: 'Engineering' },
                { value: 'Human Resources', label: 'Human Resources' },
                { value: 'Product Management', label: 'Product Management' },
                { value: 'Operations', label: 'Operations' },
                { value: 'Sales & Marketing', label: 'Sales & Marketing' },
                { value: 'Finance & Legal', label: 'Finance & Legal' },
              ]}
            />
            <Input
              label="Designation / Role"
              placeholder="e.g. Lead Software Architect"
              value={formData.designation}
              onChange={(e) => setFormData({ ...formData, designation: e.target.value })}
              required
            />
          </div>

          {editingEmployee && (
            <div className="pt-2">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.isActive}
                  onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                  className="rounded text-indigo-600 focus:ring-indigo-500 w-4 h-4"
                />
                <span className="text-xs font-semibold text-slate-700">Account is Active (Can host visitors)</span>
              </label>
            </div>
          )}

          <div className="mt-6 flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
            <Button variant="secondary" size="sm" onClick={() => setIsModalOpen(false)} disabled={formSubmitting}>
              Cancel
            </Button>
            <Button type="submit" variant="primary" size="sm" isLoading={formSubmitting}>
              {editingEmployee ? 'Save Changes' : 'Create Staff Member'}
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default AdminEmployeesPage;
