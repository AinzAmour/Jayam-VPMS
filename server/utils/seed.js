import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from '../models/User.js';
import Employee from '../models/Employee.js';
import VisitPass from '../models/VisitPass.js';
import ActivityLog from '../models/ActivityLog.js';
import { connectDB, disconnectDB } from '../config/db.js';
import { getTodayDateString, normalizeDateString } from '../services/businessRules.js';

dotenv.config();

export const seedDatabase = async () => {
  console.log('[Seed] Starting database seeding...');

  // Clear existing collections
  await User.deleteMany({});
  await Employee.deleteMany({});
  await VisitPass.deleteMany({});
  await ActivityLog.deleteMany({});

  console.log('[Seed] Cleared existing data.');

  // 1. Create Employees
  const employeesData = [
    {
      employeeCode: 'EMP-1001',
      fullName: 'David Chen',
      email: 'david.chen@jayam.com',
      phone: '+1 555-010-2001',
      department: 'Engineering',
      designation: 'Lead Software Architect',
      isActive: true,
    },
    {
      employeeCode: 'EMP-1002',
      fullName: 'Ananya Sharma',
      email: 'ananya.sharma@jayam.com',
      phone: '+1 555-010-2002',
      department: 'Human Resources',
      designation: 'Talent Acquisition Lead',
      isActive: true,
    },
    {
      employeeCode: 'EMP-1003',
      fullName: 'Marcus Vance',
      email: 'marcus.vance@jayam.com',
      phone: '+1 555-010-2003',
      department: 'Product Management',
      designation: 'VP of Product',
      isActive: true,
    },
    {
      employeeCode: 'EMP-1004',
      fullName: 'Priya Patel',
      email: 'priya.patel@jayam.com',
      phone: '+1 555-010-2004',
      department: 'Operations',
      designation: 'Head of Facilities',
      isActive: true,
    },
  ];

  const createdEmployees = await Employee.create(employeesData);
  console.log(`[Seed] Created ${createdEmployees.length} employees.`);

  // 2. Create User Accounts
  // Passwords will be hashed automatically by User pre-save hook
  const usersData = [
    {
      email: 'admin@jayam.com',
      password: 'Password123!',
      fullName: 'Vikram Mehta (Admin)',
      role: 'ADMINISTRATOR',
      isActive: true,
      employeeRef: null,
    },
    {
      email: 'receptionist@jayam.com',
      password: 'Password123!',
      fullName: 'Sarah Jenkins (Front Desk)',
      role: 'RECEPTIONIST',
      isActive: true,
      employeeRef: null,
    },
    {
      email: 'david.chen@jayam.com',
      password: 'Password123!',
      fullName: 'David Chen',
      role: 'EMPLOYEE',
      isActive: true,
      employeeRef: createdEmployees[0]._id,
    },
    {
      email: 'ananya.sharma@jayam.com',
      password: 'Password123!',
      fullName: 'Ananya Sharma',
      role: 'EMPLOYEE',
      isActive: true,
      employeeRef: createdEmployees[1]._id,
    },
    {
      email: 'marcus.vance@jayam.com',
      password: 'Password123!',
      fullName: 'Marcus Vance',
      role: 'EMPLOYEE',
      isActive: true,
      employeeRef: createdEmployees[2]._id,
    },
    {
      email: 'priya.patel@jayam.com',
      password: 'Password123!',
      fullName: 'Priya Patel',
      role: 'EMPLOYEE',
      isActive: true,
      employeeRef: createdEmployees[3]._id,
    },
  ];

  const createdUsers = await User.create(usersData);
  console.log(`[Seed] Created ${createdUsers.length} user accounts.`);

  const adminUser = createdUsers[0];
  const receptionistUser = createdUsers[1];
  const davidUser = createdUsers[2];
  const ananyaUser = createdUsers[3];

  const todayStr = getTodayDateString();
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  const yesterdayStr = normalizeDateString(yesterday);

  // 3. Create Sample Visit Passes
  const passesData = [
    // 1. Pending Request for David Chen (shows up in Employee Dashboard & Reception queue)
    {
      passId: 'VP-20260824-001',
      visitorName: 'Robert Langdon',
      visitorPhone: '+1 555-888-1001',
      visitorEmail: 'robert.langdon@symbology.org',
      visitorCompany: 'Harvard Institute',
      hostEmployeeId: createdEmployees[0]._id, // David
      visitDate: todayStr,
      expectedArrivalTime: '18:30',
      purpose: 'Technical consultation on quantum cryptographic protocol security',
      status: 'PENDING_APPROVAL',
      createdByUserId: receptionistUser._id,
    },
    // 2. Another Pending Request for David Chen (count = 2)
    {
      passId: 'VP-20260824-002',
      visitorName: 'Elena Rostova',
      visitorPhone: '+1 555-888-1002',
      visitorEmail: 'elena.r@cyberlabs.io',
      visitorCompany: 'CyberLabs Global',
      hostEmployeeId: createdEmployees[0]._id, // David
      visitDate: todayStr,
      expectedArrivalTime: '19:00',
      purpose: 'Frontend system integration and API review meeting',
      status: 'PENDING_APPROVAL',
      createdByUserId: receptionistUser._id,
    },
    // 3. Approved pass ready for 1-click Check-In at reception
    {
      passId: 'VP-20260824-003',
      visitorName: 'Sophia Loren',
      visitorPhone: '+1 555-888-1003',
      visitorEmail: 'sophia@acme-ventures.com',
      visitorCompany: 'Acme Ventures Capital',
      hostEmployeeId: createdEmployees[1]._id, // Ananya
      visitDate: todayStr,
      expectedArrivalTime: '17:30',
      purpose: 'Executive briefing and candidate interview assessment',
      status: 'APPROVED',
      hostRemarks: 'Approved. Please escort guest to Conference Room 4B.',
      createdByUserId: receptionistUser._id,
    },
    // 4. Currently Checked-In pass (Inside premises, ready for 1-click Check-Out)
    {
      passId: 'VP-20260824-004',
      visitorName: 'James Wilson',
      visitorPhone: '+1 555-888-1004',
      visitorEmail: 'j.wilson@nexusdynamics.net',
      visitorCompany: 'Nexus Dynamics',
      hostEmployeeId: createdEmployees[2]._id, // Marcus
      visitDate: todayStr,
      expectedArrivalTime: '16:00',
      purpose: 'Product roadmapping and Q3 quarterly partner sync',
      status: 'CHECKED_IN',
      checkInTime: new Date(Date.now() - 45 * 60 * 1000), // Checked in 45 mins ago
      hostRemarks: 'Approved. Guest has arrived.',
      createdByUserId: receptionistUser._id,
    },
    // 5. Completed Visit (Checked Out)
    {
      passId: 'VP-20260824-005',
      visitorName: 'Dr. Evelyn Reed',
      visitorPhone: '+1 555-888-1005',
      visitorEmail: 'evelyn.reed@biotech-research.edu',
      visitorCompany: 'BioTech Research Labs',
      hostEmployeeId: createdEmployees[3]._id, // Priya
      visitDate: todayStr,
      expectedArrivalTime: '14:00',
      purpose: 'Quarterly facility safety and environmental audit',
      status: 'CHECKED_OUT',
      checkInTime: new Date(Date.now() - 3 * 3600 * 1000),
      checkOutTime: new Date(Date.now() - 1.5 * 3600 * 1000),
      hostRemarks: 'Approved. Safety audit completed successfully.',
      createdByUserId: receptionistUser._id,
    },
    // 6. Rejected pass
    {
      passId: 'VP-20260824-006',
      visitorName: 'Gordon Vance',
      visitorPhone: '+1 555-888-1006',
      visitorEmail: 'gordon@vance-sales.com',
      visitorCompany: 'Vance Office Solutions',
      hostEmployeeId: createdEmployees[0]._id, // David
      visitDate: todayStr,
      expectedArrivalTime: '15:00',
      purpose: 'Unsolicited vendor software pitch',
      status: 'REJECTED',
      hostRemarks: 'Rejected. No prior appointment or vendor contract in place.',
      createdByUserId: receptionistUser._id,
    },
    // 7. Yesterday's Completed Visit
    {
      passId: 'VP-20260823-001',
      visitorName: 'Amara Okafor',
      visitorPhone: '+1 555-888-1007',
      visitorEmail: 'amara@cloudsystems.co',
      visitorCompany: 'CloudSystems Enterprise',
      hostEmployeeId: createdEmployees[0]._id, // David
      visitDate: yesterdayStr,
      expectedArrivalTime: '11:00',
      purpose: 'Cloud infrastructure security penetration test review',
      status: 'CHECKED_OUT',
      checkInTime: new Date(Date.now() - 26 * 3600 * 1000),
      checkOutTime: new Date(Date.now() - 24 * 3600 * 1000),
      hostRemarks: 'Approved. Very productive infrastructure review.',
      createdByUserId: receptionistUser._id,
    },
  ];

  const createdPasses = await VisitPass.create(passesData);
  console.log(`[Seed] Created ${createdPasses.length} visitor passes.`);

  // 4. Create Activity Logs
  const activityLogs = [
    {
      visitPassId: createdPasses[0]._id,
      passId: createdPasses[0].passId,
      action: 'CREATED',
      performedByUserId: receptionistUser._id,
      performedByName: receptionistUser.fullName,
      performedByRole: receptionistUser.role,
      remarks: 'Visitor registration initiated at front desk.',
      timestamp: new Date(Date.now() - 2 * 3600 * 1000),
    },
    {
      visitPassId: createdPasses[1]._id,
      passId: createdPasses[1].passId,
      action: 'CREATED',
      performedByUserId: receptionistUser._id,
      performedByName: receptionistUser.fullName,
      performedByRole: receptionistUser.role,
      remarks: 'Visitor registration initiated at front desk.',
      timestamp: new Date(Date.now() - 1.5 * 3600 * 1000),
    },
    {
      visitPassId: createdPasses[2]._id,
      passId: createdPasses[2].passId,
      action: 'CREATED',
      performedByUserId: receptionistUser._id,
      performedByName: receptionistUser.fullName,
      performedByRole: receptionistUser.role,
      remarks: 'Visitor pass created.',
      timestamp: new Date(Date.now() - 4 * 3600 * 1000),
    },
    {
      visitPassId: createdPasses[2]._id,
      passId: createdPasses[2].passId,
      action: 'APPROVED',
      performedByUserId: ananyaUser._id,
      performedByName: ananyaUser.fullName,
      performedByRole: ananyaUser.role,
      remarks: 'Approved. Please escort guest to Conference Room 4B.',
      timestamp: new Date(Date.now() - 3.5 * 3600 * 1000),
    },
    {
      visitPassId: createdPasses[3]._id,
      passId: createdPasses[3].passId,
      action: 'CREATED',
      performedByUserId: receptionistUser._id,
      performedByName: receptionistUser.fullName,
      performedByRole: receptionistUser.role,
      remarks: 'Visitor pass created.',
      timestamp: new Date(Date.now() - 5 * 3600 * 1000),
    },
    {
      visitPassId: createdPasses[3]._id,
      passId: createdPasses[3].passId,
      action: 'APPROVED',
      performedByUserId: createdUsers[4]._id,
      performedByName: createdUsers[4].fullName,
      performedByRole: createdUsers[4].role,
      remarks: 'Approved. Guest has arrived.',
      timestamp: new Date(Date.now() - 2 * 3600 * 1000),
    },
    {
      visitPassId: createdPasses[3]._id,
      passId: createdPasses[3].passId,
      action: 'CHECKED_IN',
      performedByUserId: receptionistUser._id,
      performedByName: receptionistUser.fullName,
      performedByRole: receptionistUser.role,
      remarks: 'Visitor admitted at reception. Guest badge #042 issued.',
      timestamp: createdPasses[3].checkInTime,
    },
    {
      visitPassId: createdPasses[4]._id,
      passId: createdPasses[4].passId,
      action: 'CREATED',
      performedByUserId: receptionistUser._id,
      performedByName: receptionistUser.fullName,
      performedByRole: receptionistUser.role,
      remarks: 'Visitor pass created.',
      timestamp: new Date(Date.now() - 6 * 3600 * 1000),
    },
    {
      visitPassId: createdPasses[4]._id,
      passId: createdPasses[4].passId,
      action: 'CHECKED_IN',
      performedByUserId: receptionistUser._id,
      performedByName: receptionistUser.fullName,
      performedByRole: receptionistUser.role,
      remarks: 'Visitor checked in.',
      timestamp: createdPasses[4].checkInTime,
    },
    {
      visitPassId: createdPasses[4]._id,
      passId: createdPasses[4].passId,
      action: 'CHECKED_OUT',
      performedByUserId: receptionistUser._id,
      performedByName: receptionistUser.fullName,
      performedByRole: receptionistUser.role,
      remarks: 'Visitor checked out. Badge returned.',
      timestamp: createdPasses[4].checkOutTime,
    },
  ];

  await ActivityLog.create(activityLogs);
  console.log(`[Seed] Created ${activityLogs.length} audit log entries.`);
  console.log('[Seed] Database seeding completed successfully.');
};

// If run directly via CLI: `node utils/seed.js`
if (process.argv[1] && process.argv[1].endsWith('seed.js')) {
  (async () => {
    try {
      await connectDB();
      await seedDatabase();
      await disconnectDB();
      process.exit(0);
    } catch (err) {
      console.error('[Seed Error]:', err);
      process.exit(1);
    }
  })();
}
