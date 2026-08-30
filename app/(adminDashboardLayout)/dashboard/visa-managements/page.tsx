"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Loader, Plus, Search } from "lucide-react";
import { VisaType, VisaFormData } from "./types";
import { StatsCard } from "./components/StatsCard";
import { VisaCard } from "./components/VisaCard";
import { AddVisaModal } from "./components/AddVisaModal";
import { EditVisaModal } from "./components/EditVisaModal";
import { toast } from "sonner";
import {
  useGetVisasQuery,
  useCreateVisaMutation,
  useUpdateVisaMutation,
  useDeleteVisaMutation,
} from "@/lib/features/visa/visaApi";
import { useEffect } from "react";

const categoryLabelMap: Record<string, string> = {
  TOURISM: "Tourist Visa",
  BUSINESS: "Business Visa",
  STUDY: "Student Visa",
  WORK: "Work Visa",
  TRANSIT: "Transit Visa",
  MEDICAL: "Medical Visa",
  FAMILY_SPOUSE: "Family / Spouse Visa",
  IMMIGRATION: "Immigration Visa",
};

const VisaManagementsPage = () => {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedVisa, setSelectedVisa] = useState<VisaType | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  const [visaForm, setVisaForm] = useState<VisaFormData>({
    countryName: "",
    visaType: "",
    category: "",
    requiredDocuments: "",
    eligibility: "",
    processingTime: "",
  });

  // RTK Query hooks
  const { data: visasResponse, isLoading, isError, error } = useGetVisasQuery();
  const [createVisa, { isLoading: isCreating }] = useCreateVisaMutation();
  const [updateVisa, { isLoading: isUpdating }] = useUpdateVisaMutation();
  const [deleteVisa] = useDeleteVisaMutation();

  // Get data from response or empty array
  const fetchedVisas: VisaType[] = visasResponse?.data?.data?.map((v: any) => ({
    id: v.id,
    name: categoryLabelMap[v.category] || v.category, // Use mapped label or fallback to raw category
    country: v.destinationCountry,
    category: v.category,
    processingTime: v.processingTime,
    requiredDocs: v.requiredDocs || [],
    eligibility: v.eligibility || [],
  })) || [];

  // Handle error notification
  useEffect(() => {
    if (isError) {
      const err = error as any;
      const message = err?.data?.message || "Something went wrong while fetching visas. Please try again.";
      toast.error("Error", {
        description: message,
        duration: 5000,
      });
    }
  }, [isError, error]);

  // Derived dynamic stats
  const totalVisaTypes = fetchedVisas.length;
  const uniqueCountries = new Set(fetchedVisas.map(v => v.country)).size;

  // Filter visas based on search
  const filteredVisas = fetchedVisas.filter(
    (visa) =>
      visa.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      visa.country?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleAddVisa = async () => {
    try {
      // Mapping local form fields to API payload
      const payload = {
        destinationCountry: visaForm.countryName,
        // name field removed as it's not supported by the backend Prisma schema
        category: visaForm.category || "TOURISM",
        processingTime: visaForm.processingTime,
        requiredDocs: visaForm.requiredDocuments?.split("\n").filter(Boolean) || [],
        eligibility: visaForm.eligibility?.split("\n").filter(Boolean) || [],
      };

      const response = await createVisa(payload).unwrap();

      toast.success("Visa type added successfully", {
        description: response?.message || "The record has been updated."
      });

      setIsAddModalOpen(false);
      setVisaForm({
        countryName: "",
        visaType: "",
        category: "",
        requiredDocuments: "",
        eligibility: "",
        processingTime: "",
      });
    } catch (err: any) {
      const errorMessage = err?.data?.message || "Failed to add visa type";
      toast.error("Error adding visa", {
        description: errorMessage,
      });
    }
  };

  const handleEditVisa = (visa: VisaType) => {
    setSelectedVisa(visa);
    setIsEditModalOpen(true);
  };

  const handleSaveEditVisa = async (updatedVisa: VisaType) => {
    try {
      const payload = {
        destinationCountry: updatedVisa.country,
        // name field removed as it's not supported by the backend Prisma schema
        category: updatedVisa.category,
        processingTime: updatedVisa.processingTime,
        requiredDocs: updatedVisa.requiredDocs,
        eligibility: updatedVisa.eligibility,
      };

      await updateVisa({ id: updatedVisa.id, data: payload }).unwrap();
      toast.success("Visa type updated successfully");
      setIsEditModalOpen(false);
      setSelectedVisa(null);
    } catch (err: any) {
      const errorMessage = err?.data?.message || "Failed to update visa type";
      toast.error("Error updating visa", {
        description: errorMessage,
      });
    }
  };

  const handleDeleteVisa = async (id: string) => {
    try {
      await deleteVisa(id).unwrap();
      toast.success("Visa type deleted successfully");
    } catch (err: any) {
      const errorMessage = err?.data?.message || "Failed to delete visa type";
      toast.error("Error deleting visa", {
        description: errorMessage,
      });
    }
  };

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold">Visa & Work Permit Management</h1>
        <p className="text-muted-foreground mt-1">
          Manage visa types, requirements, and processing information
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2">
        <StatsCard
          title="Total Visa Type"
          value={totalVisaTypes}
          valueColor="text-green-600 dark:text-green-400"
        />
        <StatsCard
          title="Countries"
          value={uniqueCountries}
          valueColor="text-blue-600 dark:text-blue-400"
        />
      </div>

      {/* Search and Add Button */}
      <div className="flex items-center justify-between gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search visa type"
            className="pl-10"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <Button
          onClick={() => setIsAddModalOpen(true)}
          className="gap-2 bg-[#77AEE1] hover:bg-[#77AEE1]/80 shadow rounded-xl px-10 py-6 text-lg font-semibold"
        >
          <Plus className="h-5 w-5" />
          Add Visa
        </Button>
      </div>

      {/* Loader */}
      {isLoading && (
        <div className="flex flex-col items-center justify-center py-20 animate-in fade-in duration-500">
          <Loader className="h-10 w-10 text-blue-500 animate-spin mb-4" />
          <p className="text-muted-foreground font-medium">Fetching Visa information...</p>
        </div>
      )}

      {/* Visa Cards Grid */}
      {!isLoading && !isError && (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-2">
          {filteredVisas.map((visa) => (
            <VisaCard
              key={visa.id}
              visa={visa}
              onEdit={handleEditVisa}
              onDelete={handleDeleteVisa}
            />
          ))}
        </div>
      )}

      {/* No Results Empty State */}
      {!isLoading && filteredVisas.length === 0 && !isError && (
        <div className="flex flex-col items-center justify-center py-20 bg-gray-50/50 border-2 border-dashed border-gray-100 rounded-[32px] mt-8 animate-in fade-in zoom-in duration-500">
          <div className="h-20 w-20 rounded-full bg-white shadow-sm flex items-center justify-center mb-5 group-hover:scale-110 transition-transform">
            <Search className="h-9 w-9 text-gray-200" />
          </div>
          <h3 className="text-xl font-bold text-gray-900 mb-1">No Visa Types Available</h3>
          <p className="text-muted-foreground text-center max-w-[320px] mb-8 font-medium">
            {searchQuery 
              ? `We couldn't find any visa records for "${searchQuery}". Please try another search.`
              : "Start by adding your first visa record to the dashboard."}
          </p>
          {searchQuery ? (
            <Button 
              variant="outline" 
              onClick={() => setSearchQuery("")}
              className="rounded-full px-8 h-12 font-bold text-[#77AEE1] border-[#77AEE1] hover:bg-[#77AEE1]/5"
            >
              Clear Search
            </Button>
          ) : (
            <div>
              <Button
                onClick={() => setIsAddModalOpen(true)}
                className="gap-2 bg-[#77AEE1] hover:bg-[#77AEE1]/80 rounded-md px-12 py-4 text-lg font-medium"
              >
                <Plus className="h-5 w-5" />
                Add Visa
              </Button>
            </div>
          )}
        </div>
      )}

      {isError && (
        <div className="text-center py-12 border-2 border-dashed border-red-100 rounded-3xl bg-red-50/10">
          <p className="text-red-500 font-semibold mb-2">Failed to load Visa records</p>
          <Button variant="outline" size="sm" onClick={() => window.location.reload()}>
            Try Refreshing
          </Button>
        </div>
      )}

      {/* Add Visa Modal */}
      <AddVisaModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        formData={visaForm}
        setFormData={setVisaForm}
        onSave={handleAddVisa}
        isLoading={isCreating}
      />

      <EditVisaModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        visa={selectedVisa}
        onSave={handleSaveEditVisa}
        isLoading={isUpdating}
      />
    </div>
  );
};

export default VisaManagementsPage;