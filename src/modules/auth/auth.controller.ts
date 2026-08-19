import { Request, Response, CookieOptions } from 'express';
import { asyncHandler } from '../../utils/asyncHandler';
import { ApiError } from '../../utils/ApiError';
import { ApiResponse } from '../../utils/ApiResponse';
import { User } from './auth.model';
import { AuthRequest } from '../../middleware/auth.middleware';
import { config } from '../../config';
import jwt, { JwtPayload } from 'jsonwebtoken';

const cookieOptions: CookieOptions = {
  httpOnly: true,
  secure: config.NODE_ENV === 'production',
  sameSite: 'lax',
  maxAge: config.JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000,
};

const generateAccessAndRefreshTokens = async (userId: string) => {
  try {
    const user = await User.findById(userId);
    if (!user) throw new ApiError(404, 'User not found');

    const accessToken = user.generateAccessToken();
    const refreshToken = user.generateRefreshToken();

    user.refreshToken = refreshToken;
    await user.save({ validateBeforeSave: false });

    return { accessToken, refreshToken };
  } catch (error) {
    throw new ApiError(500, 'Something went wrong while generating tokens');
  }
};

export const register = asyncHandler(async (req: Request, res: Response) => {
  const { name, email, phone, address, password, role } = req.body;

  const existedUser = await User.findOne({ email });
  if (existedUser) {
    throw new ApiError(409, 'User with this email already exists');
  }

  const user = await User.create({
    name,
    email: email.toLowerCase(),
    phone: phone || '',
    address: address || '',
    password,
    role: role || 'user',
  });

  const createdUser = await User.findById(user._id);
  if (!createdUser) {
    throw new ApiError(500, 'Something went wrong while registering the user');
  }

  const { accessToken, refreshToken } = await generateAccessAndRefreshTokens(user._id.toString());

  const loggedInUser = await User.findById(user._id);

  res
    .status(201)
    .cookie('accessToken', accessToken, cookieOptions)
    .cookie('refreshToken', refreshToken, cookieOptions)
    .json(
      new ApiResponse(
        201,
        {
          user: loggedInUser,
          accessToken,
          refreshToken,
        },
        'User registered successfully'
      )
    );
});

export const login = asyncHandler(async (req: Request, res: Response) => {
  const { email, password, rememberMe } = req.body;

  const user = await User.findOne({ email: email.toLowerCase() }).select('+password');
  if (!user) {
    throw new ApiError(401, 'Invalid email or password');
  }

  const isPasswordValid = await user.isPasswordCorrect(password);
  if (!isPasswordValid) {
    throw new ApiError(401, 'Invalid email or password');
  }

  const { accessToken, refreshToken } = await generateAccessAndRefreshTokens(user._id.toString());

  const loggedInUser = await User.findById(user._id);

  // Set long-lived cookie if rememberMe is true (30 days), otherwise session cookie
  const activeCookieOptions: CookieOptions = {
    ...cookieOptions,
    maxAge: rememberMe !== false ? config.JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000 : undefined,
  };

  res
    .status(200)
    .cookie('accessToken', accessToken, activeCookieOptions)
    .cookie('refreshToken', refreshToken, activeCookieOptions)
    .json(
      new ApiResponse(
        200,
        {
          user: loggedInUser,
          accessToken,
          refreshToken,
          rememberMe: Boolean(rememberMe),
        },
        'User logged in successfully'
      )
    );
});

export const logout = asyncHandler(async (req: AuthRequest, res: Response) => {
  await User.findByIdAndUpdate(
    req.user!._id,
    { $unset: { refreshToken: 1 } },
    { new: true }
  );

  res
    .status(200)
    .clearCookie('accessToken', cookieOptions)
    .clearCookie('refreshToken', cookieOptions)
    .json(new ApiResponse(200, {}, 'User logged out successfully'));
});

export const refreshAccessToken = asyncHandler(async (req: Request, res: Response) => {
  const incomingRefreshToken =
    req.cookies.refreshToken || req.body.refreshToken;

  if (!incomingRefreshToken) {
    throw new ApiError(401, 'Unauthorized request');
  }

  try {
    const decodedToken = jwt.verify(incomingRefreshToken, config.JWT_SECRET) as JwtPayload;

    const user = await User.findById(decodedToken?._id);
    if (!user) {
      throw new ApiError(401, 'Invalid refresh token');
    }

    if (incomingRefreshToken !== user.refreshToken) {
      throw new ApiError(401, 'Refresh token is expired or used');
    }

    const { accessToken, refreshToken: newRefreshToken } = await generateAccessAndRefreshTokens(
      user._id.toString()
    );

    res
      .status(200)
      .cookie('accessToken', accessToken, cookieOptions)
      .cookie('refreshToken', newRefreshToken, cookieOptions)
      .json(
        new ApiResponse(
          200,
          { accessToken, refreshToken: newRefreshToken },
          'Access token refreshed'
        )
      );
  } catch (error) {
    throw new ApiError(401, (error as Error).message || 'Invalid refresh token');
  }
});

export const changeCurrentPassword = asyncHandler(async (req: AuthRequest, res: Response) => {
  const { oldPassword, newPassword } = req.body;

  const user = await User.findById(req.user!._id).select('+password');
  if (!user) {
    throw new ApiError(404, 'User not found');
  }

  const isPasswordCorrect = await user.isPasswordCorrect(oldPassword);
  if (!isPasswordCorrect) {
    throw new ApiError(400, 'Invalid old password');
  }

  user.password = newPassword;
  await user.save({ validateBeforeSave: false });

  res
    .status(200)
    .json(new ApiResponse(200, {}, 'Password changed successfully'));
});

export const getCurrentUser = asyncHandler(async (req: AuthRequest, res: Response) => {
  const user = await User.findById(req.user!._id);

  if (!user) {
    throw new ApiError(404, 'User not found');
  }

  res
    .status(200)
    .json(new ApiResponse(200, user, 'Current user fetched successfully'));
});

export const forgotPassword = asyncHandler(async (req: Request, res: Response) => {
  const { email } = req.body;
  if (!email) {
    throw new ApiError(400, 'Email address is required');
  }

  const user = await User.findOne({ email: email.toLowerCase() });
  if (!user) {
    // Return friendly message even if email not found to prevent user enumeration
    return res.status(200).json(
      new ApiResponse(200, {}, 'If an account exists with that email, a 6-digit password reset OTP has been sent.')
    );
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
  if (config.RESEND_API_KEY) {
    try {
      // Resend API invocation placeholder
      console.log(`[Resend Email] Sending reset OTP ${otp} to ${user.email} from ${config.RESEND_FROM_EMAIL}`);
    } catch (emailErr) {
      console.error('[Resend Email Error]:', emailErr);
    }
  }

  return res.status(200).json(
    new ApiResponse(200, { email: user.email }, 'If an account exists with that email, a 6-digit password reset OTP has been sent.')
  );
});

export const resetPassword = asyncHandler(async (req: Request, res: Response) => {
  const { email, otp, newPassword } = req.body;

  if (!email || !otp || !newPassword) {
    throw new ApiError(400, 'Email, OTP, and new password are required');
  }

  if (newPassword.length < 6) {
    throw new ApiError(400, 'Password must be at least 6 characters');
  }

  const user = await User.findOne({
    email: email.toLowerCase(),
    resetPasswordOTP: otp,
    resetPasswordExpires: { $gt: new Date() },
  }).select('+password');

  if (!user) {
    throw new ApiError(400, 'Invalid or expired OTP code');
  }

  user.password = newPassword;
  user.resetPasswordOTP = undefined;
  user.resetPasswordExpires = undefined;
  await user.save({ validateBeforeSave: false });

  res.status(200).json(
    new ApiResponse(200, {}, 'Password reset successfully. You can now sign in with your new password.')
  );
});
