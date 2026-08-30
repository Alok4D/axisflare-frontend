"use client";

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Lock, EyeOff, Eye, ArrowLeft } from 'lucide-react';
import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useResetPasswordMutation } from '@/lib/features/auth/authApi';
import { toast } from 'sonner';
import { Loader2 } from 'lucide-react';

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";


// Assets
import bg from '@/public/auth/background.png';
import newPasswordImage from '@/public/auth/newPasswordImage.png';

// Validation Schema
const newPasswordSchema = z.object({
    password: z.string().min(8, { message: "Password must be at least 8 characters" }),
    confirmPassword: z.string()
}).refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
});

type ResetPasswordValues = z.infer<typeof newPasswordSchema>;

export default function NewPasswordPage() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const token = searchParams.get('token');

    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const [resetPassword, { isLoading: isResetting }] = useResetPasswordMutation();

    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting, isValid },
    } = useForm<ResetPasswordValues>({
        resolver: zodResolver(newPasswordSchema as any),
        mode: "onChange"
    });

    const onSubmit = async (data: ResetPasswordValues) => {
        if (!token) {
            toast.error("Invalid or missing reset token.");
            return;
        }

        const toastId = toast.loading("Resetting your password...");
        try {
            const result = await resetPassword({
                token: token,
                body: { password: data.password }
            }).unwrap();

            if (result.success) {
                toast.success(result.message || "Password reset successfully!", { id: toastId });
                router.push('/login');
            }
        } catch (err: any) {
            console.error("Reset password error:", err);
            toast.error(err?.data?.message || err?.message || "Failed to reset password", { id: toastId });
        }
    };


    return (
        <div className="min-h-screen w-full flex items-center justify-center relative overflow-hidden p-4 sm:p-6 lg:p-8 bg-[#f0f7ff]">
            {/* BACKGROUND */}
            <div className="absolute inset-0 z-0">
                <Image src={bg} alt="Background" fill priority className="object-cover" quality={100} />
            </div>

            <div className="relative z-10 w-full max-w-[1440px] flex flex-col lg:flex-row items-center justify-center lg:gap-[50px] gap-10">

                <div className="w-full max-w-[500px] p-6 flex flex-col gap-6 rounded-2xl border border-blue-500/25 bg-[#77AEE1]/5 shadow-[8px_8px_16px_0_rgba(119,174,225,0.20)] backdrop-blur-md transition-all shrink-0 animate__animated animate__fadeInLeft">
                    <Link href="/forgot-password" className="mb-4 inline-block text-gray-400 hover:text-gray-800 transition-colors self-start">
                        <ArrowLeft size={24} />
                    </Link>

                    <div className="mb-5">
                        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">Enter new password</h1>
                        <p className="text-gray-500 text-sm sm:text-base font-medium">Please create a new password to continue.</p>
                    </div>

                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 w-full">
                        {/* NEW PASSWORD FIELD */}
                        <div className="space-y-1.5">
                            <Label className="text-sm font-semibold text-gray-700 ml-1">Password</Label>
                            <div className="relative group">
                                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-blue-500 transition-colors" size={18} />
                                <Input
                                    {...register("password")}
                                    type={showPassword ? "text" : "password"}
                                    className={`w-full pl-12 pr-12 h-12 bg-white border ${errors.password ? 'border-red-400' : 'border-[#77AEE1]/25'} rounded-[8px] focus-visible:ring-2 focus-visible:ring-blue-300 transition-all shadow-sm`}
                                    placeholder="••••••••"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                                >
                                    {showPassword ? <Eye size={18} /> : <EyeOff size={18} />}
                                </button>
                            </div>
                            {errors.password && <p className="text-red-500 text-xs ml-1 font-medium">{errors.password.message}</p>}
                        </div>

                        {/* CONFIRM PASSWORD FIELD */}
                        <div className="space-y-1.5">
                            <Label className="text-sm font-semibold text-gray-700 ml-1">Confirm New Password</Label>
                            <div className="relative group">
                                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-blue-500 transition-colors" size={18} />
                                <Input
                                    {...register("confirmPassword")}
                                    type={showConfirmPassword ? "text" : "password"}
                                    className={`w-full pl-12 pr-12 h-12 bg-white border ${errors.confirmPassword ? 'border-red-400' : 'border-[#77AEE1]/25'} rounded-[8px] focus-visible:ring-2 focus-visible:ring-blue-300 transition-all shadow-sm`}
                                    placeholder="••••••••"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                                >
                                    {showConfirmPassword ? <Eye size={18} /> : <EyeOff size={18} />}
                                </button>
                            </div>
                            {errors.confirmPassword && <p className="text-red-500 text-xs ml-1 font-medium">{errors.confirmPassword.message}</p>}
                        </div>

                        {/* RESET BUTTON */}
                        <Button
                            type="submit"
                            disabled={!isValid || isSubmitting || isResetting}
                            style={{ backgroundColor: (isValid && !isSubmitting && !isResetting) ? '#77AEE1' : '#8b8b8b' }}
                            className="w-full text-white font-bold h-12 rounded-full shadow-lg transition-all active:scale-[0.98] disabled:opacity-70 text-lg mt-2 flex items-center justify-center gap-2"
                        >
                            {isSubmitting || isResetting ? (
                                <>
                                    <Loader2 className="h-5 w-5 animate-spin" />
                                    <span>Resetting...</span>
                                </>
                            ) : (
                                "Reset Password"
                            )}
                        </Button>

                    </form>

                    <p className="text-center mt-6 text-sm text-gray-500 w-full">
                        Remember your password? <Link href="/login" className="text-blue-800 font-bold hover:underline">Log In</Link>
                    </p>
                </div>

                {/* RIGHT SIDE: Illustration */}
                <div className="hidden md:flex items-center justify-center">
                    <div className="relative shrink-0 w-[300px] h-[330px] sm:w-[450px] sm:h-[490px] lg:w-[610px] lg:h-[668px]">
                        <Image src={newPasswordImage} alt="Illustration" fill className="object-contain pointer-events-none" priority />
                    </div>
                </div>

            </div>
        </div>
    );
}