"use client";
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Mail, Lock, EyeOff, Eye, ArrowLeft } from 'lucide-react';
import { useState } from 'react';
import Image from 'next/image';
import googleIcon from '@/public/auth/GoogleLogo.png';

// Import your images
import bg from '@/public/auth/background.png';
import rightSide_image from '@/public/auth/login_rightside.png';
import Link from 'next/link';

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { useRouter, useSearchParams } from 'next/navigation';
import { useLoginMutation } from '@/lib/features/auth/authApi';
import { toast } from 'sonner';
import Cookies from 'js-cookie';
import { verifyToken } from '@/lib/utils';
import { Loader2 } from 'lucide-react';

const loginSchema = z.object({
    email: z.string().email({ message: "Invalid email address" }),
    password: z.string().min(6, { message: "Password must be at least 6 characters" }),
    rememberMe: z.boolean().optional(),
});

type LoginFormValues = z.infer<typeof loginSchema>;

export default function LoginPage() {
    const [showPassword, setShowPassword] = useState(false);
    const router = useRouter();
    const searchParams = useSearchParams();
    const callbackUrl = searchParams.get('callbackUrl');
    const [login, { isLoading: isLoginLoading }] = useLoginMutation();

    const {
        register,
        handleSubmit,
        control,
        formState: { errors },
    } = useForm<LoginFormValues>({
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        resolver: zodResolver(loginSchema as any)
    });

    const onSubmit = async (data: LoginFormValues) => {
        console.log("Submitting with data:", data);
        const toastId = toast.loading("Logging in...");
        try {
            const credentials = {
                email: data.email,
                password: data.password,
            };
            const result = await login(credentials).unwrap();
            console.log("Login Success Result:", result);

            if (result.success) {
                const accessToken = result.data.result.accessToken;
                const refreshToken = result.data.result.refreshToken;

                localStorage.setItem("accessToken", accessToken);
                localStorage.setItem("refreshToken", refreshToken);
                Cookies.set("accessToken", accessToken);

                const user: any = verifyToken(accessToken);
                console.log("Decoded User Role:", user?.role);

                toast.success(result.message || "Logged in successfully!", { id: toastId });

                // Redirect based on role or to home
                // Redirect based on role
                if (user?.role === "ADMIN") {
                    router.push('/dashboard');
                } else {
                    router.push(callbackUrl || '/');
                }
            }
        } catch (err: any) {
            console.error("Login Error Catch:", err);
            toast.error(err?.data?.message || err?.message || "Failed to login", { id: toastId });
        }
    };

    const onError = (formErrors: any) => {
        console.log("Validation Errors:", formErrors);
        if (Object.keys(formErrors).length > 0) {
            toast.error("Please fix the validation errors.");
        }
    };

    return (
        <div
            className="min-h-screen w-full flex items-center justify-center relative overflow-hidden p-4 sm:p-6 lg:p-8 bg-[#f0f7ff]"
        >

            {/* BACKGROUND PART: Ensure no part is cut off */}
            <div className="absolute inset-0 z-0">
                <Image
                    src={bg}
                    alt="Background"
                    fill
                    priority
                    className="object-cover"
                    quality={100}
                />
            </div>

            {/* Change: lg:justify-center and exact gap-[50px] */}
            <div className="relative z-10 w-full max-w-[1440px] flex flex-col lg:flex-row items-center justify-center lg:gap-[50px] gap-10">

                {/* LEFT SIDE: Login Form Part (Responsive sizing) */}
                <div className="w-full max-w-[500px] p-6 flex flex-col gap-6 rounded-2xl border border-blue-500/25 bg-[#77AEE1]/5 shadow-[8px_8px_16px_0_rgba(119,174,225,0.20)] backdrop-blur-md transition-all shrink-0 animate__animated animate__fadeInLeft">
                    <button className="mb-4 text-gray-400 hover:text-gray-800 transition-colors p-1 self-start">
                        <Link href="/"><ArrowLeft size={24} /></Link>
                    </button>

                    <div className="mb-5">
                        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">Welcome Back!</h1>
                        <p className="text-gray-500 text-sm sm:text-base font-medium">Log in to your account and continue building amazing things.</p>
                    </div>

                    <form onSubmit={handleSubmit(onSubmit, onError)} className="space-y-4 w-full">
                        {/* EMAIL FIELD PART */}
                        <div className="space-y-1.5">
                            <Label className="text-sm font-semibold text-gray-700 ml-1">Email</Label>
                            <div className="relative group">
                                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-blue-500 transition-colors" size={18} />
                                <Input
                                    {...register("email")}
                                    className={`w-full pl-12 pr-4 h-12 bg-white border ${errors.email ? 'border-red-400' : 'border-[#77AEE1]/25'} rounded-[8px] focus-visible:ring-2 focus-visible:ring-blue-300 transition-all shadow-sm`}
                                    placeholder="Enter your email"
                                />
                            </div>
                            {errors.email && <p className="text-red-500 text-xs ml-1 font-medium">{errors.email.message}</p>}
                        </div>

                        {/* PASSWORD FIELD PART */}
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

                        <div className="flex items-center justify-between text-xs sm:text-sm">
                            <div className="flex items-center space-x-2">
                                <Controller
                                    name="rememberMe"
                                    control={control}
                                    render={({ field }) => (
                                        <Checkbox
                                            id="rememberMe"
                                            checked={field.value}
                                            onCheckedChange={field.onChange}
                                            className="border-gray-300 data-[state=checked]:bg-blue-500 data-[state=checked]:border-blue-500"
                                        />
                                    )}
                                />
                                <Label htmlFor="rememberMe" className="text-gray-600 font-medium cursor-pointer select-none">Remember Me</Label>
                            </div>
                            <Link href="/forgot-password" className="text-blue-700 font-bold hover:underline transition-all">Forgot Password</Link>
                        </div>


                        <Button
                            type="submit"
                            disabled={isLoginLoading}
                            className="w-full bg-[#7fb3e4] hover:bg-[#6da2d3] text-white font-bold h-12 rounded-2xl shadow-lg transition-all active:scale-[0.98] disabled:opacity-70 text-base flex items-center justify-center gap-2"
                        >
                            {isLoginLoading ? (
                                <>
                                    <Loader2 className="h-5 w-5 animate-spin" />
                                    <span>Logging in...</span>
                                </>
                            ) : (
                                "Log In"
                            )}
                        </Button>

                    </form>


                    <p className="text-center mt-4 sm:mt-6 text-xs sm:text-sm text-gray-500 w-full">
                        Don't have an account? <a href="/signup" className="text-blue-800 font-bold hover:underline">Create account</a>
                    </p>
                </div>

                {/* RIGHT SIDE: Illustration Part */}
                <div className="hidden md:flex items-center justify-center lg:mt-0 mt-8 animate__animated animate__fadeInRight">
                    <div
                        className="relative flex items-center justify-center shrink-0 w-[300px] h-[330px] sm:w-[450px] sm:h-[490px] lg:w-[610px] lg:h-[668px]"
                    >
                        <Image
                            src={rightSide_image}
                            alt="Login Illustration"
                            fill
                            className="object-contain pointer-events-none"
                            priority
                        />
                    </div>
                </div>

            </div>
        </div>
    );
}