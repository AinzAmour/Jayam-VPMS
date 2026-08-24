import VisitPass from '../models/VisitPass.js';

export const normalizeDateString = (dateInput) => {
  if (!dateInput) return null;
  if (typeof dateInput === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(dateInput)) {
    return dateInput;
  }
  const d = new Date(dateInput);
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

export const getTodayDateString = () => {
  const d = new Date();
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

export const getCurrentTimeString = () => {
  const d = new Date();
  const hours = String(d.getHours()).padStart(2, '0');
  const minutes = String(d.getMinutes()).padStart(2, '0');
  return `${hours}:${minutes}`;
};

/**
 * Validate all creation-time business rules (Rules 1, 2, 3, 4, 5)
 */
export const validateVisitRegistration = async ({
  visitorPhone,
  hostEmployeeId,
  visitDate,
  expectedArrivalTime,
}) => {
  const normalizedVisitDate = normalizeDateString(visitDate);
  const todayStr = getTodayDateString();
  const currentTimeStr = getCurrentTimeString();

  // Rule 3: Visit date cannot be earlier than current date
  if (normalizedVisitDate < todayStr) {
    const error = new Error('Visit date cannot be earlier than the current date (Rule 3).');
    error.statusCode = 400;
    error.errorCode = 'RULE_3_PAST_DATE';
    throw error;
  }

  // Rule 4: For today's registrations, expected arrival time cannot be earlier than current time
  if (normalizedVisitDate === todayStr) {
    // If expected arrival time is strictly before current time
    if (expectedArrivalTime < currentTimeStr) {
      const error = new Error(
        `For today's registrations, expected arrival time (${expectedArrivalTime}) cannot be earlier than the current time (${currentTimeStr}) (Rule 4).`
      );
      error.statusCode = 400;
      error.errorCode = 'RULE_4_PAST_TIME';
      throw error;
    }
  }

  // Rule 1: A visitor cannot have more than one active visit at the same time
  // Active statuses: PENDING_APPROVAL, APPROVED, CHECKED_IN
  const activeVisit = await VisitPass.findOne({
    visitorPhone: visitorPhone.trim(),
    status: { $in: ['PENDING_APPROVAL', 'APPROVED', 'CHECKED_IN'] },
  });

  if (activeVisit) {
    const error = new Error(
      `Visitor with phone ${visitorPhone} already has an active visit pass (${activeVisit.passId} with status '${activeVisit.status}'). A visitor cannot have more than one active visit simultaneously (Rule 1).`
    );
    error.statusCode = 400;
    error.errorCode = 'RULE_1_ACTIVE_VISIT_EXISTS';
    throw error;
  }

  // Rule 2: Duplicate visitor registrations for the same visitor on the same date should not be allowed
  const existingOnDate = await VisitPass.findOne({
    visitorPhone: visitorPhone.trim(),
    visitDate: normalizedVisitDate,
    status: { $ne: 'CANCELLED' },
  });

  if (existingOnDate) {
    const error = new Error(
      `A visitor registration already exists for phone ${visitorPhone} on date ${normalizedVisitDate} (Pass: ${existingOnDate.passId}). Duplicate registrations for the same date are prohibited (Rule 2).`
    );
    error.statusCode = 400;
    error.errorCode = 'RULE_2_DUPLICATE_REGISTRATION';
    throw error;
  }

  // Rule 5: An employee cannot have more than 3 pending visitor requests awaiting approval
  const pendingCount = await VisitPass.countDocuments({
    hostEmployeeId,
    status: 'PENDING_APPROVAL',
  });

  if (pendingCount >= 3) {
    const error = new Error(
      `The selected host employee currently has ${pendingCount} pending requests awaiting review. Employees cannot have more than 3 pending visitor requests awaiting approval (Rule 5). Please choose another host or request the employee to review pending items.`
    );
    error.statusCode = 400;
    error.errorCode = 'RULE_5_MAX_PENDING_EXCEEDED';
    throw error;
  }

  return { normalizedVisitDate };
};

/**
 * Validate Check-In rules (Rules 6, 7, 9)
 */
export const validateCheckIn = async (visitPass) => {
  if (!visitPass) {
    const error = new Error('Visit pass not found.');
    error.statusCode = 404;
    throw error;
  }

  // Rule 9: Rejected visitor requests cannot be checked in
  if (visitPass.status === 'REJECTED') {
    const error = new Error('Cannot check in a rejected visitor request (Rule 9).');
    error.statusCode = 400;
    error.errorCode = 'RULE_9_REJECTED_PASS';
    throw error;
  }

  // Rule 6: Visitors can only be checked in after approval
  if (visitPass.status !== 'APPROVED') {
    const error = new Error(
      `Visitors can only be checked in after host approval. Current status is '${visitPass.status}' (Rule 6).`
    );
    error.statusCode = 400;
    error.errorCode = 'RULE_6_NOT_APPROVED';
    throw error;
  }

  // Rule 7: A visitor who is already checked in cannot be checked in again until checked out
  const alreadyCheckedIn = await VisitPass.findOne({
    visitorPhone: visitPass.visitorPhone,
    status: 'CHECKED_IN',
    _id: { $ne: visitPass._id },
  });

  if (alreadyCheckedIn) {
    const error = new Error(
      `This visitor is currently checked in on pass ${alreadyCheckedIn.passId}. A visitor cannot be checked in again until checked out (Rule 7).`
    );
    error.statusCode = 400;
    error.errorCode = 'RULE_7_ALREADY_CHECKED_IN';
    throw error;
  }

  return true;
};

/**
 * Validate Check-Out rules (Rule 8)
 */
export const validateCheckOut = (visitPass, checkOutTime = new Date()) => {
  if (!visitPass) {
    const error = new Error('Visit pass not found.');
    error.statusCode = 404;
    throw error;
  }

  if (visitPass.status !== 'CHECKED_IN') {
    const error = new Error(
      `Only checked-in visitors can be checked out. Current status: ${visitPass.status}.`
    );
    error.statusCode = 400;
    throw error;
  }

  // Rule 8: Check-out time must always be later than check-in time
  const inTime = new Date(visitPass.checkInTime).getTime();
  const outTime = new Date(checkOutTime).getTime();

  if (outTime <= inTime) {
    const error = new Error(
      'Check-out time must always be later than check-in time (Rule 8).'
    );
    error.statusCode = 400;
    error.errorCode = 'RULE_8_INVALID_CHECKOUT_TIME';
    throw error;
  }

  return true;
};
