"use client";

import Image from "next/image";
import { useGetMeQuery } from "@/lib/features/user/userApi";



export function UserDashboardHeader() {
    const { data: user, isLoading: isUserLoading } = useGetMeQuery();


    return (
        <header className="w-full flex items-center justify-between px-6 lg:px-8 py-6 bg-[rgba(119,174,225,0.20)]">
            {/* Title Section */}
            <div className="ml-12 lg:ml-0">
                <h1 className="text-lg lg:text-xl font-bold text-slate-900 leading-tight">Plan Your Journey</h1>
                <p className="text-[10px] lg:text-xs text-slate-400">Departure → Destination</p>
            </div>

            {/* Profile Section */}
            <div className="flex items-center gap-2 lg:gap-3 group">
                <div className="h-9 w-9 lg:h-10 lg:w-10 rounded-full overflow-hidden border border-slate-200 shadow-sm bg-slate-100 flex items-center justify-center">
                    <Image
                        src={user?.data?.profilePicture || "https://blog.hootsuite.com/wp-content/uploads/2020/02/Image-copyright.png"}
                        alt={user?.data?.name || "User Avatar"}
                        width={40}
                        height={40}
                        className="object-cover w-full h-full"
                    />
                </div>
                <div className="flex flex-col gap-1">
                    <span className="hidden sm:inline text-sm font-medium text-slate-600">
                        {isUserLoading ? "Loading..." : user?.data?.name || "User"}
                    </span>
                    <span className="hidden sm:inline text-[10px] font-medium text-slate-600">
                        {isUserLoading ? "Loading..." : user?.data?.role || "User"}
                    </span>
                </div>
            </div>
        </header>
    );
}