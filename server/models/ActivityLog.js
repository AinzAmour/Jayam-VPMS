import mongoose from 'mongoose';

export const ACTIVITY_ACTIONS = [
  'CREATED',
  'APPROVED',
  'REJECTED',
  'CHECKED_IN',
  'CHECKED_OUT',
  'CANCELLED',
];

const activityLogSchema = new mongoose.Schema(
  {
    visitPassId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'VisitPass',
      required: true,
    },
    passId: {
      type: String,
      required: true,
    },
    action: {
      type: String,
      enum: ACTIVITY_ACTIONS,
      required: true,
    },
    performedByUserId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    performedByName: {
      type: String,
      required: true,
    },
    performedByRole: {
      type: String,
      required: true,
      enum: ['ADMINISTRATOR', 'RECEPTIONIST', 'EMPLOYEE'],
    },
    remarks: {
      type: String,
      default: null,
    },
    timestamp: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: false,
  }
);

activityLogSchema.index({ visitPassId: 1, timestamp: -1 });
activityLogSchema.index({ action: 1, timestamp: -1 });
activityLogSchema.index({ timestamp: -1 });

export const ActivityLog = mongoose.model('ActivityLog', activityLogSchema);
export default ActivityLog;
