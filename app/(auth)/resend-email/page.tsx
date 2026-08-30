"use client";
import Link from 'next/link';
import { ArrowLeft, Mail } from 'lucide-react';
import Image from 'next/image';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";

// Assets
import bg from '@/public/auth/background.png';

const resendEmailSchema = z.object({
    email: z.string().email({ message: "Invalid email address" }),
});

type ResendEmailValues = z.infer<typeof resendEmailSchema>;

export default function ResendEmailPage() {
    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting, isValid },
    } = useForm<ResendEmailValues>({
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        resolver: zodResolver(resendEmailSchema as any),
    });

    const onSubmit = (data: ResendEmailValues) => {
        console.log("Resend email to:", data);
    };

    return (
        <div className="min-h-screen w-full flex items-center justify-center relative overflow-hidden p-4 sm:p-6 lg:p-8 bg-[#f0f7ff]">
            {/* BACKGROUND */}
            <div className="absolute inset-0 z-0">
                <Image src={bg} alt="Background" fill priority className="object-cover" quality={100} />
            </div>

            <div className="relative z-10 w-full max-w-[1440px] flex flex-col lg:flex-row items-center justify-center lg:gap-[50px] gap-10">

                {/* LEFT SIDE: Resend Email Form */}
                <div className="w-full max-w-[500px] p-6 flex flex-col gap-6 rounded-2xl border border-blue-500/25 bg-[#77AEE1]/5 shadow-[8px_8px_16px_0_rgba(119,174,225,0.20)] backdrop-blur-md transition-all shrink-0 animate__animated animate__fadeInLeft">
                    <Link href="/login" className="mb-4 inline-block text-gray-400 hover:text-gray-800 transition-colors self-start">
                        <ArrowLeft size={24} />
                    </Link>

                    <div className="mb-5">
                        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">Resend Email</h1>
                        <p className="text-gray-500 text-sm sm:text-base font-medium">Enter your email to receive the link again.</p>
                    </div>

                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 w-full">
                        <div className="space-y-1.5">
                            <Label className="text-sm font-semibold text-gray-700 ml-1">Email (Optional)</Label>
                            <div className="relative group">
                                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                                <Input
                                    {...register("email")}
                                    className={`w-full pl-12 pr-4 h-12 bg-white border ${errors.email ? 'border-red-400' : 'border-[#77AEE1]/25'} rounded-[8px] focus-visible:ring-2 focus-visible:ring-blue-300 transition-all shadow-sm`}
                                    placeholder="damo@gmail.com"
                                />
                            </div>
                            {errors.email && <p className="text-red-500 text-xs ml-1 font-medium">{errors.email.message}</p>}
                        </div>

                        <Button
                            type="submit"
                            disabled={!isValid || isSubmitting}
                            style={{ backgroundColor: isValid ? '#77AEE1' : '#8b8b8b' }}
                            className="w-full text-white font-bold h-12 rounded-full shadow-lg transition-all active:scale-[0.98] text-base"
                        >
                            {isSubmitting ? "Resending..." : "Resend Email"}
                        </Button>
                    </form>
                </div>

                {/* RIGHT SIDE: Illustration */}
                <div className="hidden md:flex items-center justify-center animate__animated animate__fadeInRight">
                    <div className="relative shrink-0 w-[300px] h-[330px] sm:w-[450px] sm:h-[490px] lg:w-[610px] lg:h-[668px]">
                        <Image src="/auth/forgotPasswordEmialfieldImage.png" alt="Illustration" fill className="object-contain pointer-events-none" priority />
                    </div>
                </div>

            </div>
        </div>
    );
}
