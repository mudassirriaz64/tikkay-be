import { Document, Types } from 'mongoose';
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
export declare const JobRole: import("mongoose").Model<IJobRole, {}, {}, {}, Document<unknown, {}, IJobRole, {}, {}> & IJobRole & Required<{
    _id: Types.ObjectId;
}> & {
    __v: number;
}, any>;
export declare const JobApplication: import("mongoose").Model<IJobApplication, {}, {}, {}, Document<unknown, {}, IJobApplication, {}, {}> & IJobApplication & Required<{
    _id: Types.ObjectId;
}> & {
    __v: number;
}, any>;
//# sourceMappingURL=careers.model.d.ts.map