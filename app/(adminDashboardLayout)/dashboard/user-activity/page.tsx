"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Users, Plane, UserPlus, Search, Trash2, Loader2 } from "lucide-react";
import { Counter } from "@/lib/Counter";
import { useGetUsersQuery, useDeleteUserMutation } from "@/lib/features/user/userApi";
import { toast } from "sonner";

interface UserData {
  id: string;
  name: string;
  email: string;
  lastActive: string;
  subscription: string;
  subscriptionType: string;
}

const UserActivityPage = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Use the API hook for real data
  const { data: usersResponse, isLoading, isError, error } = useGetUsersQuery({
    page: currentPage,
    limit: itemsPerPage,
    searchTerm: searchQuery,
  });

  const [deleteUser, { isLoading: isDeleting }] = useDeleteUserMutation();

  // Derived stats from API response
  const statsData = {
    totalUsers: usersResponse?.stats?.totalUser || 0,
    totalTravelPlans: 0, // Not available in this specific API endpoint
    newUsers: usersResponse?.stats?.newUser || 0,
  };

  // Map API users to our interface
  const userData: UserData[] = usersResponse?.data?.map((user: any) => ({
    id: user.id,
    name: user.name,
    email: user.email,
    lastActive: user.createdAt ? new Date(user.createdAt).toLocaleDateString() : "N/A",
    subscription: user.subscriptionType || "FREE",
    subscriptionType: user.subscriptionType || "FREE",
  })) || [];

  const totalPages = usersResponse?.meta?.totalPage || 1;
  const totalItems = usersResponse?.meta?.total || 0;
  const startIndex = (currentPage - 1) * itemsPerPage;

  const goToPage = (page: number) => {
    const targetPage = Math.max(1, Math.min(page, totalPages));
    setCurrentPage(targetPage);
  };

  const handleDeleteUser = async (id: string) => {
    try {
      await deleteUser(id).unwrap();
      toast.success("User deleted successfully");
    } catch (err: any) {
      toast.error("Error deleting user", {
        description: err?.data?.message || "Failed to delete user",
      });
    }
  };

  // Error handling for fetch
  useEffect(() => {
    if (isError) {
      const err = error as any;
      toast.error("Error fetching users", {
        description: err?.data?.message || "Something went wrong.",
      });
    }
  }, [isError, error]);

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight text-[#1C1F37]">
          User Activity Monitoring
        </h1>
        <p className="text-[#999999] text-lg font-normal">
          Track user behavior and manage accounts across the platform.
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-3">
        {/* Total Users Card */}
        <Card className="border-gray-100 shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <div>
              <p className="text-sm font-medium text-gray-500">
                Total Users
              </p>
              <div className="text-4xl font-bold mt-2 text-[#1C1F37] flex items-center gap-1">
                <Counter value={statsData.totalUsers} />
              </div>
            </div>
            <div className="h-12 w-12 rounded-xl bg-blue-50 flex items-center justify-center">
              <Users className="h-6 w-6 text-blue-600" />
            </div>
          </CardHeader>
        </Card>

        {/* Total Travel Plans Card */}
        <Card className="border-gray-100 shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <div>
              <p className="text-sm font-medium text-gray-500">
                Total Travel Plans
              </p>
              <div className="text-4xl font-bold mt-2 text-[#1C1F37] flex items-center gap-1">
                <Counter value={statsData.totalTravelPlans} />
              </div>
            </div>
            <div className="h-12 w-12 rounded-xl bg-green-50 flex items-center justify-center">
              <Plane className="h-6 w-6 text-green-600" />
            </div>
          </CardHeader>
        </Card>

        {/* New Users Card */}
        <Card className="border-gray-100 shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <div>
              <p className="text-sm font-medium text-gray-500">
                New Users (This Week)
              </p>
              <div className="text-4xl font-bold mt-2 text-[#1C1F37] flex items-center gap-1">
                <Counter value={statsData.newUsers} />
              </div>
            </div>
            <div className="h-12 w-12 rounded-xl bg-purple-50 flex items-center justify-center">
              <UserPlus className="h-6 w-6 text-purple-600" />
            </div>
          </CardHeader>
        </Card>
      </div>

      {/* Search Bar */}
      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          placeholder="Search users..."
          value={searchQuery}
          onChange={(e) => {
            setSearchQuery(e.target.value);
            setCurrentPage(1);
          }}
          className="pl-9 rounded-xl border-gray-200"
        />
      </div>

      {/* User Table */}
      <Card className="border-gray-100 shadow-sm overflow-hidden">
        <CardContent className="p-0">
          <Table>
            <TableHeader className="bg-gray-50/50">
              <TableRow>
                <TableHead className="font-semibold">Name</TableHead>
                <TableHead className="font-semibold">Email</TableHead>
                <TableHead className="font-semibold">Last Active</TableHead>
                <TableHead className="font-semibold">Subscription</TableHead>
                <TableHead className="font-semibold text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                Array.from({ length: itemsPerPage }).map((_, i) => (
                  <TableRow key={i}>
                    <TableCell colSpan={6} className="py-8">
                      <div className="h-4 bg-gray-100 rounded animate-pulse w-full"></div>
                    </TableCell>
                  </TableRow>
                ))
              ) : userData.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-12 text-muted-foreground">
                    No users found.
                  </TableCell>
                </TableRow>
              ) : (
                userData.map((user, index) => (
                  <TableRow key={user.id} className="hover:bg-gray-50/50 transition-colors">
                    <TableCell className="font-medium text-gray-900">{user.name}</TableCell>
                    <TableCell className="text-gray-600">{user.email}</TableCell>
                    <TableCell className="text-gray-600">{user.lastActive}</TableCell>
                    <TableCell>
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${user.subscriptionType === "MONTHLY" || user.subscriptionType === "YEARLY"
                        ? "bg-blue-100 text-blue-800"
                        : user.subscriptionType === "ONE_TIME"
                          ? "bg-purple-100 text-purple-800"
                          : "bg-gray-100 text-gray-800"
                        }`}>
                        {user.subscriptionType}
                      </span>
                    </TableCell>
                    <TableCell className="text-right">
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 text-red-500 hover:text-red-600 hover:bg-red-50"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Delete User Account?</AlertDialogTitle>
                            <AlertDialogDescription>
                              Are you sure you want to delete <strong>{user.name}</strong>? This action cannot be undone.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction
                              onClick={() => handleDeleteUser(user.id)}
                              className="bg-red-500 hover:bg-red-600"
                            >
                              {isDeleting ? <Loader2 className="h-4 w-4 animate-spin" /> : "Delete"}
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>

        {/* Pagination Footer */}
        {!isLoading && totalItems > itemsPerPage && (
          <div className="px-6 py-4 border-t border-gray-100 flex items-center justify-between bg-white">
            <p className="text-sm text-gray-500">
              Showing <span className="font-medium">{startIndex + 1}</span> to{" "}
              <span className="font-medium">
                {Math.min(startIndex + itemsPerPage, totalItems)}
              </span>{" "}
              of <span className="font-medium">{totalItems}</span> users
            </p>
            <Pagination className="w-auto ml-auto">
              <PaginationContent>
                <PaginationItem>
                  <PaginationPrevious
                    onClick={() => goToPage(currentPage - 1)}
                    className={`cursor-pointer ${currentPage === 1 ? "pointer-events-none opacity-50" : ""}`}
                  />
                </PaginationItem>

                {Array.from({ length: totalPages }).map((_, i) => {
                  const page = i + 1;
                  // Basic pagination showing current, first, last, and neighbors
                  if (
                    page === 1 ||
                    page === totalPages ||
                    (page >= currentPage - 1 && page <= currentPage + 1)
                  ) {
                    return (
                      <PaginationItem key={page}>
                        <PaginationLink
                          isActive={currentPage === page}
                          onClick={() => goToPage(page)}
                          className="cursor-pointer"
                        >
                          {page}
                        </PaginationLink>
                      </PaginationItem>
                    );
                  } else if (
                    page === currentPage - 2 ||
                    page === currentPage + 2
                  ) {
                    return (
                      <PaginationItem key={page}>
                        <PaginationEllipsis />
                      </PaginationItem>
                    );
                  }
                  return null;
                })}

                <PaginationItem>
                  <PaginationNext
                    onClick={() => goToPage(currentPage + 1)}
                    className={`cursor-pointer ${currentPage === totalPages ? "pointer-events-none opacity-50" : ""}`}
                  />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          </div>
        )}
      </Card>
    </div>
  );
};

export default UserActivityPage;
