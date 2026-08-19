import { z } from 'zod';
export declare const registerSchema: z.ZodObject<{
    body: z.ZodObject<{
        name: z.ZodString;
        email: z.ZodString;
        phone: z.ZodOptional<z.ZodString>;
        address: z.ZodOptional<z.ZodString>;
        password: z.ZodString;
        role: z.ZodDefault<z.ZodOptional<z.ZodEnum<["user", "admin"]>>>;
    }, "strip", z.ZodTypeAny, {
        name: string;
        email: string;
        password: string;
        role: "admin" | "user";
        phone?: string | undefined;
        address?: string | undefined;
    }, {
        name: string;
        email: string;
        password: string;
        phone?: string | undefined;
        address?: string | undefined;
        role?: "admin" | "user" | undefined;
    }>;
}, "strip", z.ZodTypeAny, {
    body: {
        name: string;
        email: string;
        password: string;
        role: "admin" | "user";
        phone?: string | undefined;
        address?: string | undefined;
    };
}, {
    body: {
        name: string;
        email: string;
        password: string;
        phone?: string | undefined;
        address?: string | undefined;
        role?: "admin" | "user" | undefined;
    };
}>;
export declare const loginSchema: z.ZodObject<{
    body: z.ZodObject<{
        email: z.ZodString;
        password: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        email: string;
        password: string;
    }, {
        email: string;
        password: string;
    }>;
}, "strip", z.ZodTypeAny, {
    body: {
        email: string;
        password: string;
    };
}, {
    body: {
        email: string;
        password: string;
    };
}>;
export declare const changePasswordSchema: z.ZodObject<{
    body: z.ZodObject<{
        oldPassword: z.ZodString;
        newPassword: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        oldPassword: string;
        newPassword: string;
    }, {
        oldPassword: string;
        newPassword: string;
    }>;
}, "strip", z.ZodTypeAny, {
    body: {
        oldPassword: string;
        newPassword: string;
    };
}, {
    body: {
        oldPassword: string;
        newPassword: string;
    };
}>;
export type RegisterInput = z.infer<typeof registerSchema>['body'];
export type LoginInput = z.infer<typeof loginSchema>['body'];
//# sourceMappingURL=auth.validation.d.ts.map