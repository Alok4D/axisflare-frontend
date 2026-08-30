"use client";

import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import { useGetMeQuery } from "@/lib/features/user/userApi";
import { useLogoutMutation } from "@/lib/features/auth/authApi";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { LogOut, User, LayoutDashboard, Loader2 } from "lucide-react";
import Cookies from "js-cookie";
import { toast } from "sonner";

export function Navbar() {
    const [scrolled, setScrolled] = useState(false);
    const { data: userResponse, isLoading: isUserLoading } = useGetMeQuery();
    const [logout, { isLoading: isLoggingOut }] = useLogoutMutation();
    const user = userResponse?.data;

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 20);
        };
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    const handleScrollToSection = (e: React.MouseEvent<HTMLAnchorElement>, id: string) => {
        const element = document.getElementById(id);
        if (element) {
            e.preventDefault();
            const targetPosition = element.offsetTop - 80;
            window.scrollTo({
                top: targetPosition,
                behavior: "smooth"
            });
            // Update hash without jumping
            window.history.pushState(null, "", `#${id}`);
        }
    };

    const handleLogout = async () => {
        try {
            await logout().unwrap();
            localStorage.removeItem("accessToken");
            localStorage.removeItem("refreshToken");
            Cookies.remove("accessToken");
            toast.success("Logged out successfully");
            window.location.href = "/";
        } catch (err) {
            localStorage.removeItem("accessToken");
            localStorage.removeItem("refreshToken");
            Cookies.remove("accessToken");
            window.location.href = "/";
        }
    };

    return (
        /* Outer wrapper: fixed, full width, no transform */
        <div className="fixed top-4 left-0 right-0 z-50 px-[2.5%]">
            <nav
                className={cn(
                    "w-full container mx-auto transition-all duration-300 py-3 px-6 md:px-8",
                    "rounded-lg border-t-2 border-t-white bg-white/20 backdrop-blur-md shadow-[0_4px_16px_0_rgba(0,0,0,0.02)]"
                )}
            >
                <div className="flex items-center justify-between">
                    {/* Logo */}
                    <Link href="/" className="flex items-center gap-2">
                        <Image
                            src="/assest/logo.png"
                            alt="Trans Seas"
                            width={300}
                            height={300}
                            className="h-12 w-auto object-contain"
                        />
                    </Link>

                    {/* Center Links */}
                    <div className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-700">
                        <Link
                            href="/#how-it-works"
                            className="hover:text-blue-600 transition-colors"
                            onClick={(e) => handleScrollToSection(e, "how-it-works")}
                        >
                            How It Works
                        </Link>
                        <Link
                            href="/#intelligence"
                            className="hover:text-blue-600 transition-colors"
                            onClick={(e) => handleScrollToSection(e, "intelligence")}
                        >
                            Intelligence
                        </Link>
                        <Link
                            href="/#pricing"
                            className="hover:text-blue-600 transition-colors"
                            onClick={(e) => handleScrollToSection(e, "pricing")}
                        >
                            Pricing
                        </Link>
                    </div>

                    {/* Right Action */}
                    <div className="flex items-center gap-4">
                        {isUserLoading ? (
                            <div className="h-10 w-10 flex items-center justify-center">
                                <Loader2 className="h-5 w-5 animate-spin text-[#77AEE1]" />
                            </div>
                        ) : user ? (
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <Button variant="ghost" className="relative h-10 w-10 rounded-full p-0 overflow-hidden ring-2 ring-[#77AEE1]/20 hover:ring-[#77AEE1]/40 transition-all">
                                        <Avatar className="h-10 w-10 border-none">
                                            <AvatarImage
                                                src={user.profilePicture || "https://blog.hootsuite.com/wp-content/uploads/2020/02/Image-copyright.png"}
                                                alt={user.name}
                                                className="object-cover"
                                            />
                                            <AvatarFallback className="bg-[#77AEE1]/10 text-[#77AEE1] font-semibold">
                                                {user.name?.charAt(0).toUpperCase() || "U"}
                                            </AvatarFallback>
                                        </Avatar>
                                    </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent className="w-56 mt-2 rounded-xl" align="end">
                                    <DropdownMenuLabel className="font-normal">
                                        <div className="flex flex-col space-y-1">
                                            <p className="text-sm font-semibold leading-none text-slate-900">{user.name}</p>
                                            <p className="text-xs leading-none text-slate-500">{user.email}</p>
                                        </div>
                                    </DropdownMenuLabel>
                                    <DropdownMenuSeparator />
                                    <DropdownMenuItem className="cursor-pointer rounded-lg mt-1" asChild>
                                        <Link
                                            href={user.role === "ADMIN" ? "/dashboard" : "/user-dashboard"}
                                            className="w-full flex items-center"
                                        >
                                            <LayoutDashboard className="mr-2 h-4 w-4" />
                                            <span>Dashboard</span>
                                        </Link>
                                    </DropdownMenuItem>
                                    <DropdownMenuSeparator />
                                    <DropdownMenuItem
                                        className="cursor-pointer rounded-lg mb-1 text-red-600 focus:text-red-600 focus:bg-red-50"
                                        onClick={handleLogout}
                                        disabled={isLoggingOut}
                                    >
                                        <LogOut className="mr-2 h-4 w-4" />
                                        <span>{isLoggingOut ? "Signing out..." : "Sign out"}</span>
                                    </DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>
                        ) : (
                            <Link href="/login">
                                <Button
                                    className="transition-all"
                                    style={{
                                        borderRadius: "32px",
                                        background: "#77AEE1",
                                        boxShadow: "0 8px 30px 0 rgba(119, 174, 225, 0.20)",
                                        display: "inline-flex",
                                        padding: "12px 24px",
                                        justifyContent: "center",
                                        alignItems: "center",
                                        gap: "12px",
                                        color: "#202020",
                                        fontFamily: "Inter, sans-serif",
                                        fontSize: "14px",
                                        fontStyle: "normal",
                                        fontWeight: 500,
                                        lineHeight: "20px",
                                        height: "auto"
                                    }}
                                >
                                    Sign In
                                </Button>
                            </Link>
                        )}
                    </div>
                </div>
            </nav>
        </div>
    );
}