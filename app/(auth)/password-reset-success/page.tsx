"use client";

import { useState, useEffect } from 'react';
import { ArrowLeft } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { Button } from "@/components/ui/button";

// Assets
import bg from '@/public/auth/background.png';
import forgotPasswordImage from '@/public/auth/forgotPasswordImage.png';

export default function PasswordResetSuccessPage() {
    const [timeLeft, setTimeLeft] = useState(60);
    const [canResend, setCanResend] = useState(false);

    useEffect(() => {
        if (timeLeft <= 0) {
            setCanResend(true);
            return;
        }
        const timer = setInterval(() => setTimeLeft((prev) => prev - 1), 1000);
        return () => clearInterval(timer);
    }, [timeLeft]);

    const handleResend = () => {
        setTimeLeft(60);
        setCanResend(false);
        console.log("Resending...");
    };

    return (
        <div className="min-h-screen w-full flex items-center justify-center relative overflow-hidden p-4 sm:p-6 lg:p-8 bg-[#f0f7ff]">
            <div className="absolute inset-0 z-0">
                <Image src={bg} alt="Background" fill priority className="object-cover" />
            </div>

            <div className="relative z-10 w-full max-w-[1440px] flex flex-col lg:flex-row items-center justify-center lg:gap-[50px] gap-10">

                <div className="w-full max-w-[500px] p-8 sm:p-10 flex flex-col gap-6 rounded-2xl border border-blue-500/25 bg-[#77AEE1]/5 shadow-[8px_8px_16px_0_rgba(119,174,225,0.20)] backdrop-blur-md transition-all shrink-0 animate__animated animate__fadeInLeft">
                    <Link href="/forgot-password" className="mb-4 inline-block text-gray-800 self-start">
                        <ArrowLeft size={24} />
                    </Link>

                    <div className="mb-5">
                        <h1 className="text-2xl font-bold text-gray-900 mb-2">Password reset link sent!</h1>
                        <p className="text-gray-500 font-medium leading-relaxed">
                            We just emailed you a secure link. Click it to create a new password and get back into your account.
                        </p>
                    </div>

                    <div className="space-y-3 w-full">
                        {/* Timer Display */}
                        {!canResend && (
                            <p className="text-center text-sm font-bold text-blue-600">
                                You can resend in: 0:{timeLeft < 10 ? `0${timeLeft}` : timeLeft}
                            </p>
                        )}

                        <Button
                            onClick={handleResend}
                            disabled={!canResend}
                            className={`w-full font-bold h-12 rounded-full shadow-lg transition-all text-lg ${canResend ? 'bg-[#77AEE1] text-white hover:bg-[#6da2d3]' : 'bg-[#77AEE1]/50 text-white cursor-not-allowed'
                                }`}
                        >
                            Resend Email
                        </Button>
                    </div>

                    <p className="text-center mt-6 text-xs sm:text-sm text-gray-500 font-medium leading-tight w-full">
                        Didn't receive the email? check to spam folder or try again
                    </p>
                </div>

                {/* RIGHT SIDE: Illustration */}
                <div className="hidden md:flex items-center justify-center">
                    <div className="relative shrink-0 w-[300px] h-[330px] sm:w-[450px] sm:h-[490px] lg:w-[610px] lg:h-[668px]">
                        <Image src={forgotPasswordImage} alt="Illustration" fill className="object-contain" priority />
                    </div>
                </div>
            </div>
        </div>
    );
}