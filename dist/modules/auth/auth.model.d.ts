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
    isPasswordCorrect(password: string): Promise<boolean>;
    generateAccessToken(): string;
    generateRefreshToken(): string;
}
interface IUserModel extends Model<IUser> {
}
export declare const User: IUserModel;
export {};
//# sourceMappingURL=auth.model.d.ts.map