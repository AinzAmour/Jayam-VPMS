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

  // 1. Create Employees across Departments
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
    {
      employeeCode: 'EMP-1005',
      fullName: 'Alexander Wright',
      email: 'alexander.wright@jayam.com',
      phone: '+1 555-010-2005',
      department: 'Engineering',
      designation: 'Principal Cloud Architect',
      isActive: true,
    },
    {
      employeeCode: 'EMP-1006',
      fullName: 'Samantha Cruz',
      email: 'samantha.cruz@jayam.com',
      phone: '+1 555-010-2006',
      department: 'Finance',
      designation: 'Chief Financial Controller',
      isActive: true,
    },
    {
      employeeCode: 'EMP-1007',
      fullName: 'Rajesh Varma',
      email: 'rajesh.varma@jayam.com',
      phone: '+1 555-010-2007',
      department: 'Information Security',
      designation: 'Director of Cyber Defense',
      isActive: true,
    },
    {
      employeeCode: 'EMP-1008',
      fullName: 'Elena Morales',
      email: 'elena.morales@jayam.com',
      phone: '+1 555-010-2008',
      department: 'Marketing',
      designation: 'Global Brand Director',
      isActive: true,
    },
    {
      employeeCode: 'EMP-1009',
      fullName: 'Jordan Lee',
      email: 'jordan.lee@jayam.com',
      phone: '+1 555-010-2009',
      department: 'Design',
      designation: 'Lead UX Strategist',
      isActive: true,
    },
    {
      employeeCode: 'EMP-1010',
      fullName: 'Michael Thorne',
      email: 'michael.thorne@jayam.com',
      phone: '+1 555-010-2010',
      department: 'Legal & Compliance',
      designation: 'General Counsel',
      isActive: true,
    },
    {
      employeeCode: 'EMP-1011',
      fullName: 'Claire Dubois',
      email: 'claire.dubois@jayam.com',
      phone: '+1 555-010-2011',
      department: 'Customer Success',
      designation: 'Enterprise Operations Lead',
      isActive: true,
    },
    {
      employeeCode: 'EMP-1012',
      fullName: 'Nathan Scott',
      email: 'nathan.scott@jayam.com',
      phone: '+1 555-010-2012',
      department: 'Engineering',
      designation: 'Senior DevOps Engineer',
      isActive: true,
    },
  ];

  const createdEmployees = await Employee.create(employeesData);
  console.log(`[Seed] Created ${createdEmployees.length} employees across departments.`);

  // 2. Create User Accounts
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
      email: 'receptionist2@jayam.com',
      password: 'Password123!',
      fullName: 'Raj Patel (Reception 2)',
      role: 'RECEPTIONIST',
      isActive: true,
      employeeRef: null,
    },
    ...createdEmployees.map((emp) => ({
      email: emp.email,
      password: 'Password123!',
      fullName: emp.fullName,
      role: 'EMPLOYEE',
      isActive: true,
      employeeRef: emp._id,
    })),
  ];

  const createdUsers = await User.create(usersData);
  console.log(`[Seed] Created ${createdUsers.length} user accounts.`);

  const receptionistUser = createdUsers[1];
  const adminUser = createdUsers[0];

  // Helper date generators
  const todayStr = getTodayDateString();
  const getDateOffset = (daysAgo) => {
    const d = new Date();
    d.setDate(d.getDate() - daysAgo);
    return normalizeDateString(d);
  };

  const yesterdayStr = getDateOffset(1);
  const twoDaysAgoStr = getDateOffset(2);
  const threeDaysAgoStr = getDateOffset(3);
  const fiveDaysAgoStr = getDateOffset(5);

  // 3. Create Rich Set of Visitor Passes
  const passesData = [
    // --- TODAY'S PENDING APPROVALS ---
    // 1. Pending Request for David Chen (count = 1)
    {
      passId: 'VP-20260826-001',
      visitorName: 'Robert Langdon',
      visitorPhone: '+1 555-888-1001',
      visitorEmail: 'robert.langdon@symbology.org',
      visitorCompany: 'Harvard Institute',
      hostEmployeeId: createdEmployees[0]._id, // David Chen
      visitDate: todayStr,
      expectedArrivalTime: '18:30',
      purpose: 'Technical consultation on quantum cryptographic protocol security',
      status: 'PENDING_APPROVAL',
      createdByUserId: receptionistUser._id,
    },
    // 2. Another Pending Request for David Chen (count = 2)
    {
      passId: 'VP-20260826-002',
      visitorName: 'Elena Rostova',
      visitorPhone: '+1 555-888-1002',
      visitorEmail: 'elena.r@cyberlabs.io',
      visitorCompany: 'CyberLabs Global',
      hostEmployeeId: createdEmployees[0]._id, // David Chen
      visitDate: todayStr,
      expectedArrivalTime: '19:00',
      purpose: 'Frontend system integration and API review meeting',
      status: 'PENDING_APPROVAL',
      createdByUserId: receptionistUser._id,
    },
    // 3. Pending Request for Samantha Cruz
    {
      passId: 'VP-20260826-003',
      visitorName: 'Carlos Mendoza',
      visitorPhone: '+1 555-888-1021',
      visitorEmail: 'carlos.m@fintechventures.com',
      visitorCompany: 'FinTech Ventures Capital',
      hostEmployeeId: createdEmployees[5]._id, // Samantha Cruz (Finance)
      visitDate: todayStr,
      expectedArrivalTime: '19:00',
      purpose: 'Q3 Enterprise financial audit and investment review',
      status: 'PENDING_APPROVAL',
      createdByUserId: receptionistUser._id,
    },
    // 4. Pending Request for Rajesh Varma
    {
      passId: 'VP-20260826-004',
      visitorName: 'Zachary Taylor',
      visitorPhone: '+1 555-888-1022',
      visitorEmail: 'z.taylor@cybersecguild.org',
      visitorCompany: 'Cyber Defense Guild',
      hostEmployeeId: createdEmployees[6]._id, // Rajesh Varma (InfoSec)
      visitDate: todayStr,
      expectedArrivalTime: '19:30',
      purpose: 'Zero-trust architecture audit and perimeter review',
      status: 'PENDING_APPROVAL',
      createdByUserId: receptionistUser._id,
    },

    // --- TODAY'S APPROVED (Ready for Front Desk Check-in) ---
    {
      passId: 'VP-20260826-005',
      visitorName: 'Sophia Loren',
      visitorPhone: '+1 555-888-1003',
      visitorEmail: 'sophia@acme-ventures.com',
      visitorCompany: 'Acme Ventures Capital',
      hostEmployeeId: createdEmployees[1]._id, // Ananya Sharma (HR)
      visitDate: todayStr,
      expectedArrivalTime: '17:30',
      purpose: 'Executive briefing and candidate interview assessment',
      status: 'APPROVED',
      hostRemarks: 'Approved. Please escort guest to Conference Room 4B.',
      createdByUserId: receptionistUser._id,
    },
    {
      passId: 'VP-20260826-006',
      visitorName: 'Arthur Pendelton',
      visitorPhone: '+1 555-888-1023',
      visitorEmail: 'arthur@apexcloud.io',
      visitorCompany: 'Apex Cloud Solutions',
      hostEmployeeId: createdEmployees[4]._id, // Alexander Wright (Engineering)
      visitDate: todayStr,
      expectedArrivalTime: '18:00',
      purpose: 'Multi-region AWS cluster migration alignment meeting',
      status: 'APPROVED',
      hostRemarks: 'Approved. Guest has NDA on file.',
      createdByUserId: receptionistUser._id,
    },
    {
      passId: 'VP-20260826-007',
      visitorName: 'Beatrice Ramos',
      visitorPhone: '+1 555-888-1024',
      visitorEmail: 'b.ramos@starlightmedia.com',
      visitorCompany: 'Starlight Digital Media',
      hostEmployeeId: createdEmployees[7]._id, // Elena Morales (Marketing)
      visitDate: todayStr,
      expectedArrivalTime: '18:15',
      purpose: 'Annual product launch marketing campaign presentation',
      status: 'APPROVED',
      hostRemarks: 'Approved. Ready for pitch in Studio 2.',
      createdByUserId: receptionistUser._id,
    },

    // --- TODAY'S CURRENTLY CHECKED-IN (Inside Facility) ---
    {
      passId: 'VP-20260826-008',
      visitorName: 'James Wilson',
      visitorPhone: '+1 555-888-1004',
      visitorEmail: 'j.wilson@nexusdynamics.net',
      visitorCompany: 'Nexus Dynamics',
      hostEmployeeId: createdEmployees[2]._id, // Marcus Vance (Product)
      visitDate: todayStr,
      expectedArrivalTime: '15:00',
      purpose: 'Product roadmapping and Q4 partner sync',
      status: 'CHECKED_IN',
      checkInTime: new Date(Date.now() - 75 * 60 * 1000),
      hostRemarks: 'Approved. Guest has arrived.',
      createdByUserId: receptionistUser._id,
    },
    {
      passId: 'VP-20260826-009',
      visitorName: 'Daniel Kim',
      visitorPhone: '+1 555-888-1025',
      visitorEmail: 'daniel.kim@google.com',
      visitorCompany: 'Google Cloud Platform',
      hostEmployeeId: createdEmployees[0]._id, // David Chen
      visitDate: todayStr,
      expectedArrivalTime: '15:30',
      purpose: 'Kubernetes enterprise architecture deep-dive',
      status: 'CHECKED_IN',
      checkInTime: new Date(Date.now() - 50 * 60 * 1000),
      hostRemarks: 'Approved. Escorted to Lab 3.',
      createdByUserId: receptionistUser._id,
    },
    {
      passId: 'VP-20260826-010',
      visitorName: 'Clara Oswald',
      visitorPhone: '+1 555-888-1026',
      visitorEmail: 'clara@matrixsystems.co.uk',
      visitorCompany: 'Matrix Facilities UK',
      hostEmployeeId: createdEmployees[3]._id, // Priya Patel (Ops)
      visitDate: todayStr,
      expectedArrivalTime: '16:00',
      purpose: 'Building automation and HVAC sensor maintenance',
      status: 'CHECKED_IN',
      checkInTime: new Date(Date.now() - 35 * 60 * 1000),
      hostRemarks: 'Approved. Vendor badge issued.',
      createdByUserId: receptionistUser._id,
    },
    {
      passId: 'VP-20260826-011',
      visitorName: 'Fiona Gallagher',
      visitorPhone: '+1 555-888-1027',
      visitorEmail: 'fiona.g@quantumanalytics.org',
      visitorCompany: 'Quantum Analytics',
      hostEmployeeId: createdEmployees[8]._id, // Jordan Lee (Design)
      visitDate: todayStr,
      expectedArrivalTime: '16:30',
      purpose: 'Design system usability evaluation and telemetry sync',
      status: 'CHECKED_IN',
      checkInTime: new Date(Date.now() - 20 * 60 * 1000),
      hostRemarks: 'Approved. In UX workshop room.',
      createdByUserId: receptionistUser._id,
    },

    // --- TODAY'S COMPLETED / CHECKED-OUT ---
    {
      passId: 'VP-20260826-012',
      visitorName: 'Dr. Evelyn Reed',
      visitorPhone: '+1 555-888-1005', // Checked out pass for Rule 2 test
      visitorEmail: 'evelyn.reed@biotech-research.edu',
      visitorCompany: 'BioTech Research Labs',
      hostEmployeeId: createdEmployees[3]._id, // Priya Patel
      visitDate: todayStr,
      expectedArrivalTime: '10:00',
      purpose: 'Quarterly facility safety and environmental audit',
      status: 'CHECKED_OUT',
      checkInTime: new Date(Date.now() - 4 * 3600 * 1000),
      checkOutTime: new Date(Date.now() - 2 * 3600 * 1000),
      hostRemarks: 'Approved. Safety audit completed successfully.',
      createdByUserId: receptionistUser._id,
    },
    {
      passId: 'VP-20260826-013',
      visitorName: 'Lucas Vance',
      visitorPhone: '+1 555-888-1028',
      visitorEmail: 'lucas.v@globalhardware.com',
      visitorCompany: 'Global Hardware Ltd',
      hostEmployeeId: createdEmployees[11]._id, // Nathan Scott (DevOps)
      visitDate: todayStr,
      expectedArrivalTime: '11:30',
      purpose: 'Data center rack inspection and switch upgrade',
      status: 'CHECKED_OUT',
      checkInTime: new Date(Date.now() - 3.5 * 3600 * 1000),
      checkOutTime: new Date(Date.now() - 1 * 3600 * 1000),
      hostRemarks: 'Approved. Hardware test pass complete.',
      createdByUserId: receptionistUser._id,
    },

    // --- TODAY'S REJECTED ---
    {
      passId: 'VP-20260826-014',
      visitorName: 'Gordon Vance',
      visitorPhone: '+1 555-888-1006',
      visitorEmail: 'gordon@vance-sales.com',
      visitorCompany: 'Vance Office Solutions',
      hostEmployeeId: createdEmployees[0]._id, // David Chen
      visitDate: todayStr,
      expectedArrivalTime: '14:00',
      purpose: 'Unsolicited vendor software sales pitch',
      status: 'REJECTED',
      hostRemarks: 'Rejected. No prior appointment or approved vendor contract.',
      createdByUserId: receptionistUser._id,
    },

    // --- HISTORICAL VISITS (Past Days for Reports & Charts) ---
    {
      passId: 'VP-20260825-001',
      visitorName: 'Amara Okafor',
      visitorPhone: '+1 555-888-1007',
      visitorEmail: 'amara@cloudsystems.co',
      visitorCompany: 'CloudSystems Enterprise',
      hostEmployeeId: createdEmployees[0]._id, // David Chen
      visitDate: yesterdayStr,
      expectedArrivalTime: '11:00',
      purpose: 'Cloud infrastructure security penetration test review',
      status: 'CHECKED_OUT',
      checkInTime: new Date(Date.now() - 28 * 3600 * 1000),
      checkOutTime: new Date(Date.now() - 25 * 3600 * 1000),
      hostRemarks: 'Approved. Productive infrastructure review.',
      createdByUserId: receptionistUser._id,
    },
    {
      passId: 'VP-20260825-002',
      visitorName: 'Hannah Abbott',
      visitorPhone: '+1 555-888-1029',
      visitorEmail: 'hannah@apexrecruit.com',
      visitorCompany: 'Apex Talent Recruitment',
      hostEmployeeId: createdEmployees[1]._id, // Ananya Sharma
      visitDate: yesterdayStr,
      expectedArrivalTime: '14:00',
      purpose: 'Senior engineering hiring pipeline strategy',
      status: 'CHECKED_OUT',
      checkInTime: new Date(Date.now() - 24 * 3600 * 1000),
      checkOutTime: new Date(Date.now() - 22 * 3600 * 1000),
      hostRemarks: 'Approved.',
      createdByUserId: receptionistUser._id,
    },
    {
      passId: 'VP-20260824-001',
      visitorName: 'Trevor Belmont',
      visitorPhone: '+1 555-888-1030',
      visitorEmail: 'trevor@vanguardinvest.com',
      visitorCompany: 'Vanguard Investments',
      hostEmployeeId: createdEmployees[5]._id, // Samantha Cruz (Finance)
      visitDate: twoDaysAgoStr,
      expectedArrivalTime: '10:30',
      purpose: 'Fiscal year-end compliance portfolio check',
      status: 'CHECKED_OUT',
      checkInTime: new Date(Date.now() - 52 * 3600 * 1000),
      checkOutTime: new Date(Date.now() - 49 * 3600 * 1000),
      hostRemarks: 'Approved. All documents verified.',
      createdByUserId: receptionistUser._id,
    },
    {
      passId: 'VP-20260824-002',
      visitorName: 'Seraphina Drake',
      visitorPhone: '+1 555-888-1031',
      visitorEmail: 'seraphina@drakelaw.com',
      visitorCompany: 'Drake & Associates Law',
      hostEmployeeId: createdEmployees[9]._id, // Michael Thorne (Legal)
      visitDate: twoDaysAgoStr,
      expectedArrivalTime: '15:00',
      purpose: 'Intellectual property licensing review',
      status: 'CHECKED_OUT',
      checkInTime: new Date(Date.now() - 48 * 3600 * 1000),
      checkOutTime: new Date(Date.now() - 46 * 3600 * 1000),
      hostRemarks: 'Approved by Legal counsel.',
      createdByUserId: receptionistUser._id,
    },
    {
      passId: 'VP-20260823-001',
      visitorName: 'Derrick Rose',
      visitorPhone: '+1 555-888-1032',
      visitorEmail: 'derrick@bulls-enterprise.org',
      visitorCompany: 'Bulls Enterprise Logistics',
      hostEmployeeId: createdEmployees[10]._id, // Claire Dubois (CS)
      visitDate: threeDaysAgoStr,
      expectedArrivalTime: '13:00',
      purpose: 'Service SLA partnership and quarterly review',
      status: 'CHECKED_OUT',
      checkInTime: new Date(Date.now() - 76 * 3600 * 1000),
      checkOutTime: new Date(Date.now() - 73 * 3600 * 1000),
      hostRemarks: 'Approved.',
      createdByUserId: receptionistUser._id,
    },
    {
      passId: 'VP-20260821-001',
      visitorName: 'Elena Gilbert',
      visitorPhone: '+1 555-888-1033',
      visitorEmail: 'elena@mysticmedia.com',
      visitorCompany: 'Mystic Media Creative',
      hostEmployeeId: createdEmployees[7]._id, // Elena Morales (Marketing)
      visitDate: fiveDaysAgoStr,
      expectedArrivalTime: '11:00',
      purpose: 'Brand photography and executive portrait session',
      status: 'CHECKED_OUT',
      checkInTime: new Date(Date.now() - 122 * 3600 * 1000),
      checkOutTime: new Date(Date.now() - 118 * 3600 * 1000),
      hostRemarks: 'Approved. Completed in Studio 1.',
      createdByUserId: receptionistUser._id,
    },
  ];

  const createdPasses = await VisitPass.create(passesData);
  console.log(`[Seed] Created ${createdPasses.length} visitor passes across multiple states.`);

  // 4. Create Activity Logs corresponding to visit passes
  const activityLogs = [];

  createdPasses.forEach((pass, index) => {
    // 1. All passes have CREATED log
    activityLogs.push({
      visitPassId: pass._id,
      passId: pass.passId,
      action: 'CREATED',
      performedByUserId: receptionistUser._id,
      performedByName: receptionistUser.fullName,
      performedByRole: receptionistUser.role,
      remarks: `Visitor registration initiated at front desk for ${pass.visitorName} (${pass.visitorCompany}).`,
      timestamp: new Date(Date.now() - (index + 2) * 3600 * 1000),
    });

    // 2. Approved passes
    if (['APPROVED', 'CHECKED_IN', 'CHECKED_OUT'].includes(pass.status)) {
      const hostUser = createdUsers.find((u) => u.employeeRef?.toString() === pass.hostEmployeeId.toString()) || adminUser;
      activityLogs.push({
        visitPassId: pass._id,
        passId: pass.passId,
        action: 'APPROVED',
        performedByUserId: hostUser._id,
        performedByName: hostUser.fullName,
        performedByRole: hostUser.role,
        remarks: pass.hostRemarks || 'Visit request approved by host.',
        timestamp: new Date(Date.now() - (index + 1.5) * 3600 * 1000),
      });
    }

    // 3. Rejected passes
    if (pass.status === 'REJECTED') {
      const hostUser = createdUsers.find((u) => u.employeeRef?.toString() === pass.hostEmployeeId.toString()) || adminUser;
      activityLogs.push({
        visitPassId: pass._id,
        passId: pass.passId,
        action: 'REJECTED',
        performedByUserId: hostUser._id,
        performedByName: hostUser.fullName,
        performedByRole: hostUser.role,
        remarks: pass.hostRemarks || 'Visit request rejected by host.',
        timestamp: new Date(Date.now() - (index + 1.5) * 3600 * 1000),
      });
    }

    // 4. Checked In passes
    if (['CHECKED_IN', 'CHECKED_OUT'].includes(pass.status) && pass.checkInTime) {
      activityLogs.push({
        visitPassId: pass._id,
        passId: pass.passId,
        action: 'CHECKED_IN',
        performedByUserId: receptionistUser._id,
        performedByName: receptionistUser.fullName,
        performedByRole: receptionistUser.role,
        remarks: `Visitor admitted at reception. Guest badge #${100 + index} issued.`,
        timestamp: pass.checkInTime,
      });
    }

    // 5. Checked Out passes
    if (pass.status === 'CHECKED_OUT' && pass.checkOutTime) {
      activityLogs.push({
        visitPassId: pass._id,
        passId: pass.passId,
        action: 'CHECKED_OUT',
        performedByUserId: receptionistUser._id,
        performedByName: receptionistUser.fullName,
        performedByRole: receptionistUser.role,
        remarks: 'Visitor checked out. Badge returned and logged.',
        timestamp: pass.checkOutTime,
      });
    }
  });

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
