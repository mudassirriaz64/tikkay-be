"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.resetPassword = exports.forgotPassword = exports.getCurrentUser = exports.changeCurrentPassword = exports.refreshAccessToken = exports.logout = exports.login = exports.register = void 0;
const asyncHandler_1 = require("../../utils/asyncHandler");
const ApiError_1 = require("../../utils/ApiError");
const ApiResponse_1 = require("../../utils/ApiResponse");
const auth_model_1 = require("./auth.model");
const config_1 = require("../../config");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const cookieOptions = {
    httpOnly: true,
    secure: config_1.config.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: config_1.config.JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000,
};
const generateAccessAndRefreshTokens = async (userId) => {
    try {
        const user = await auth_model_1.User.findById(userId);
        if (!user)
            throw new ApiError_1.ApiError(404, 'User not found');
        const accessToken = user.generateAccessToken();
        const refreshToken = user.generateRefreshToken();
        user.refreshToken = refreshToken;
        await user.save({ validateBeforeSave: false });
        return { accessToken, refreshToken };
    }
    catch (error) {
        throw new ApiError_1.ApiError(500, 'Something went wrong while generating tokens');
    }
};
exports.register = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    const { name, email, phone, address, password, role } = req.body;
    const existedUser = await auth_model_1.User.findOne({ email });
    if (existedUser) {
        throw new ApiError_1.ApiError(409, 'User with this email already exists');
    }
    const user = await auth_model_1.User.create({
        name,
        email: email.toLowerCase(),
        phone: phone || '',
        address: address || '',
        password,
        role: role || 'user',
    });
    const createdUser = await auth_model_1.User.findById(user._id);
    if (!createdUser) {
        throw new ApiError_1.ApiError(500, 'Something went wrong while registering the user');
    }
    const { accessToken, refreshToken } = await generateAccessAndRefreshTokens(user._id.toString());
    const loggedInUser = await auth_model_1.User.findById(user._id);
    res
        .status(201)
        .cookie('accessToken', accessToken, cookieOptions)
        .cookie('refreshToken', refreshToken, cookieOptions)
        .json(new ApiResponse_1.ApiResponse(201, {
        user: loggedInUser,
        accessToken,
        refreshToken,
    }, 'User registered successfully'));
});
exports.login = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    const { email, password, rememberMe } = req.body;
    const user = await auth_model_1.User.findOne({ email: email.toLowerCase() }).select('+password');
    if (!user) {
        throw new ApiError_1.ApiError(401, 'Invalid email or password');
    }
    const isPasswordValid = await user.isPasswordCorrect(password);
    if (!isPasswordValid) {
        throw new ApiError_1.ApiError(401, 'Invalid email or password');
    }
    const { accessToken, refreshToken } = await generateAccessAndRefreshTokens(user._id.toString());
    const loggedInUser = await auth_model_1.User.findById(user._id);
    // Set long-lived cookie if rememberMe is true (30 days), otherwise session cookie
    const activeCookieOptions = {
        ...cookieOptions,
        maxAge: rememberMe !== false ? config_1.config.JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000 : undefined,
    };
    res
        .status(200)
        .cookie('accessToken', accessToken, activeCookieOptions)
        .cookie('refreshToken', refreshToken, activeCookieOptions)
        .json(new ApiResponse_1.ApiResponse(200, {
        user: loggedInUser,
        accessToken,
        refreshToken,
        rememberMe: Boolean(rememberMe),
    }, 'User logged in successfully'));
});
exports.logout = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    await auth_model_1.User.findByIdAndUpdate(req.user._id, { $unset: { refreshToken: 1 } }, { new: true });
    res
        .status(200)
        .clearCookie('accessToken', cookieOptions)
        .clearCookie('refreshToken', cookieOptions)
        .json(new ApiResponse_1.ApiResponse(200, {}, 'User logged out successfully'));
});
exports.refreshAccessToken = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    const incomingRefreshToken = req.cookies.refreshToken || req.body.refreshToken;
    if (!incomingRefreshToken) {
        throw new ApiError_1.ApiError(401, 'Unauthorized request');
    }
    try {
        const decodedToken = jsonwebtoken_1.default.verify(incomingRefreshToken, config_1.config.JWT_SECRET);
        const user = await auth_model_1.User.findById(decodedToken?._id);
        if (!user) {
            throw new ApiError_1.ApiError(401, 'Invalid refresh token');
        }
        if (incomingRefreshToken !== user.refreshToken) {
            throw new ApiError_1.ApiError(401, 'Refresh token is expired or used');
        }
        const { accessToken, refreshToken: newRefreshToken } = await generateAccessAndRefreshTokens(user._id.toString());
        res
            .status(200)
            .cookie('accessToken', accessToken, cookieOptions)
            .cookie('refreshToken', newRefreshToken, cookieOptions)
            .json(new ApiResponse_1.ApiResponse(200, { accessToken, refreshToken: newRefreshToken }, 'Access token refreshed'));
    }
    catch (error) {
        throw new ApiError_1.ApiError(401, error.message || 'Invalid refresh token');
    }
});
exports.changeCurrentPassword = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    const { oldPassword, newPassword } = req.body;
    const user = await auth_model_1.User.findById(req.user._id).select('+password');
    if (!user) {
        throw new ApiError_1.ApiError(404, 'User not found');
    }
    const isPasswordCorrect = await user.isPasswordCorrect(oldPassword);
    if (!isPasswordCorrect) {
        throw new ApiError_1.ApiError(400, 'Invalid old password');
    }
    user.password = newPassword;
    await user.save({ validateBeforeSave: false });
    res
        .status(200)
        .json(new ApiResponse_1.ApiResponse(200, {}, 'Password changed successfully'));
});
exports.getCurrentUser = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    const user = await auth_model_1.User.findById(req.user._id);
    if (!user) {
        throw new ApiError_1.ApiError(404, 'User not found');
    }
    res
        .status(200)
        .json(new ApiResponse_1.ApiResponse(200, user, 'Current user fetched successfully'));
});
exports.forgotPassword = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    const { email } = req.body;
    if (!email) {
        throw new ApiError_1.ApiError(400, 'Email address is required');
    }
    const user = await auth_model_1.User.findOne({ email: email.toLowerCase().trim() });
    if (!user) {
        throw new ApiError_1.ApiError(404, 'No account found with this email address. Please check and try again.');
    }
    // Generate 6-digit numeric OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const expires = new Date(Date.now() + 15 * 60 * 1000); // 15 minutes validity
    user.resetPasswordOTP = otp;
    user.resetPasswordExpires = expires;
    await user.save({ validateBeforeSave: false });
    // Print OTP clearly in terminal / server console for instant testing & development
    console.log('\n\x1b[33m╔══════════════════════════════════════════════════════════════╗\x1b[0m');
    console.log(`\x1b[33m║ 🔑 FORGOT PASSWORD OTP FOR: \x1b[36m${user.email.padEnd(31)}\x1b[33m ║\x1b[0m`);
    console.log(`\x1b[33m║ 👉 6-DIGIT OTP CODE: \x1b[32m\x1b[1m${otp}\x1b[0m\x1b[33m (Expires in 15 mins)         ║\x1b[0m`);
    console.log('\x1b[33m╚══════════════════════════════════════════════════════════════╝\x1b[0m\n');
    // In production with Resend API key configured:
    if (config_1.config.RESEND_API_KEY) {
        try {
            // Resend API invocation placeholder
            console.log(`[Resend Email] Sending reset OTP ${otp} to ${user.email} from ${config_1.config.RESEND_FROM_EMAIL}`);
        }
        catch (emailErr) {
            console.error('[Resend Email Error]:', emailErr);
        }
    }
    return res.status(200).json(new ApiResponse_1.ApiResponse(200, { email: user.email }, 'If an account exists with that email, a 6-digit password reset OTP has been sent.'));
});
exports.resetPassword = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    const { email, otp, newPassword } = req.body;
    if (!email || !otp || !newPassword) {
        throw new ApiError_1.ApiError(400, 'Email, OTP, and new password are required');
    }
    if (newPassword.length < 6) {
        throw new ApiError_1.ApiError(400, 'Password must be at least 6 characters');
    }
    const user = await auth_model_1.User.findOne({
        email: email.toLowerCase(),
        resetPasswordOTP: otp,
        resetPasswordExpires: { $gt: new Date() },
    }).select('+password');
    if (!user) {
        throw new ApiError_1.ApiError(400, 'Invalid or expired OTP code');
    }
    user.password = newPassword;
    user.resetPasswordOTP = undefined;
    user.resetPasswordExpires = undefined;
    await user.save({ validateBeforeSave: false });
    res.status(200).json(new ApiResponse_1.ApiResponse(200, {}, 'Password reset successfully. You can now sign in with your new password.'));
});
//# sourceMappingURL=auth.controller.js.map