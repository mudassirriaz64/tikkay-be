"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.User = void 0;
const mongoose_1 = require("mongoose");
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const config_1 = require("../../config");
const config_2 = require("../../config");
const userSchema = new mongoose_1.Schema({
    name: {
        type: String,
        required: [true, 'Name is required'],
        trim: true,
        minlength: [2, 'Name must be at least 2 characters'],
        maxlength: [100, 'Name cannot exceed 100 characters'],
    },
    email: {
        type: String,
        required: [true, 'Email is required'],
        unique: true,
        lowercase: true,
        trim: true,
        match: [/^[^\s@]+@[^\s@]+\.[^\s@]+$/, 'Please provide a valid email'],
    },
    phone: {
        type: String,
        trim: true,
        default: '',
    },
    address: {
        type: String,
        trim: true,
        default: '',
    },
    password: {
        type: String,
        required: [true, 'Password is required'],
        minlength: [6, 'Password must be at least 6 characters'],
        select: false,
    },
    role: {
        type: String,
        enum: [config_2.ROLES.USER, config_2.ROLES.ADMIN],
        default: config_2.ROLES.USER,
    },
    refreshToken: {
        type: String,
        select: false,
    },
    memberSince: {
        type: String,
        default: () => new Date().toISOString().split('T')[0],
    },
    favorites: {
        type: [mongoose_1.Schema.Types.ObjectId],
        ref: 'MenuItem',
        default: [],
    },
    is_loyalty_member: {
        type: Boolean,
        default: false,
        index: true,
    },
    loyalty_joined_at: {
        type: String,
        default: undefined,
    },
    loyalty_points: {
        type: Number,
        default: 0,
        min: 0,
    },
    birthday: {
        type: String,
        trim: true,
        default: '',
    },
    whatsapp_opt_in: {
        type: Boolean,
        default: false,
    },
}, {
    timestamps: true,
    toJSON: {
        transform: function (_doc, ret) {
            delete ret.password;
            delete ret.refreshToken;
            delete ret.__v;
            return ret;
        },
    },
});
userSchema.pre('save', async function (next) {
    if (!this.isModified('password'))
        return next();
    this.password = await bcryptjs_1.default.hash(this.password, 12);
    next();
});
userSchema.methods.isPasswordCorrect = async function (password) {
    return await bcryptjs_1.default.compare(password, this.password);
};
userSchema.methods.generateAccessToken = function () {
    return jsonwebtoken_1.default.sign({
        _id: this._id,
        email: this.email,
        name: this.name,
        role: this.role,
    }, config_1.config.JWT_SECRET, {
        expiresIn: config_1.config.JWT_EXPIRES_IN,
    });
};
userSchema.methods.generateRefreshToken = function () {
    return jsonwebtoken_1.default.sign({
        _id: this._id,
    }, config_1.config.JWT_SECRET, {
        expiresIn: '10d',
    });
};
exports.User = (0, mongoose_1.model)('User', userSchema);
//# sourceMappingURL=auth.model.js.map