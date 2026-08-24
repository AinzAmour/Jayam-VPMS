import React, { useState, useEffect } from 'react';
import userService from '../services/userService';
import employeeService from '../services/employeeService';
import { useToast } from '../context/ToastContext';
import DataTable from '../components/DataTable';
import Button from '../components/Button';
import Input from '../components/Input';
import Select from '../components/Select';
import Modal from '../components/Modal';
import { UserCheck, UserPlus, Search, Edit3, Shield, Key } from 'lucide-react';

export const AdminUsersPage = () => {
  const [users, setUsers] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('ALL');

  // Modal States
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [formSubmitting, setFormSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    role: 'EMPLOYEE',
    employeeRef: '',
    isActive: true,
  });

  const toast = useToast();

  useEffect(() => {
    loadUsers();
    loadEmployees();
  }, [roleFilter]);

  const loadUsers = async () => {
    setIsLoading(true);
    try {
      const res = await userService.getAll({
        role: roleFilter !== 'ALL' ? roleFilter : undefined,
      });
      setUsers(res.data || []);
    } catch (err) {
      toast.error(err.message || 'Failed to load user accounts.');
    } finally {
      setIsLoading(false);
    }
  };

  const loadEmployees = async () => {
    try {
      const res = await employeeService.getAll({ activeOnly: 'true' });
      setEmployees(res.data || []);
    } catch (err) {
      console.error('Failed to load employees for dropdown:', err);
    }
  };

  const handleOpenCreateModal = () => {
    setEditingUser(null);
    setFormData({
      fullName: '',
      email: '',
      password: '',
      role: 'EMPLOYEE',
      employeeRef: employees.length > 0 ? employees[0]._id : '',
      isActive: true,
    });
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (u) => {
    setEditingUser(u);
    setFormData({
      fullName: u.fullName,
      email: u.email,
      password: '', // blank unless updating
      role: u.role,
      employeeRef: u.employeeRef?._id || '',
      isActive: u.isActive,
    });
    setIsModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormSubmitting(true);
    try {
      if (editingUser) {
        await userService.update(editingUser._id, formData);
        toast.success(`Updated account for ${formData.fullName}`);
      } else {
        await userService.create(formData);
        toast.success(`Provisioned user account for ${formData.fullName}`);
      }
      setIsModalOpen(false);
      loadUsers();
    } catch (err) {
      toast.error(err.message || 'Failed to save user account.');
    } finally {
      setFormSubmitting(false);
    }
  };

  const filteredUsers = users.filter((u) => {
    if (!searchTerm.trim()) return true;
    const term = searchTerm.toLowerCase();
    return (
      u.fullName?.toLowerCase().includes(term) ||
      u.email?.toLowerCase().includes(term) ||
      u.role?.toLowerCase().includes(term)
    );
  });

  const roleColors = {
    ADMINISTRATOR: 'bg-rose-50 border-rose-200 text-rose-800',
    RECEPTIONIST: 'bg-indigo-50 border-indigo-200 text-indigo-800',
    EMPLOYEE: 'bg-emerald-50 border-emerald-200 text-emerald-800',
  };

  const columns = [
    {
      header: 'Account User',
      render: (row) => (
        <div>
          <div className="font-bold text-slate-900">{row.fullName}</div>
          <div className="text-xs text-slate-500">{row.email}</div>
        </div>
      ),
    },
    {
      header: 'System Role',
      render: (row) => (
        <span
          className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-bold border uppercase tracking-wider ${
            roleColors[row.role] || 'bg-slate-100 text-slate-700'
          }`}
        >
          <Shield className="w-3 h-3" />
          {row.role}
        </span>
      ),
    },
    {
      header: 'Linked Staff Profile',
      render: (row) => (
        <div className="text-xs">
          {row.employeeRef ? (
            <div>
              <span className="font-semibold text-slate-800">{row.employeeRef.fullName}</span>
              <span className="text-slate-400 block text-[11px]">
                {row.employeeRef.employeeCode} • {row.employeeRef.department}
              </span>
            </div>
          ) : (
            <span className="text-slate-400 italic">None (System Admin / Desk)</span>
          )}
        </div>
      ),
    },
    {
      header: 'Status',
      render: (row) => (
        <span
          className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-semibold ${
            row.isActive ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-200 text-slate-600'
          }`}
        >
          {row.isActive ? 'Active' : 'Suspended'}
        </span>
      ),
    },
    {
      header: 'Created On',
      render: (row) => (
        <span className="text-xs text-slate-500">
          {row.createdAt ? new Date(row.createdAt).toLocaleDateString() : 'N/A'}
        </span>
      ),
    },
    {
      header: 'Actions',
      align: 'right',
      render: (row) => (
        <Button variant="secondary" size="xs" icon={Edit3} onClick={() => handleOpenEditModal(row)}>
          Edit
        </Button>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
        <div>
          <h2 className="text-xl font-bold text-slate-900">User Access & Accounts</h2>
          <p className="text-xs text-slate-500 mt-0.5">Provision logins, assign role permissions, and link accounts to employee host profiles</p>
        </div>
        <Button variant="primary" size="sm" icon={UserPlus} onClick={handleOpenCreateModal}>
          Provision User
        </Button>
      </div>

      {/* Filter Bar */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex flex-col sm:flex-row gap-3 items-center justify-between">
        <div className="w-full sm:w-72">
          <Input
            placeholder="Search by name, email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            icon={Search}
          />
        </div>
        <div className="w-full sm:w-56">
          <Select
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
            options={[
              { value: 'ALL', label: 'All Roles' },
              { value: 'ADMINISTRATOR', label: 'Administrator' },
              { value: 'RECEPTIONIST', label: 'Receptionist' },
              { value: 'EMPLOYEE', label: 'Employee' },
            ]}
          />
        </div>
      </div>

      {/* Table */}
      <DataTable
        columns={columns}
        data={filteredUsers}
        isLoading={isLoading}
        emptyMessage="No user accounts found."
      />

      {/* Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingUser ? 'Edit User Credentials' : 'Provision New System User'}
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="Full Name"
            placeholder="e.g. Sarah Jenkins"
            value={formData.fullName}
            onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
            required
          />

          <Input
            label="Email Address (Login ID)"
            type="email"
            placeholder="e.g. sarah@jayam.com"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            required
          />

          <Input
            label={editingUser ? 'Reset Password (Leave blank to keep existing)' : 'Initial Password'}
            type="password"
            placeholder="••••••••"
            value={formData.password}
            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
            required={!editingUser}
            icon={Key}
          />

          <Select
            label="Access Role"
            value={formData.role}
            onChange={(e) => setFormData({ ...formData, role: e.target.value })}
            required
            options={[
              { value: 'ADMINISTRATOR', label: 'Administrator (Full Access)' },
              { value: 'RECEPTIONIST', label: 'Receptionist (Front Desk Operations)' },
              { value: 'EMPLOYEE', label: 'Employee (Host Approvals)' },
            ]}
          />

          {formData.role === 'EMPLOYEE' && (
            <Select
              label="Link with Employee Profile"
              value={formData.employeeRef}
              onChange={(e) => setFormData({ ...formData, employeeRef: e.target.value })}
              required
              options={employees.map((emp) => ({
                value: emp._id,
                label: `${emp.fullName} (${emp.employeeCode} - ${emp.department})`,
              }))}
            />
          )}

          {editingUser && (
            <div className="pt-2">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.isActive}
                  onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                  className="rounded text-indigo-600 focus:ring-indigo-500 w-4 h-4"
                />
                <span className="text-xs font-semibold text-slate-700">Account is Active & Permitted to Login</span>
              </label>
            </div>
          )}

          <div className="mt-6 flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
            <Button variant="secondary" size="sm" onClick={() => setIsModalOpen(false)} disabled={formSubmitting}>
              Cancel
            </Button>
            <Button type="submit" variant="primary" size="sm" isLoading={formSubmitting}>
              {editingUser ? 'Save Account' : 'Create User'}
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default AdminUsersPage;
