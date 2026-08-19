"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteApplication = exports.updateApplicationStatus = exports.getAllApplications = exports.applyForJob = exports.deleteJob = exports.updateJob = exports.createJob = exports.getAllJobsAdmin = exports.getOpenJobs = void 0;
const asyncHandler_1 = require("../../utils/asyncHandler");
const ApiError_1 = require("../../utils/ApiError");
const ApiResponse_1 = require("../../utils/ApiResponse");
const careers_model_1 = require("./careers.model");
const upload_controller_1 = require("../upload/upload.controller");
const INITIAL_JOBS = [
    {
        title: 'Master Pitmaster (Grill Chef)',
        department: 'Kitchen & Grill',
        type: 'Full-time',
        location: 'DHA Phase 5, Lahore',
        description: 'Master the iron skewers over red-hot charcoal embers. Responsible for marinade consistency, fire temperature control, and delivering legendary smoky tikkas.',
        requirements: [
            '3+ years live charcoal grilling experience',
            'Knowledge of meat butchery & skewering',
            'High hygiene and fast kitchen pace',
        ],
        is_active: true,
        postedDate: '2026-08-15',
    },
    {
        title: 'Live Tandoor Specialist',
        department: 'Bakery & Tandoor',
        type: 'Full-time',
        location: 'DHA Phase 5, Lahore',
        description: 'Expertise in slapping garlic, roghani, and whole wheat naans into clay tandoors at high peak volumes.',
        requirements: [
            '2+ years high-volume tandoor operation',
            'Dough fermentation and temperature mastery',
        ],
        is_active: true,
        postedDate: '2026-08-14',
    },
    {
        title: 'Catering & Event Coordinator',
        department: 'Events & Operations',
        type: 'Full-time',
        location: 'All Branches / On-site',
        description: 'Coordinate corporate feasts, wedding live stations, and outdoor gala catering from booking to live fire execution.',
        requirements: [
            'Strong client communication and timeline planning',
            'Experience in hospitality or outdoor catering',
        ],
        is_active: true,
        postedDate: '2026-08-10',
    },
    {
        title: 'Guest Experience & Front of House Captain',
        department: 'Service & Hospitality',
        type: 'Shift',
        location: 'Gulberg Branch, Lahore',
        description: 'Warmly welcome guests, manage seating and digital queue management, and ensure the authentic Tikkay Shikkay hospitality.',
        requirements: [
            'Polite, energetic personality',
            'Fluent in Urdu & English communication',
        ],
        is_active: true,
        postedDate: '2026-08-08',
    },
];
async function ensureSeedJobs() {
    const count = await careers_model_1.JobRole.countDocuments();
    if (count === 0) {
        await careers_model_1.JobRole.insertMany(INITIAL_JOBS);
    }
}
exports.getOpenJobs = (0, asyncHandler_1.asyncHandler)(async (_req, res) => {
    await ensureSeedJobs();
    const jobs = await careers_model_1.JobRole.find({ is_active: true }).sort({ createdAt: -1 });
    res.status(200).json(new ApiResponse_1.ApiResponse(200, jobs, 'Open jobs fetched successfully'));
});
exports.getAllJobsAdmin = (0, asyncHandler_1.asyncHandler)(async (_req, res) => {
    await ensureSeedJobs();
    const jobs = await careers_model_1.JobRole.find().sort({ createdAt: -1 });
    res.status(200).json(new ApiResponse_1.ApiResponse(200, jobs, 'All jobs fetched successfully'));
});
exports.createJob = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    const { title, department, type, location, description, requirements, is_active } = req.body;
    if (!title || !department || !description) {
        throw new ApiError_1.ApiError(400, 'Title, department, and description are required');
    }
    const job = await careers_model_1.JobRole.create({
        title,
        department,
        type: type || 'Full-time',
        location: location || 'DHA Phase 5, Lahore',
        description,
        requirements: Array.isArray(requirements) ? requirements : [],
        is_active: is_active !== undefined ? Boolean(is_active) : true,
        postedDate: new Date().toISOString().slice(0, 10),
    });
    res.status(201).json(new ApiResponse_1.ApiResponse(201, job, 'Job role created successfully'));
});
exports.updateJob = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    const { id } = req.params;
    const updates = req.body;
    const job = await careers_model_1.JobRole.findByIdAndUpdate(id, updates, { new: true, runValidators: true });
    if (!job) {
        throw new ApiError_1.ApiError(404, 'Job role not found');
    }
    res.status(200).json(new ApiResponse_1.ApiResponse(200, job, 'Job role updated successfully'));
});
exports.deleteJob = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    const { id } = req.params;
    // 1. Find all associated applications and hard-delete their Cloudinary resumes
    const applications = await careers_model_1.JobApplication.find({ job_id: id });
    for (const app of applications) {
        if (app.resume_public_id) {
            await (0, upload_controller_1.destroyCloudinaryAsset)(app.resume_public_id);
        }
    }
    // 2. Delete all applications for this job from database
    await careers_model_1.JobApplication.deleteMany({ job_id: id });
    // 3. Delete the job role
    const job = await careers_model_1.JobRole.findByIdAndDelete(id);
    if (!job) {
        throw new ApiError_1.ApiError(404, 'Job role not found');
    }
    res.status(200).json(new ApiResponse_1.ApiResponse(200, null, 'Job role and all associated applications permanently deleted'));
});
exports.applyForJob = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    if (!req.file) {
        throw new ApiError_1.ApiError(400, 'Resume file is required (PDF, DOCX, or JPG up to 25MB)');
    }
    const { job_id, job_title, full_name, email, phone, experience_years, cover_letter } = req.body;
    if (!job_id || !full_name || !email || !phone) {
        throw new ApiError_1.ApiError(400, 'Missing required applicant personal details');
    }
    const file = req.file;
    const application = await careers_model_1.JobApplication.create({
        job_id,
        job_title: job_title || 'General Applicant',
        full_name,
        email,
        phone,
        experience_years: Number(experience_years) || 0,
        cover_letter: cover_letter || '',
        resume_url: file.path,
        resume_public_id: file.filename,
        resume_file_name: file.originalname,
        resume_file_size: file.size,
        status: 'applied',
    });
    res.status(201).json(new ApiResponse_1.ApiResponse(201, application, 'Application submitted successfully'));
});
exports.getAllApplications = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    const { job_id, status } = req.query;
    const filter = {};
    if (job_id && typeof job_id === 'string' && job_id !== 'all') {
        filter.job_id = job_id;
    }
    if (status && typeof status === 'string' && status !== 'all') {
        filter.status = status;
    }
    const applications = await careers_model_1.JobApplication.find(filter).sort({ createdAt: -1 });
    res.status(200).json(new ApiResponse_1.ApiResponse(200, applications, 'Applications fetched successfully'));
});
exports.updateApplicationStatus = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    const { id } = req.params;
    const { status, notes } = req.body;
    const validStatuses = ['applied', 'reviewed', 'interview', 'hired', 'rejected'];
    if (!validStatuses.includes(status)) {
        throw new ApiError_1.ApiError(400, 'Invalid application status');
    }
    const app = await careers_model_1.JobApplication.findById(id);
    if (!app) {
        throw new ApiError_1.ApiError(404, 'Application not found');
    }
    app.status = status;
    if (notes !== undefined)
        app.notes = notes;
    await app.save();
    res.status(200).json(new ApiResponse_1.ApiResponse(200, app, 'Application status updated successfully'));
});
exports.deleteApplication = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    const { id } = req.params;
    const app = await careers_model_1.JobApplication.findById(id);
    if (!app) {
        throw new ApiError_1.ApiError(404, 'Application not found');
    }
    // Hard delete from Cloudinary
    if (app.resume_public_id) {
        await (0, upload_controller_1.destroyCloudinaryAsset)(app.resume_public_id);
    }
    // Hard delete from MongoDB
    await careers_model_1.JobApplication.findByIdAndDelete(id);
    res.status(200).json(new ApiResponse_1.ApiResponse(200, null, 'Application and resume hard deleted permanently'));
});
//# sourceMappingURL=careers.controller.js.map