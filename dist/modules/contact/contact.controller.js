import { asyncHandler } from '../../utils/asyncHandler';
import { ApiError } from '../../utils/ApiError';
import { ApiResponse } from '../../utils/ApiResponse';
import { ContactMethod, OpeningDay, ContactPageConfig, ContactSubmission, } from './contact.model';
const PAGE_CONFIG_ID = 'contact-page-config';
const getOrCreatePageConfig = async () => {
    let config = await ContactPageConfig.findById(PAGE_CONFIG_ID);
    if (!config) {
        config = new ContactPageConfig({ _id: PAGE_CONFIG_ID });
        await config.save();
    }
    return config;
};
export const getContactPageData = asyncHandler(async (_req, res) => {
    const [pageConfig, methods, openingHours] = await Promise.all([
        getOrCreatePageConfig(),
        ContactMethod.find().sort({ display_order: 1 }),
        OpeningDay.find().sort({ display_order: 1 }),
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
        .json(new ApiResponse(200, pageData, 'Contact page data fetched successfully'));
});
export const submitContactForm = asyncHandler(async (req, res) => {
    const submission = await ContactSubmission.create(req.body);
    res
        .status(201)
        .json(new ApiResponse(201, submission, 'Contact form submitted successfully. We will get back to you soon!'));
});
export const getSubmissions = asyncHandler(async (_req, res) => {
    const submissions = await ContactSubmission.find().sort({ createdAt: -1, is_read: 1 });
    res
        .status(200)
        .json(new ApiResponse(200, submissions, 'Contact submissions fetched successfully'));
});
export const markSubmissionRead = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const submission = await ContactSubmission.findByIdAndUpdate(id, { is_read: true }, { new: true });
    if (!submission) {
        throw new ApiError(404, 'Submission not found');
    }
    res
        .status(200)
        .json(new ApiResponse(200, submission, 'Submission marked as read'));
});
export const deleteSubmission = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const submission = await ContactSubmission.findByIdAndDelete(id);
    if (!submission) {
        throw new ApiError(404, 'Submission not found');
    }
    res
        .status(200)
        .json(new ApiResponse(200, {}, 'Submission deleted successfully'));
});
const createGenericCrud = (Model, name) => ({
    getAll: asyncHandler(async (_req, res) => {
        const items = await Model.find().sort({ display_order: 1 });
        res.status(200).json(new ApiResponse(200, items, `${name} fetched successfully`));
    }),
    create: asyncHandler(async (req, res) => {
        const item = await Model.create(req.body);
        res.status(201).json(new ApiResponse(201, item, `${name} created successfully`));
    }),
    getById: asyncHandler(async (req, res) => {
        const item = await Model.findById(req.params.id);
        if (!item)
            throw new ApiError(404, `${name} not found`);
        res.status(200).json(new ApiResponse(200, item, `${name} fetched successfully`));
    }),
    update: asyncHandler(async (req, res) => {
        const item = await Model.findByIdAndUpdate(req.params.id, req.body, {
            new: true, runValidators: true,
        });
        if (!item)
            throw new ApiError(404, `${name} not found`);
        res.status(200).json(new ApiResponse(200, item, `${name} updated successfully`));
    }),
    delete: asyncHandler(async (req, res) => {
        const item = await Model.findByIdAndDelete(req.params.id);
        if (!item)
            throw new ApiError(404, `${name} not found`);
        res.status(200).json(new ApiResponse(200, {}, `${name} deleted successfully`));
    }),
});
const contactMethodsCRUD = createGenericCrud(ContactMethod, 'Contact Method');
const openingDaysCRUD = createGenericCrud(OpeningDay, 'Opening Day');
export const contactMethods = {
    ...contactMethodsCRUD,
    saveAll: asyncHandler(async (req, res) => {
        const rawMethods = Array.isArray(req.body) ? req.body : req.body.methods || [];
        await ContactMethod.deleteMany({});
        const itemsToInsert = rawMethods.map((m, idx) => ({
            icon: m.icon || 'phone',
            accent: m.accent || 'orange',
            title: m.title || 'Contact Method',
            value: m.value || '',
            helper: m.helper || '',
            href: m.href || '#',
            display_order: idx + 1,
        }));
        const created = await ContactMethod.insertMany(itemsToInsert);
        res.status(200).json(new ApiResponse(200, created, 'Contact methods saved successfully'));
    }),
};
export const openingDays = {
    ...openingDaysCRUD,
    saveAll: asyncHandler(async (req, res) => {
        const rawDays = Array.isArray(req.body) ? req.body : req.body.openingHours || [];
        await OpeningDay.deleteMany({});
        const itemsToInsert = rawDays.map((d, idx) => ({
            day: d.day || 'Monday',
            hours: d.hours || '',
            isClosed: Boolean(d.isClosed),
            display_order: idx + 1,
        }));
        const created = await OpeningDay.insertMany(itemsToInsert);
        res.status(200).json(new ApiResponse(200, created, 'Opening hours saved successfully'));
    }),
};
export const getPageConfig = asyncHandler(async (_req, res) => {
    const config = await getOrCreatePageConfig();
    res.status(200).json(new ApiResponse(200, config, 'Contact page config fetched'));
});
export const updatePageConfig = asyncHandler(async (req, res) => {
    let config = await ContactPageConfig.findById(PAGE_CONFIG_ID);
    if (!config) {
        config = new ContactPageConfig({ _id: PAGE_CONFIG_ID, ...req.body });
        await config.save();
    }
    else {
        Object.assign(config, req.body);
        await config.save();
    }
    res.status(200).json(new ApiResponse(200, config, 'Contact page config updated successfully'));
});
//# sourceMappingURL=contact.controller.js.map