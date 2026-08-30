"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LogOut,
  ChevronLeft,
  ChevronRight,
  Menu,
  LayoutGrid,
  Globe,
  FileText,
  Waypoints,
  Users,
  Wallet,
  X as CloseIcon,
  User,
} from "lucide-react";

import { Button } from "@/components/ui/button";

import Image from "next/image";
import { cn } from "@/lib/utils";
import { useLogoutMutation } from "@/lib/features/auth/authApi";
import { useGetMeQuery } from "@/lib/features/user/userApi";
import { toast } from "sonner";
import Cookies from "js-cookie";


export function DashboardSidebar() {
  const { data: user } = useGetMeQuery();
  const [logout, { isLoading: isLoggingOut }] = useLogoutMutation();
  const pathname = usePathname();

  const [collapsed, setCollapsed] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Auto-collapse on mobile
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 1024) {
        setCollapsed(true);
      } else {
        setCollapsed(false);
        setMobileMenuOpen(false);
      }
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const handleLogout = async () => {
    const toastId = toast.loading("Logging out...");
    try {
      // Trying to call logout API, even if it fails we will clear the session
      await logout().unwrap();
      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");
      Cookies.remove("accessToken");
      toast.success("Logged out successfully!", { id: toastId });
      setMobileMenuOpen(false);
      window.location.href = "/";
    } catch (err: any) {
      console.error("Logout error", err);
      // Still logout locally if server-side logout fails
      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");
      Cookies.remove("accessToken");
      toast.success("Logged out successfully!", { id: toastId });
      window.location.href = "/";
    }

  };


  const menuItems = [
    { title: "Dashboard", icon: LayoutGrid, href: "/dashboard" },
    { title: "Country & Visa Exception", icon: Globe, href: "/dashboard/country-visa-exception" },
    { title: "Visa Management", icon: FileText, href: "/dashboard/visa-managements" },
    { title: "Transit Rules", icon: Waypoints, href: "/dashboard/transit-rules" },
    { title: "User Activity", icon: Users, href: "/dashboard/user-activity" },
    { title: "Manage Subscription", icon: Wallet, href: "/dashboard/subscription" },
    { title: "Profile", icon: User, href: "/dashboard/profile" },
  ];

  const sidebarContent = (
    <div className="flex flex-col h-full bg-[#2E3374]/5 border-r border-[#EBEBF4] overflow-hidden">
      {/* Logo & Toggle */}
      <div className={cn("flex items-center justify-center mb-2 border-b", collapsed ? "px-2 py-6" : "p-6")}>
        <Link href="/" className="flex items-center gap-2">
          {!collapsed && (
            <div className="flex items-center gap-2 text-primary font-bold text-xl">
              <Image
                src="/assest/logo.png"
                alt="Trans Seas Logo"
                width={60}
                height={40}
                className="h-auto w-full object-contain"
              />
            </div>
          )}
          {collapsed && (
            <div className="shrink-0">
              <Image
                src="/assest/logo.png"
                alt="Logo"
                width={32}
                height={32}
                className="object-contain"
              />
            </div>
          )}
        </Link>
        {/* Mobile Close Button */}
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setMobileMenuOpen(false)}
          className="h-8 w-8 text-slate-400 hover:text-slate-600 lg:hidden"
        >
          <CloseIcon className="h-5 w-5" />
        </Button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-4 overflow-y-auto overflow-x-hidden custom-scrollbar">
        <ul className="space-y-2">
          {menuItems.map((item) => {
            const isActive = pathname === item.href;
            const Icon = item.icon;

            return (
              <li key={item.href} className="relative">
                <Link
                  href={item.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={cn(
                    "flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all duration-200 group",
                    isActive
                      ? "bg-[#EBEDFF] text-[#2E3374] border-b-[3px] border-[#2E3374]"
                      : "text-slate-500 hover:text-[#2E3374] hover:bg-slate-100/50",
                    collapsed && "justify-center px-2"
                  )}
                >
                  <Icon
                    className={cn(
                      "h-5 w-5 shrink-0 transition-colors",
                      isActive ? "text-[#2E3374]" : "text-slate-500 group-hover:text-[#2E3374]"
                    )}
                  />
                  {!collapsed && (
                    <span className="truncate">{item.title}</span>
                  )}
                </Link>

                {/* Tooltip for collapsed state — moved outside Link, rendered via portal-like fixed positioning */}
                {collapsed && (
                  <span className="pointer-events-none fixed left-20 ml-2 px-2 py-1 bg-slate-800 text-white text-xs rounded opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all whitespace-nowrap z-[200]"
                    style={{ top: "inherit" }}
                  >
                    {item.title}
                  </span>
                )}
              </li>
            );
          })}
        </ul>
      </nav>

      {/* User Profile & Logout */}
      <div className="p-4 mt-auto">
        <div className={cn("flex items-center gap-3", collapsed ? "flex-col" : "justify-between")}>
          {/* Avatar */}
          <div className="h-10 w-10 rounded-full overflow-hidden border border-slate-200 shadow-sm shrink-0 bg-slate-100 flex items-center justify-center">
            <Image
              src={user?.data?.profilePicture || "https://blog.hootsuite.com/wp-content/uploads/2020/02/Image-copyright.png"}
              alt={user?.data?.name || "User"}
              width={40}
              height={40}
              className="object-cover w-full h-full"
            />
          </div>


          {/* Logout Button */}
          <button
            onClick={handleLogout}
            disabled={isLoggingOut}
            className={cn(
              "flex items-center transition-all duration-200",
              collapsed
                ? "justify-center h-10 w-10 text-red-500 hover:bg-red-50 rounded-xl"
                : "gap-2 px-5 py-2 rounded-full border border-red-500 bg-white text-red-500 hover:bg-red-50 text-sm font-medium",
              isLoggingOut && "opacity-50 cursor-not-allowed"
            )}
            title={collapsed ? "Logout" : undefined}
          >
            {!collapsed && <span>{isLoggingOut ? "Processing..." : "Logout"}</span>}
            <LogOut className={cn("h-5 w-5", !collapsed && "h-4 w-4")} />
          </button>

        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* Mobile Hamburger Button */}
      <button
        onClick={() => setMobileMenuOpen(true)}
        className="fixed top-4 left-4 z-50 lg:hidden bg-white shadow-md rounded-lg p-2 text-slate-600 hover:text-slate-900 transition"
      >
        <Menu className="h-6 w-6" />
      </button>

      {/* Sidebar Container */}
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-[60] flex flex-col bg-white shadow-xl lg:shadow-none transition-all duration-300 lg:relative lg:translate-x-0 h-screen overflow-hidden border-r border-[#EBEBF4]",
          collapsed ? "w-20" : "w-70",
          mobileMenuOpen
            ? "translate-x-0"
            : "-translate-x-full lg:translate-x-0",
        )}
      >
        {sidebarContent}
      </aside>

      {/* Desktop Toggle Button */}
      <Button
        onClick={() => setCollapsed(!collapsed)}
        variant="ghost"
        size="icon"
        className={cn(
          "fixed top-10 h-6 w-6 rounded-full border border-slate-100 bg-white shadow-md z-[100] hover:bg-slate-50 hidden lg:flex transition-all duration-300",
          collapsed ? "left-[68px]" : "left-[268px]"
        )}
      >
        {collapsed ? <ChevronRight size={14} /> : <ChevronLeft size={14} />}
      </Button>

      {/* Mobile Overlay */}
      {mobileMenuOpen && (
        <div
          className="fixed inset-0 bg-black/40 backdrop-blur-sm z-30 lg:hidden"
          onClick={() => setMobileMenuOpen(false)}
        />
      )}
    </>
  );
}