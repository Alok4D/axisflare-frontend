"use client";

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Mail, ArrowLeft } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useForgotPasswordMutation } from '@/lib/features/auth/authApi';
import { toast } from 'sonner';
import { Loader2 } from 'lucide-react';


import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";

// Assets
import bg from '@/public/auth/background.png';
import rightSide_image from '@/public/auth/forgotPasswordImage.png';

const forgotPasswordSchema = z.object({
    email: z.string().email({ message: "Invalid email address" }),
});

type ForgotPasswordValues = z.infer<typeof forgotPasswordSchema>;

export default function ForgotPasswordPage() {
    const router = useRouter();

    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting, isValid },
    } = useForm<ForgotPasswordValues>({
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        resolver: zodResolver(forgotPasswordSchema as any),
        mode: "onChange",
        defaultValues: { email: '' },
    });

    const [forgotPassword, { isLoading: isForgotLoading }] = useForgotPasswordMutation();

    const onSubmit = async (data: ForgotPasswordValues) => {
        const toastId = toast.loading("Sending reset link...");
        try {
            const result = await forgotPassword(data).unwrap();
            if (result.success) {
                toast.success(result.message || "Reset link sent to your email!", { id: toastId });
                // If you have a specific success page, redirect to it
                // router.push('/login'); 
            }
        } catch (err: any) {
            console.error("Forgot password error:", err);
            toast.error(err?.data?.message || err?.message || "Failed to send reset link", { id: toastId });
        }
    };


    return (
        <div className="min-h-screen w-full flex items-center justify-center relative overflow-hidden p-4 bg-[#f0f7ff]">
            <div className="absolute inset-0 z-0">
                <Image src={bg} alt="Background" fill priority className="object-cover" />
            </div>

            <div className="relative z-10 w-full max-w-[1440px] flex flex-col lg:flex-row items-center justify-center lg:gap-[50px] gap-10">

                {/* LEFT SIDE */}
                <div className="w-full max-w-[500px] p-6 flex flex-col gap-6 rounded-2xl border border-blue-500/25 bg-[#77AEE1]/5 shadow-[8px_8px_16px_0_rgba(119,174,225,0.20)] backdrop-blur-md transition-all shrink-0 animate__animated animate__fadeInLeft">
                    <Link href="/login" className="mb-4 inline-block text-gray-400 hover:text-gray-800 p-1 self-start">
                        <ArrowLeft size={24} />
                    </Link>

                    <div className="mb-5">
                        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">Forgot your password?</h1>
                        <p className="text-gray-500 text-sm font-medium">Enter your email address to reset your password.</p>
                    </div>

                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 w-full">
                        <div className="space-y-1.5">
                            <Label className="text-sm font-semibold text-gray-700 ml-1">Email</Label>
                            <div className="relative group">
                                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                                <Input
                                    {...register("email")}
                                    className={`w-full pl-12 pr-4 h-12 bg-white border ${errors.email ? 'border-red-400' : 'border-[#77AEE1]/25'} rounded-[8px] focus-visible:ring-2 focus-visible:ring-blue-300 transition-all shadow-sm`}
                                    placeholder="damo@gmail.com"
                                />
                            </div>
                        </div>

                        <Button
                            type="submit"
                            disabled={!isValid || isSubmitting || isForgotLoading}
                            style={{ backgroundColor: (isValid && !isSubmitting && !isForgotLoading) ? '#77AEE1' : '#8b8b8b' }}
                            className="w-full text-white font-bold h-12 rounded-full shadow-lg transition-all active:scale-[0.98] text-base flex items-center justify-center gap-2"
                        >
                            {isSubmitting || isForgotLoading ? (
                                <>
                                    <Loader2 className="h-4 w-4 animate-spin" />
                                    <span>Sending...</span>
                                </>
                            ) : (
                                "Send Link"
                            )}
                        </Button>

                    </form>
                </div>

                {/* RIGHT SIDE */}
                <div className="hidden md:flex items-center justify-center">
                    <div className="relative shrink-0 w-[300px] h-[330px] sm:w-[450px] sm:h-[490px] lg:w-[610px] lg:h-[668px]">
                        <Image src={rightSide_image} alt="Illustration" fill className="object-contain pointer-events-none" priority />
                    </div>
                </div>
            </div>
        </div>
    );
}