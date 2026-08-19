import { Schema, model, Document, Types } from 'mongoose';

export type JobType = 'Full-time' | 'Part-time' | 'Shift' | 'Apprenticeship';
export type ApplicationStatus = 'applied' | 'reviewed' | 'interview' | 'hired' | 'rejected';

export interface IJobRole extends Document {
  title: string;
  department: string;
  type: JobType;
  location: string;
  description: string;
  requirements?: string[];
  is_active: boolean;
  postedDate: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface IJobApplication extends Document {
  job_id: Types.ObjectId;
  job_title: string;
  full_name: string;
  email: string;
  phone: string;
  experience_years: number;
  cover_letter?: string;
  resume_url: string;
  resume_public_id: string;
  resume_file_name: string;
  resume_file_size: number;
  status: ApplicationStatus;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

const jobRoleSchema = new Schema<IJobRole>(
  {
    title: { type: String, required: true, trim: true },
    department: { type: String, required: true, trim: true },
    type: { type: String, required: true, default: 'Full-time' },
    location: { type: String, required: true, default: 'DHA Phase 5, Lahore' },
    description: { type: String, required: true },
    requirements: [{ type: String }],
    is_active: { type: Boolean, default: true, index: true },
    postedDate: { type: String, required: true },
  },
  { timestamps: true }
);

const jobApplicationSchema = new Schema<IJobApplication>(
  {
    job_id: { type: Schema.Types.ObjectId, ref: 'JobRole', required: true, index: true },
    job_title: { type: String, required: true },
    full_name: { type: String, required: true, trim: true },
    email: { type: String, required: true, lowercase: true, trim: true },
    phone: { type: String, required: true, trim: true },
    experience_years: { type: Number, required: true, min: 0 },
    cover_letter: { type: String, default: '' },
    resume_url: { type: String, required: true },
    resume_public_id: { type: String, required: true },
    resume_file_name: { type: String, required: true },
    resume_file_size: { type: Number, required: true },
    status: {
      type: String,
      enum: ['applied', 'reviewed', 'interview', 'hired', 'rejected'],
      default: 'applied',
      index: true,
    },
    notes: { type: String, default: '' },
  },
  { timestamps: true }
);

jobApplicationSchema.index({ createdAt: -1 });

export const JobRole = model<IJobRole>('JobRole', jobRoleSchema);
export const JobApplication = model<IJobApplication>('JobApplication', jobApplicationSchema);
