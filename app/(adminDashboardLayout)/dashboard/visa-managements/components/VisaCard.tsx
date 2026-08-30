"use client";

import { useRouter } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  FileText,
  Clock,
  FileCheck,
  Users,
  Trash2,
  Edit,
} from "lucide-react";
import { VisaType } from "../types";
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

interface VisaCardProps {
  visa: VisaType;
  onEdit: (visa: VisaType) => void;
  onDelete: (id: string) => void;
}

export const VisaCard = ({ visa, onEdit, onDelete }: VisaCardProps) => {
  const router = useRouter();

  const handleViewDetails = () => {
    router.push(`/dashboard/visa-managements/${visa.id}`);
  };

  return (
    <Card className="group transition-all hover:shadow-md border-gray-100">
      <CardContent className="pt-6">
        <div className="space-y-4">
          {/* Header */}
          <div className="flex items-start justify-between">
            <div className="flex items-start gap-3">
              <div className="h-10 w-10 rounded-lg bg-blue-100 dark:bg-blue-900/20 flex items-center justify-center">
                <FileText className="h-5 w-5 text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                <h3 className="font-semibold text-base">{visa.name}</h3>
                <p className="text-sm text-muted-foreground">{visa.country}</p>
              </div>
            </div>

            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950 rounded-lg"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent className="rounded-2xl bg-white border-gray-100 shadow-xl">
                <AlertDialogHeader>
                  <AlertDialogTitle className="text-xl font-bold text-gray-900">
                    Delete Visa Record?
                  </AlertDialogTitle>
                  <AlertDialogDescription className="text-gray-500">
                    This will permanently delete the <strong>{visa.name}</strong> record for <strong>{visa.country}</strong>. This action cannot be undone.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter className="mt-4">
                  <AlertDialogCancel className="rounded-xl border-gray-200 text-gray-600 hover:bg-gray-50">
                    Keep it
                  </AlertDialogCancel>
                  <AlertDialogAction
                    onClick={() => onDelete(visa.id)}
                    className="bg-red-500 hover:bg-red-600 text-white rounded-xl shadow-sm transition-all active:scale-95"
                  >
                    Yes, Delete
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>

          {/* Details */}
          <div className="space-y-2 text-sm">
            <div className="flex items-center gap-2 text-muted-foreground">
              <Clock className="h-4 w-4" />
              <span>Processing: {visa.processingTime}</span>
            </div>
            <div className="flex items-center gap-2 text-muted-foreground">
              <FileCheck className="h-4 w-4" />
              <span>Documents: {visa.requiredDocs.length} required</span>
            </div>
            <div className="flex items-center gap-2 text-muted-foreground">
              <Users className="h-4 w-4" />
              <span>Eligibility: {visa.eligibility.join(", ")}</span>
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-2 pt-2">
            <Button
              variant="outline"
              className="flex-1 gap-2 rounded-xl"
              onClick={() => onEdit(visa)}
            >
              <Edit className="h-4 w-4" />
              Edit Visa
            </Button>
            <Button variant="outline" className="flex-1 rounded-xl" onClick={handleViewDetails}>
              View Details
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
