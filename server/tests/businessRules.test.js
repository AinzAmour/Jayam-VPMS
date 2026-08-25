import test from 'node:test';
import assert from 'node:assert/strict';
import { connectDB, disconnectDB } from '../config/db.js';
import { seedDatabase } from '../utils/seed.js';
import User from '../models/User.js';
import Employee from '../models/Employee.js';
import VisitPass from '../models/VisitPass.js';
import {
  validateVisitRegistration,
  validateCheckIn,
  validateCheckOut,
  getTodayDateString,
} from '../services/businessRules.js';
import { getPassActivities } from '../controllers/visitorController.js';
import { getJwtSecret } from '../middleware/auth.js';

test('VPMS Backend Test Suite - Business Rules & Persistence', async (t) => {
  await t.test('Connect to DB and Seed Data', async () => {
    await connectDB();
    await seedDatabase();

    const userCount = await User.countDocuments();
    const employeeCount = await Employee.countDocuments();
    const passCount = await VisitPass.countDocuments();

    assert.ok(userCount >= 6, 'Should seed at least 6 users');
    assert.ok(employeeCount >= 4, 'Should seed at least 4 employees');
    assert.ok(passCount >= 6, 'Should seed at least 6 visitor passes');
  });

  await t.test('Rule 1: A visitor cannot have more than one active visit simultaneously', async () => {
    const employee = await Employee.findOne({ email: 'ananya.sharma@jayam.com' });
    const todayStr = getTodayDateString();

    // Sophia Loren has an active APPROVED pass (+1 555-888-1003)
    await assert.rejects(
      async () => {
        await validateVisitRegistration({
          visitorPhone: '+1 555-888-1003',
          hostEmployeeId: employee._id,
          visitDate: todayStr,
          expectedArrivalTime: '23:59',
        });
      },
      {
        errorCode: 'RULE_1_ACTIVE_VISIT_EXISTS',
      }
    );
  });

  await t.test('Rule 2: Duplicate registrations on same date prohibited', async () => {
    const employee = await Employee.findOne({ email: 'marcus.vance@jayam.com' });
    const todayStr = getTodayDateString();

    // Dr. Evelyn Reed already has a CHECKED_OUT pass today (+1 555-888-1005)
    await assert.rejects(
      async () => {
        await validateVisitRegistration({
          visitorPhone: '+1 555-888-1005',
          hostEmployeeId: employee._id,
          visitDate: todayStr,
          expectedArrivalTime: '23:59',
        });
      },
      {
        errorCode: 'RULE_2_DUPLICATE_REGISTRATION',
      }
    );
  });

  await t.test('Rule 3: Visit date cannot be earlier than current date', async () => {
    const employee = await Employee.findOne({ email: 'david.chen@jayam.com' });

    await assert.rejects(
      async () => {
        await validateVisitRegistration({
          visitorPhone: '+1 555-999-0001',
          hostEmployeeId: employee._id,
          visitDate: '2020-01-01',
          expectedArrivalTime: '12:00',
        });
      },
      {
        errorCode: 'RULE_3_PAST_DATE',
      }
    );
  });

  await t.test('Rule 4: Today registrations arrival time cannot be earlier than current time', async () => {
    const employee = await Employee.findOne({ email: 'david.chen@jayam.com' });
    const todayStr = getTodayDateString();

    await assert.rejects(
      async () => {
        await validateVisitRegistration({
          visitorPhone: '+1 555-999-0002',
          hostEmployeeId: employee._id,
          visitDate: todayStr,
          expectedArrivalTime: '00:01', // Definitely earlier than current time during day
        });
      },
      {
        errorCode: 'RULE_4_PAST_TIME',
      }
    );
  });

  await t.test('Rule 5: Host employee cannot have more than 3 pending requests', async () => {
    const employee = await Employee.findOne({ email: 'david.chen@jayam.com' });
    const todayStr = getTodayDateString();
    const admin = await User.findOne({ role: 'ADMINISTRATOR' });

    // David Chen currently has 2 pending passes. Let's add a 3rd.
    await VisitPass.create({
      passId: 'VP-TEST-003',
      visitorName: 'Pending Test Visitor',
      visitorPhone: '+1 555-999-8888',
      visitorCompany: 'Test Co',
      hostEmployeeId: employee._id,
      visitDate: todayStr,
      expectedArrivalTime: '23:59',
      purpose: 'Testing 3 pending rule',
      status: 'PENDING_APPROVAL',
      createdByUserId: admin._id,
    });

    // Now David has 3 pending passes. A 4th registration should be rejected.
    await assert.rejects(
      async () => {
        await validateVisitRegistration({
          visitorPhone: '+1 555-999-9999',
          hostEmployeeId: employee._id,
          visitDate: todayStr,
          expectedArrivalTime: '23:59',
        });
      },
      {
        errorCode: 'RULE_5_MAX_PENDING_EXCEEDED',
      }
    );
  });

  await t.test('Rule 6 & 9: Visitors can only be checked in after approval, not when pending or rejected', async () => {
    const pendingPass = await VisitPass.findOne({ status: 'PENDING_APPROVAL' });
    const rejectedPass = await VisitPass.findOne({ status: 'REJECTED' });

    await assert.rejects(
      async () => {
        await validateCheckIn(pendingPass);
      },
      {
        errorCode: 'RULE_6_NOT_APPROVED',
      }
    );

    await assert.rejects(
      async () => {
        await validateCheckIn(rejectedPass);
      },
      {
        errorCode: 'RULE_9_REJECTED_PASS',
      }
    );
  });

  await t.test('Rule 7: A visitor who is already checked in cannot be checked in again', async () => {
    const checkedInPass = await VisitPass.findOne({ status: 'CHECKED_IN' });
    
    // Create another approved pass for same visitor phone
    const anotherPass = new VisitPass({
      _id: new (await import('mongoose')).default.Types.ObjectId(),
      passId: 'VP-TEST-004',
      visitorName: checkedInPass.visitorName,
      visitorPhone: checkedInPass.visitorPhone,
      status: 'APPROVED',
    });

    await assert.rejects(
      async () => {
        await validateCheckIn(anotherPass);
      },
      {
        errorCode: 'RULE_7_ALREADY_CHECKED_IN',
      }
    );
  });

  await t.test('Rule 8: Check-out time must always be later than check-in time', async () => {
    const checkedInPass = await VisitPass.findOne({ status: 'CHECKED_IN' });
    const invalidCheckOutTime = new Date(checkedInPass.checkInTime.getTime() - 10000);

    assert.throws(
      () => {
        validateCheckOut(checkedInPass, invalidCheckOutTime);
      },
      {
        errorCode: 'RULE_8_INVALID_CHECKOUT_TIME',
      }
    );
  });

  await t.test('Security Fix 1: IDOR scoping on visitor pass activity trail', async () => {
    const david = await Employee.findOne({ email: 'david.chen@jayam.com' });
    const ananya = await Employee.findOne({ email: 'ananya.sharma@jayam.com' });

    const davidsPass = await VisitPass.findOne({ hostEmployeeId: david._id });
    const ananyasPass = await VisitPass.findOne({ hostEmployeeId: ananya._id });

    assert.ok(davidsPass, 'Should find a pass hosted by David');
    assert.ok(ananyasPass, 'Should find a pass hosted by Ananya');

    const createMockRes = () => ({
      statusCode: 200,
      data: null,
      status(code) {
        this.statusCode = code;
        return this;
      },
      json(payload) {
        this.data = payload;
        return this;
      },
    });

    // 1. Employee David requests activity trail for his OWN pass -> Allowed (200)
    const reqDavidOwn = {
      params: { id: davidsPass._id.toString() },
      user: { role: 'EMPLOYEE', employeeRef: david._id },
    };
    const resDavidOwn = createMockRes();
    await getPassActivities(reqDavidOwn, resDavidOwn, () => {});
    assert.equal(resDavidOwn.statusCode, 200, 'Employee should access activities for own hosted pass');
    assert.equal(resDavidOwn.data?.success, true);
    assert.ok(Array.isArray(resDavidOwn.data?.data), 'Should return activity array');

    // 2. Employee David requests activity trail for Ananya\'s pass -> Blocked (403)
    const reqDavidOther = {
      params: { id: ananyasPass._id.toString() },
      user: { role: 'EMPLOYEE', employeeRef: david._id },
    };
    const resDavidOther = createMockRes();
    await getPassActivities(reqDavidOther, resDavidOther, () => {});
    assert.equal(resDavidOther.statusCode, 403, 'Employee must be blocked (403) from other host\'s pass activities');
    assert.equal(resDavidOther.data?.success, false);

    // 3. Receptionist / Admin requests activity trail for any pass -> Allowed (200)
    const reqReceptionist = {
      params: { id: ananyasPass._id.toString() },
      user: { role: 'RECEPTIONIST' },
    };
    const resReceptionist = createMockRes();
    await getPassActivities(reqReceptionist, resReceptionist, () => {});
    assert.equal(resReceptionist.statusCode, 200, 'Receptionist should access activities across all passes');
    assert.equal(resReceptionist.data?.success, true);
  });

  await t.test('Security Fix 2: JWT_SECRET environment requirement check', () => {
    const originalSecret = process.env.JWT_SECRET;
    try {
      delete process.env.JWT_SECRET;
      assert.throws(
        () => {
          getJwtSecret();
        },
        /JWT_SECRET environment variable is missing/
      );
    } finally {
      process.env.JWT_SECRET = originalSecret;
    }
  });

  await disconnectDB();
});
