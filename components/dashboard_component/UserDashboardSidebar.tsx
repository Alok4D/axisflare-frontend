"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
    LayoutGrid,
    History,
    ChevronLeft,
    ChevronRight,
    Menu,
    User,
    Crown,
    LogOut,
    ShieldPlus,
} from "lucide-react";
import { useLogoutMutation } from "@/lib/features/auth/authApi";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import Cookies from "js-cookie";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import Image from "next/image";
import logo from "@/public/assest/logo.png";
import { useGetMySubscriptionQuery } from "@/lib/features/subscription/subscriptionApi";

const SidebarContent = ({ 
    collapsed = false, 
    pathname = "", 
    onLogout, 
    hasActivePlan = false 
}: { 
    collapsed?: boolean, 
    pathname?: string, 
    onLogout?: () => void,
    hasActivePlan?: boolean
}) => (
    <div className="flex flex-col h-full">
        {/* Logo Section */}
        <div className={cn("p-6 mb-4", collapsed ? "flex justify-center items-center" : "")}>
            <Link href="/" className="flex items-center justify-center gap-2">
                <div className="shrink-0">
                    <Image
                        src={logo}
                        alt="AxisFlare Logo"
                        width={50}
                        height={50}
                        className="object-contain"
                    />
                </div>
            </Link>
        </div>

        {/* Nav Items */}
        <nav className="flex-1 px-0 space-y-1">
            {[
                { title: "Dashboard", icon: LayoutGrid, href: "/user-dashboard" },
                { title: "History", icon: History, href: "/user-dashboard/history" },
                { title: "Subscription", icon: ShieldPlus, href: "/user-dashboard/subscription" },
                { title: "Profile", icon: User, href: "/user-dashboard/profile" },
            ].map((item) => {
                const isActive = pathname === item.href;
                return (
                    <Link
                        key={item.href}
                        href={item.href}
                        className={cn(
                            "flex items-center gap-3 px-6 py-3 transition-all group relative",
                            isActive ? "text-[#2E3374]" : "text-[#595959] hover:bg-slate-100/50",
                            collapsed && "justify-center px-2"
                        )}
                    >
                        {isActive && (
                            <div className="absolute left-0 top-1/2 -translate-y-1/2 h-8 w-1.5 bg-[#2E3374] rounded-r-full" />
                        )}

                        <item.icon className={cn(
                            "h-6 w-6 shrink-0 transition-colors",
                            isActive ? "text-[#2E3374]" : "text-[#595959] group-hover:text-[#2E3374]"
                        )} />

                        {!collapsed && (
                            <span className={cn(
                                "text-base font-semibold",
                                isActive ? "text-[#2E3374]" : "text-[#595959]"
                            )}>
                                {item.title}
                            </span>
                        )}
                    </Link>
                );
            })}
        </nav>

        {/* Upgrade Card / Premium Link */}
        {!hasActivePlan && (
            <div className={cn("px-4 mb-6 flex flex-col gap-2", collapsed && "items-center")}>
                {!collapsed ? (
                    <div className="p-4 bg-[#EFF6FF] border border-[#BFDBFE] rounded-2xl shadow-sm">
                        <div className="flex items-center gap-2 mb-2">
                            <Crown className="text-amber-400 w-5 h-5" fill="currentColor" />
                            <h4 className="font-bold text-[#2E3374] text-sm">Upgrade to Pro</h4>
                        </div>
                        <p className="text-[11px] text-slate-500 leading-relaxed mb-4">
                            Unlock AI insights, unlimited downloads, and priority support
                        </p>
                        <Link href="/user-dashboard/subscription">
                            <Button className="w-full h-9 bg-[#7CB1E6] hover:bg-[#6FA3D8] text-white text-xs font-bold rounded-xl shadow-none border-none">
                                Get Pro
                            </Button>
                        </Link>
                    </div>
                ) : (
                    <Link
                        href="/user-dashboard/subscription"
                        className="w-12 h-12 bg-[#EFF6FF] border border-[#BFDBFE] rounded-xl flex items-center justify-center hover:bg-white transition-colors group shadow-sm"
                        title="Upgrade to Pro"
                    >
                        <Crown className="text-amber-400 w-6 h-6 transition-transform group-hover:scale-110" fill="currentColor" />
                    </Link>
                )}
            </div>
        )}

        {/* Logout Button */}
        <div className={cn("px-4 mb-6", collapsed && "flex justify-center")}>
            <button
                onClick={onLogout}
                className={cn(
                    "flex items-center gap-2 border bg-[#7CB1E6] py-2.5 text-white rounded-md hover:!bg-red-500 transition-all duration-200 w-full",
                    collapsed ? "justify-center px-0 w-11 h-11" : "justify-center px-4"
                )}
            >
                <LogOut className="h-6 w-6 shrink-0 transition-colors" />
                {!collapsed && <span>Logout</span>}
            </button>
        </div>
    </div>
);

export function UserDashboardSidebar() {

    const pathname = usePathname();
    const [isCollapsed, setIsCollapsed] = useState(false);
    const [logout] = useLogoutMutation();
    const { data: mySubData } = useGetMySubscriptionQuery(undefined, {
        refetchOnFocus: true,
        refetchOnReconnect: true
    });

    const hasActivePlan = mySubData?.data?.subscriptionStatus === "ACTIVE";

    const handleLogout = async () => {
        const toastId = toast.loading("Logging out...");
        try {
            await logout().unwrap();
            localStorage.removeItem("accessToken");
            localStorage.removeItem("refreshToken");
            Cookies.remove("accessToken");
            toast.success("Logged out successfully!", { id: toastId });
            window.location.href = "/";
        } catch (err: any) {
            console.error("Logout error", err);
            localStorage.removeItem("accessToken");
            localStorage.removeItem("refreshToken");
            Cookies.remove("accessToken");
            toast.success("Logged out successfully!", { id: toastId });
            window.location.href = "/";
        }
    };

    return (
        <>
            {/* Mobile View */}
            <div className="lg:hidden fixed top-6 left-4 z-60">
                <Sheet>
                    <SheetTrigger asChild>
                        <Button variant="outline" size="icon" className="h-10 w-10 bg-white shadow-sm">
                            <Menu size={20} className="text-slate-600" />
                        </Button>
                    </SheetTrigger>
                    <SheetContent side="left" className="p-0 w-70 bg-[#F8FAFC] border-r-0">
                        <SidebarContent collapsed={false} pathname={pathname} onLogout={handleLogout} hasActivePlan={hasActivePlan} />
                    </SheetContent>
                </Sheet>
            </div>

            {/* Desktop View */}
            <aside
                className={cn(
                    "relative flex-col h-screen border-r border-slate-100 transition-all duration-300 hidden lg:flex",
                    "bg-[rgba(119,174,225,0.20)]",
                    isCollapsed ? "w-20" : "w-65"
                )}
            >
                <Button
                    onClick={() => setIsCollapsed(!isCollapsed)}
                    variant="ghost"
                    size="icon"
                    className="absolute -right-3 top-10 h-6 w-6 rounded-full border border-slate-100 bg-white shadow-sm z-50 hover:bg-slate-50"
                >
                    {isCollapsed ? <ChevronRight size={14} /> : <ChevronLeft size={14} />}
                </Button>

                <SidebarContent collapsed={isCollapsed} pathname={pathname} onLogout={handleLogout} hasActivePlan={hasActivePlan} />
            </aside>
        </>
    );
}