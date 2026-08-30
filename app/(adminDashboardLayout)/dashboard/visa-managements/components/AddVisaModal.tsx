"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {  Loader } from "lucide-react";
import { VisaFormData } from "../types";

import worldCountries from "world-countries";

const countries = worldCountries
  .map((country) => country.name.common)
  .sort((a, b) => a.localeCompare(b));

interface AddVisaModalProps {
  isOpen: boolean;
  onClose: () => void;
  formData: VisaFormData;
  setFormData: (data: VisaFormData) => void;
  onSave: () => void;
  isLoading?: boolean;
}

export const AddVisaModal = ({
  isOpen,
  onClose,
  formData,
  setFormData,
  onSave,
  isLoading = false,
}: AddVisaModalProps) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between text-3xl font-medium">
            Add Visa
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-4 max-h-[70vh] overflow-y-auto pr-2">
          <div className="space-y-2">
            <Label htmlFor="countryName">Country Name</Label>
            <Select
              onValueChange={(value) =>
                setFormData({ ...formData, countryName: value })
              }
              value={formData.countryName}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select a country" />
              </SelectTrigger>
              <SelectContent>
                {countries.map((country) => (
                  <SelectItem key={country} value={country}>
                    {country}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="visaType">Visa Type</Label>
            <Select
              onValueChange={(value) =>
                setFormData({ ...formData, category: value })
              }
              value={formData.category}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select a visa type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="TOURISM">Tourist Visa</SelectItem>
                <SelectItem value="BUSINESS">Business Visa</SelectItem>
                <SelectItem value="STUDY">Student Visa</SelectItem>
                <SelectItem value="WORK">Work Visa</SelectItem>
                <SelectItem value="TRANSIT">Transit Visa</SelectItem>
                <SelectItem value="MEDICAL">Medical Visa</SelectItem>
                <SelectItem value="FAMILY_SPOUSE">Family / Spouse Visa</SelectItem>
                <SelectItem value="IMMIGRATION">Immigration Visa</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="requiredDocuments">Required Documents (one per line)</Label>
            <Textarea
              id="requiredDocuments"
              placeholder="List all required documents"
              rows={4}
              value={formData.requiredDocuments}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  requiredDocuments: e.target.value,
                })
              }
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="eligibility">Eligibility (one per line)</Label>
            <Textarea
              id="eligibility"
              placeholder="Eligibility requirements"
              rows={4}
              value={formData.eligibility}
              onChange={(e) =>
                setFormData({ ...formData, eligibility: e.target.value })
              }
            />
          </div>
         
          <div className="space-y-2">
            <Label htmlFor="processingTime">Processing Time</Label>
            <Input
              id="processingTime"
              placeholder="e.g., 3-5 weeks"
              value={formData.processingTime}
              onChange={(e) =>
                setFormData({ ...formData, processingTime: e.target.value })
              }
            />
          </div>
        </div>
        <DialogFooter className="flex justify-end gap-4 px-8 py-6 bg-gray-50 border-t -mx-6 -mb-6 mt-6">
          <Button variant="outline" onClick={onClose} disabled={isLoading} className="rounded-md px-10 py-6">
            Cancel
          </Button>
          <Button
            onClick={onSave}
            disabled={isLoading}
            className="rounded-md px-10 py-6 bg-[#77AEE1] hover:bg-[#77AEE1]/80 shadow min-w-[140px]"
          >
            {isLoading ? <Loader className="h-4 w-4 animate-spin mr-2" /> : null}
            {isLoading ? "Adding..." : "Add Visa"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
