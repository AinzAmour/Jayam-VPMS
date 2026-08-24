import mongoose from 'mongoose';

export const VISIT_STATUSES = [
  'PENDING_APPROVAL',
  'APPROVED',
  'REJECTED',
  'CHECKED_IN',
  'CHECKED_OUT',
  'CANCELLED',
];

const visitPassSchema = new mongoose.Schema(
  {
    passId: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    visitorName: {
      type: String,
      required: [true, 'Visitor name is required'],
      trim: true,
    },
    visitorPhone: {
      type: String,
      required: [true, 'Visitor phone number is required'],
      trim: true,
    },
    visitorEmail: {
      type: String,
      trim: true,
      lowercase: true,
      default: '',
    },
    visitorCompany: {
      type: String,
      required: [true, 'Visitor company/organization is required'],
      trim: true,
    },
    hostEmployeeId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Employee',
      required: [true, 'Host employee is required'],
    },
    visitDate: {
      type: String, // Store normalized YYYY-MM-DD string for strict date comparisons
      required: [true, 'Visit date is required'],
    },
    expectedArrivalTime: {
      type: String, // Format: HH:mm (24-hour)
      required: [true, 'Expected arrival time is required'],
    },
    purpose: {
      type: String,
      required: [true, 'Visit purpose is required'],
      minlength: [3, 'Purpose must be at least 3 characters'],
      trim: true,
    },
    status: {
      type: String,
      enum: VISIT_STATUSES,
      default: 'PENDING_APPROVAL',
    },
    checkInTime: {
      type: Date,
      default: null,
    },
    checkOutTime: {
      type: Date,
      default: null,
    },
    hostRemarks: {
      type: String,
      default: null,
      trim: true,
    },
    cancellationReason: {
      type: String,
      default: null,
      trim: true,
    },
    createdByUserId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

// Indexes
visitPassSchema.index({ visitorPhone: 1, visitDate: 1 });
visitPassSchema.index({ visitorPhone: 1, status: 1 });
visitPassSchema.index({ hostEmployeeId: 1, status: 1 });
visitPassSchema.index({ visitDate: 1, status: 1 });
visitPassSchema.index({ visitorName: 'text', visitorPhone: 'text', visitorCompany: 'text' });

export const VisitPass = mongoose.model('VisitPass', visitPassSchema);
export default VisitPass;
