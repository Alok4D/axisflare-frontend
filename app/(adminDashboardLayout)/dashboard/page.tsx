"use client";

import { Globe, FileText, Route, Users, Loader } from "lucide-react";
import OverviewHeading from "./dashboard-overview/_component/OverviewHeading";
import Stats, { StatCardData } from "./dashboard-overview/_component/Stats";
import RecentActivity, {
  ActivityItem,
} from "./dashboard-overview/_component/RecentActivity";
import { useGetDashboardSummaryQuery, useGetRecentActivitiesQuery } from "@/lib/features/dashboard/dashboardApi";
import { TRecentActivity } from "@/lib/types";

const DashboardOverviewPage = () => {
  const { data: summaryResponse, isLoading: isSummaryLoading } = useGetDashboardSummaryQuery();
  const { data: activitiesResponse, isLoading: isActivitiesLoading } = useGetRecentActivitiesQuery(undefined);

  const summary = summaryResponse?.data;
  const activitiesData = activitiesResponse?.data;

  const stats: StatCardData[] = [
    { label: "Total Countries", value: summary?.totalCountries || 0, icon: Globe },
    { label: "Visa Types", value: summary?.visaTypes || 0, icon: FileText },
    { label: "Travel Routes", value: summary?.travelRoutes || 0, icon: Route },
    { label: "Active Users", value: summary?.activeUsers || 0, icon: Users },
  ];

  const colorMap: Record<string, string> = {
    blue: "bg-blue-500",
    green: "bg-green-500",
    yellow: "bg-yellow-500",
    red: "bg-red-500",
  };

  const activities: ActivityItem[] = activitiesData?.map((activity: TRecentActivity) => ({
    id: activity.id as any,
    title: activity.title,
    description: activity.description,
    time: activity.timeAgo,
    color: colorMap[activity.color] || "bg-gray-500",
  })) || [];

  if (isSummaryLoading || isActivitiesLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px]">
        <Loader className="w-10 h-10 animate-spin text-primary mb-4" />
        <p className="text-muted-foreground">Loading dashboard data...</p>
      </div>
    );
  }

  return (
    <div className="p-6">
      <OverviewHeading />

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat, index) => (
          <Stats key={index} stat={stat} />
        ))}
      </div>

      {/* Activity Section */}
      <RecentActivity activities={activities} />
    </div>
  );
};

export default DashboardOverviewPage;