import { Document, Model, Types } from 'mongoose';
import { UserRole } from '../../config';
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
interface IUserModel extends Model<IUser> {
}
export declare const User: IUserModel;
export {};
//# sourceMappingURL=auth.model.d.ts.map