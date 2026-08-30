"use client";
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import countries from 'world-countries';

import * as z from 'zod';
import { Mail, Lock, User, Eye, EyeOff, ArrowLeft, Globe } from 'lucide-react';
import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"

// Import your images - assuming same background
import bg from '@/public/auth/background.png';
import createAccountImage from '@/public/auth/createAccountImage.png';
import googleIcon from '@/public/auth/GoogleLogo.png';
import { useRouter } from 'next/navigation';
import { useCreateUserMutation } from '@/lib/features/user/userApi';
import { toast } from 'sonner';
import { Loader2 } from 'lucide-react';


const signupSchema = z.object({
    name: z.string().min(2, { message: "Name must be at least 2 characters" }),
    email: z.string().email({ message: "Invalid email address" }),
    country: z.string().min(1, { message: "Please select a country" }),
    password: z.string().min(8, { message: "Password must be at least 8 characters" }),
    confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
});

type SignupFormValues = z.infer<typeof signupSchema>;

export const REGIONS = [
    { code: "ALL", name: "All Regions", flag: "" },
    ...countries.map((country) => ({
        code: country.cca2,
        name: country.name.common,
        flag: country.flag,
    })).sort((a, b) => a.name.localeCompare(b.name)),
];


export default function SignupPage() {

    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const router = useRouter();
    const {
        register,
        handleSubmit,
        control,
        formState: { errors, isSubmitting },
    } = useForm<SignupFormValues>({
        resolver: zodResolver(signupSchema as any),
        defaultValues: {
            country: "ALL",
        }

    });


    const [createUser, { isLoading: isCreatingUser }] = useCreateUserMutation();

    const onSubmit = async (data: SignupFormValues) => {
        const toastId = toast.loading("Creating your account...");
        try {
            // Map 'country' from form to 'passport' for API
            const payload = {
                name: data.name,
                email: data.email,
                password: data.password,
                passport: data.country
            };

            const result = await createUser(payload).unwrap();

            if (result.success) {
                toast.success(result.message || "Account created successfully!", { id: toastId });
                router.push('/login');
            }
        } catch (err: any) {
            console.error("Signup error:", err);
            toast.error(err?.data?.message || err?.message || "Failed to create account", { id: toastId });
        }
    };


    return (
        <div
            className="min-h-screen w-full flex items-center justify-center relative overflow-hidden p-4 sm:p-6 lg:p-8 bg-[#f0f7ff]"
        >
            {/* BACKGROUND PART */}
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

            <div className="relative z-10 w-full max-w-[1440px] flex flex-col lg:flex-row items-center justify-center lg:gap-[50px] gap-10">

                {/* LEFT SIDE: Signup Form Part */}
                <div className="w-full max-w-[500px] p-5 flex flex-col gap-4 rounded-2xl border border-blue-500/25 bg-[#77AEE1]/5 shadow-[8px_8px_16px_0_rgba(119,174,225,0.20)] backdrop-blur-md transition-all shrink-0 animate__animated animate__fadeInLeft">
                    <button className="mb-2 text-gray-400 hover:text-gray-800 transition-colors p-1 self-start">
                        <Link href="/login"><ArrowLeft size={20} /></Link>
                    </button>

                    <div className="mb-3">
                        <h1 className="text-xl sm:text-2xl font-bold text-gray-900 mb-1">Create Your Account</h1>
                        <p className="text-gray-500 text-xs sm:text-sm font-medium">Join us today and start managing your projects effortlessly.</p>
                    </div>

                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 w-full">

                        {/* NAME FIELD */}
                        <div className="space-y-1.5">
                            <Label className="text-sm font-semibold text-gray-700 ml-1">Full Name</Label>
                            <div className="relative group">
                                <User className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-blue-500 transition-colors" size={18} />
                                <Input
                                    {...register("name")}
                                    className={`w-full pl-12 pr-4 h-12 bg-white border ${errors.name ? 'border-red-400' : 'border-[#77AEE1]/25'} rounded-[8px] focus-visible:ring-2 focus-visible:ring-blue-300 transition-all shadow-sm`}
                                    placeholder="Leonmak roni"
                                />
                            </div>
                            {errors.name && <p className="text-red-500 text-xs ml-1 font-medium">{errors.name.message}</p>}
                        </div>

                        {/* EMAIL FIELD */}
                        <div className="space-y-1.5">
                            <Label className="text-sm font-semibold text-gray-700 ml-1">Email</Label>
                            <div className="relative group">
                                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-blue-500 transition-colors" size={18} />
                                <Input
                                    {...register("email")}
                                    className={`w-full pl-12 pr-4 h-12 bg-white border ${errors.email ? 'border-red-400' : 'border-[#77AEE1]/25'} rounded-[8px] focus-visible:ring-2 focus-visible:ring-blue-300 transition-all shadow-sm`}
                                    placeholder="damo@gmail.com"
                                />
                            </div>
                            {errors.email && <p className="text-red-500 text-xs ml-1 font-medium">{errors.email.message}</p>}
                        </div>

                        <div className="space-y-1.5">
                            <Label className="text-sm font-semibold text-gray-700 ml-1">Passport Country</Label>
                            <div className="relative group">
                                <Controller
                                    name="country"
                                    control={control}
                                    render={({ field }) => (
                                        <Select onValueChange={field.onChange} value={field.value}>
                                            <SelectTrigger className={`w-full px-4 h-12 bg-[#121212] border border-[#77AEE1]/20 rounded-[8px] focus:ring-2 focus:ring-blue-300 transition-all shadow-sm text-[#77AEE1] font-semibold text-sm sm:text-base`}>
                                                <SelectValue placeholder="All Regions" />
                                            </SelectTrigger>
                                            <SelectContent className="max-h-80 bg-white">
                                                {REGIONS.map((region) => (
                                                    <SelectItem
                                                        key={region.code}
                                                        value={region.code}
                                                        className="hover:bg-slate-100 cursor-pointer"
                                                    >
                                                        <div className="flex items-center gap-2">
                                                            {region.flag && <span className="text-base">{region.flag}</span>}
                                                            <span className="text-sm">{region.name}</span>
                                                        </div>
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    )}
                                />
                            </div>
                            {errors.country && <p className="text-red-500 text-xs ml-1 font-medium">{errors.country.message}</p>}
                        </div>



                        {/* PASSWORD FIELD */}
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
                            <Label className="text-sm font-semibold text-gray-700 ml-1">Confirm Password</Label>
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

                        <Button
                            type="submit"
                            disabled={isSubmitting || isCreatingUser}
                            className="w-full bg-[#7fb3e4] hover:bg-[#6da2d3] text-white font-bold h-12 rounded-2xl shadow-lg transition-all active:scale-[0.98] disabled:opacity-70 mt-2 text-base flex items-center justify-center gap-2"
                        >
                            {isSubmitting || isCreatingUser ? (
                                <>
                                    <Loader2 className="h-5 w-5 animate-spin" />
                                    <span>Creating account...</span>
                                </>
                            ) : (
                                "Create Account"
                            )}
                        </Button>

                    </form>


                    <p className="text-center mt-4 sm:mt-6 text-xs sm:text-sm text-gray-500 w-full">
                        Already have an account? <Link href="/login" className="text-blue-800 font-bold hover:underline">Log in</Link>
                    </p>
                </div>

                {/* RIGHT SIDE: Illustration Part */}
                <div className="hidden md:flex items-center justify-center lg:mt-0 mt-8 animate__animated animate__fadeInRight">
                    <div
                        className="relative flex items-center justify-center shrink-0 w-[300px] h-[330px] sm:w-[450px] sm:h-[490px] lg:w-[610px] lg:h-[668px]"
                    >
                        <Image
                            src={createAccountImage}
                            alt="Signup Illustration"
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
