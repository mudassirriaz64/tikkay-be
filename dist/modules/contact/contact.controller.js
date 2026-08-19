"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updatePageConfig = exports.getPageConfig = exports.openingDays = exports.contactMethods = exports.deleteSubmission = exports.markSubmissionRead = exports.getSubmissions = exports.submitContactForm = exports.getContactPageData = void 0;
const asyncHandler_1 = require("../../utils/asyncHandler");
const ApiError_1 = require("../../utils/ApiError");
const ApiResponse_1 = require("../../utils/ApiResponse");
const contact_model_1 = require("./contact.model");
const PAGE_CONFIG_ID = 'contact-page-config';
const getOrCreatePageConfig = async () => {
    let config = await contact_model_1.ContactPageConfig.findById(PAGE_CONFIG_ID);
    if (!config) {
        config = new contact_model_1.ContactPageConfig({ _id: PAGE_CONFIG_ID });
        await config.save();
    }
    return config;
};
exports.getContactPageData = (0, asyncHandler_1.asyncHandler)(async (_req, res) => {
    const [pageConfig, methods, openingHours] = await Promise.all([
        getOrCreatePageConfig(),
        contact_model_1.ContactMethod.find().sort({ display_order: 1 }),
        contact_model_1.OpeningDay.find().sort({ display_order: 1 }),
    ]);
    const pageData = {
        hero: pageConfig.hero,
        methods,
        openingHours,
        map: pageConfig.map,
        form: pageConfig.form,
        catering: pageConfig.catering,
        franchise: pageConfig.franchise,
    };
    res
        .status(200)
        .json(new ApiResponse_1.ApiResponse(200, pageData, 'Contact page data fetched successfully'));
});
exports.submitContactForm = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    const submission = await contact_model_1.ContactSubmission.create(req.body);
    res
        .status(201)
        .json(new ApiResponse_1.ApiResponse(201, submission, 'Contact form submitted successfully. We will get back to you soon!'));
});
exports.getSubmissions = (0, asyncHandler_1.asyncHandler)(async (_req, res) => {
    const submissions = await contact_model_1.ContactSubmission.find().sort({ createdAt: -1, is_read: 1 });
    res
        .status(200)
        .json(new ApiResponse_1.ApiResponse(200, submissions, 'Contact submissions fetched successfully'));
});
exports.markSubmissionRead = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    const { id } = req.params;
    const submission = await contact_model_1.ContactSubmission.findByIdAndUpdate(id, { is_read: true }, { new: true });
    if (!submission) {
        throw new ApiError_1.ApiError(404, 'Submission not found');
    }
    res
        .status(200)
        .json(new ApiResponse_1.ApiResponse(200, submission, 'Submission marked as read'));
});
exports.deleteSubmission = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    const { id } = req.params;
    const submission = await contact_model_1.ContactSubmission.findByIdAndDelete(id);
    if (!submission) {
        throw new ApiError_1.ApiError(404, 'Submission not found');
    }
    res
        .status(200)
        .json(new ApiResponse_1.ApiResponse(200, {}, 'Submission deleted successfully'));
});
const createGenericCrud = (Model, name) => ({
    getAll: (0, asyncHandler_1.asyncHandler)(async (_req, res) => {
        const items = await Model.find().sort({ display_order: 1 });
        res.status(200).json(new ApiResponse_1.ApiResponse(200, items, `${name} fetched successfully`));
    }),
    create: (0, asyncHandler_1.asyncHandler)(async (req, res) => {
        const item = await Model.create(req.body);
        res.status(201).json(new ApiResponse_1.ApiResponse(201, item, `${name} created successfully`));
    }),
    getById: (0, asyncHandler_1.asyncHandler)(async (req, res) => {
        const item = await Model.findById(req.params.id);
        if (!item)
            throw new ApiError_1.ApiError(404, `${name} not found`);
        res.status(200).json(new ApiResponse_1.ApiResponse(200, item, `${name} fetched successfully`));
    }),
    update: (0, asyncHandler_1.asyncHandler)(async (req, res) => {
        const item = await Model.findByIdAndUpdate(req.params.id, req.body, {
            new: true, runValidators: true,
        });
        if (!item)
            throw new ApiError_1.ApiError(404, `${name} not found`);
        res.status(200).json(new ApiResponse_1.ApiResponse(200, item, `${name} updated successfully`));
    }),
    delete: (0, asyncHandler_1.asyncHandler)(async (req, res) => {
        const item = await Model.findByIdAndDelete(req.params.id);
        if (!item)
            throw new ApiError_1.ApiError(404, `${name} not found`);
        res.status(200).json(new ApiResponse_1.ApiResponse(200, {}, `${name} deleted successfully`));
    }),
});
const contactMethodsCRUD = createGenericCrud(contact_model_1.ContactMethod, 'Contact Method');
const openingDaysCRUD = createGenericCrud(contact_model_1.OpeningDay, 'Opening Day');
exports.contactMethods = {
    ...contactMethodsCRUD,
    saveAll: (0, asyncHandler_1.asyncHandler)(async (req, res) => {
        const rawMethods = Array.isArray(req.body) ? req.body : req.body.methods || [];
        await contact_model_1.ContactMethod.deleteMany({});
        const itemsToInsert = rawMethods.map((m, idx) => ({
            icon: m.icon || 'phone',
            accent: m.accent || 'orange',
            title: m.title || 'Contact Method',
            value: m.value || '',
            helper: m.helper || '',
            href: m.href || '#',
            display_order: idx + 1,
        }));
        const created = await contact_model_1.ContactMethod.insertMany(itemsToInsert);
        res.status(200).json(new ApiResponse_1.ApiResponse(200, created, 'Contact methods saved successfully'));
    }),
};
exports.openingDays = {
    ...openingDaysCRUD,
    saveAll: (0, asyncHandler_1.asyncHandler)(async (req, res) => {
        const rawDays = Array.isArray(req.body) ? req.body : req.body.openingHours || [];
        await contact_model_1.OpeningDay.deleteMany({});
        const itemsToInsert = rawDays.map((d, idx) => ({
            day: d.day || 'Monday',
            hours: d.hours || '',
            isClosed: Boolean(d.isClosed),
            display_order: idx + 1,
        }));
        const created = await contact_model_1.OpeningDay.insertMany(itemsToInsert);
        res.status(200).json(new ApiResponse_1.ApiResponse(200, created, 'Opening hours saved successfully'));
    }),
};
exports.getPageConfig = (0, asyncHandler_1.asyncHandler)(async (_req, res) => {
    const config = await getOrCreatePageConfig();
    res.status(200).json(new ApiResponse_1.ApiResponse(200, config, 'Contact page config fetched'));
});
exports.updatePageConfig = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    let config = await contact_model_1.ContactPageConfig.findById(PAGE_CONFIG_ID);
    if (!config) {
        config = new contact_model_1.ContactPageConfig({ _id: PAGE_CONFIG_ID, ...req.body });
        await config.save();
    }
    else {
        Object.assign(config, req.body);
        await config.save();
    }
    res.status(200).json(new ApiResponse_1.ApiResponse(200, config, 'Contact page config updated successfully'));
});
//# sourceMappingURL=contact.controller.js.map