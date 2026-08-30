"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useGetMeQuery } from "@/lib/features/user/userApi";

export function DashboardHeader() {
  const { data: user, isLoading, isError } = useGetMeQuery();

  return (
    <div className="w-full bg-[#2E3374]/5 border-b border-[#EBEBF4] py-4 px-6 z-40">
      <div className="w-full mx-auto flex justify-between items-center gap-4">
        <div className="flex-1">
          <h1 className="text-xl sm:text-xl font-bold text-gray-900">
            {isLoading ? "Loading..." : user?.data?.name || "Dashboard"}
          </h1>
        </div>

        {/* Right side - User info */}
        <div className="flex items-center gap-3 sm:gap-4">
          <div className="hidden sm:block text-right">
            {isLoading ? (
              <div className="space-y-1">
                <div className="h-4 w-24 bg-gray-200 rounded animate-pulse" />
                <div className="h-3 w-16 bg-gray-200 rounded animate-pulse" />
              </div>
            ) : isError ? (
              <div className="text-xs text-red-500">Error</div>
            ) : (
              <>
                <p className="text-sm font-semibold text-gray-900 leading-tight">
                  {user?.data?.name || "Admin"}
                </p>
                <p className="text-xs font-medium text-gray-500 capitalize">
                  {user?.data?.role || "Administrator"}
                </p>
              </>
            )}
          </div>

          <Avatar className="h-9 w-9 sm:h-10 sm:w-10 ring-2 ring-[#314B79] ring-offset-2 transition-transform hover:scale-105">
            <AvatarImage
              src={user?.data?.profilePicture || "https://blog.hootsuite.com/wp-content/uploads/2020/02/Image-copyright.png"}
              alt={user?.data?.name || "User"}
              className="object-cover"
            />
            <AvatarFallback className="bg-gradient-to-br from-[#314B79] to-[#4A6FA5] text-white font-semibold text-sm sm:text-base">
              {user?.data?.name ? user.data.name.charAt(0).toUpperCase() : "A"}
            </AvatarFallback>
          </Avatar>
        </div>
      </div>
    </div>
  );
}
