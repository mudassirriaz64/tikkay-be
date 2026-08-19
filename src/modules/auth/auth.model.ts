import { Schema, model, Document, Model, Types } from 'mongoose';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { config } from '../../config';
import { ROLES, UserRole } from '../../config';

export interface IUser extends Document {
  name: string;
  email: string;
  phone: string;
  address: string;
  password: string;
  role: UserRole;
  refreshToken?: string;
  memberSince: string;
  favorites: Types.ObjectId[];
  is_loyalty_member?: boolean;
  loyalty_joined_at?: string;
  loyalty_points?: number;
  birthday?: string;
  whatsapp_opt_in?: boolean;
  resetPasswordOTP?: string;
  resetPasswordExpires?: Date;
  isPasswordCorrect(password: string): Promise<boolean>;
  generateAccessToken(): string;
  generateRefreshToken(): string;
}

interface IUserModel extends Model<IUser> {}

const userSchema = new Schema<IUser, IUserModel>(
  {
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
      enum: [ROLES.USER, ROLES.ADMIN],
      default: ROLES.USER,
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
      type: [Schema.Types.ObjectId],
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
    resetPasswordOTP: {
      type: String,
      select: false,
    },
    resetPasswordExpires: {
      type: Date,
      select: false,
    },
  },
  {
    timestamps: true,
    toJSON: {
      transform: function (_doc, ret: Record<string, any>) {
        delete ret.password;
        delete ret.refreshToken;
        delete ret.__v;
        return ret;
      },
    },
  }
);

userSchema.pre<IUser>('save', async function (next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

userSchema.methods.isPasswordCorrect = async function (password: string): Promise<boolean> {
  return await bcrypt.compare(password, this.password);
};

userSchema.methods.generateAccessToken = function (): string {
  return jwt.sign(
    {
      _id: this._id,
      email: this.email,
      name: this.name,
      role: this.role,
    },
    config.JWT_SECRET as string,
    {
      expiresIn: config.JWT_EXPIRES_IN as any,
    }
  );
};

userSchema.methods.generateRefreshToken = function (): string {
  return jwt.sign(
    {
      _id: this._id,
    },
    config.JWT_SECRET as string,
    {
      expiresIn: '10d' as any,
    }
  );
};

export const User = model<IUser, IUserModel>('User', userSchema);
