"use client";

import * as React from "react";
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
import { Loader2, X } from "lucide-react";
import { VisaType } from "../types";

import worldCountries from "world-countries";

const countries = worldCountries
  .map((country) => country.name.common)
  .sort((a, b) => a.localeCompare(b));

interface EditVisaModalProps {
  isOpen: boolean;
  onClose: () => void;
  visa: VisaType | null;
  onSave: (visa: VisaType) => void;
  isLoading?: boolean;
}

export const EditVisaModal = ({
  isOpen,
  onClose,
  visa,
  onSave,
  isLoading = false,
}: EditVisaModalProps) => {
  const [formData, setFormData] = React.useState({
    name: "",
    country: "",
    category: "",
    processingTime: "",
    requiredDocs: "",
    eligibility: "",
  });

  React.useEffect(() => {
    if (visa) {
      setFormData({
        name: visa.name,
        country: visa.country,
        category: visa.category,
        processingTime: visa.processingTime,
        requiredDocs: visa.requiredDocs.join("\n"),
        eligibility: visa.eligibility.join("\n"),
      });
    }
  }, [visa]);

  const handleSave = () => {
    if (visa) {
      onSave({
        ...visa,
        name: formData.name,
        country: formData.country,
        category: formData.category,
        processingTime: formData.processingTime,
        requiredDocs: formData.requiredDocs.split("\n").filter(Boolean),
        eligibility: formData.eligibility.split("\n").filter(Boolean),
      });
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between">
            Edit Visa
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-4 max-h-[70vh] overflow-y-auto pr-2">
          <div className="space-y-2">
            <Label htmlFor="editCountry">Country Name</Label>
            <Select
              onValueChange={(value) =>
                setFormData({ ...formData, country: value })
              }
              value={formData.country}
            >
              <SelectTrigger id="editCountry">
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
            <Label htmlFor="editCategory">Visa Type</Label>
            <Select
              onValueChange={(value) =>
                setFormData({ ...formData, category: value })
              }
              value={formData.category}
            >
              <SelectTrigger id="editCategory">
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
            <Label htmlFor="editRequiredDocs">Required Documents (one per line)</Label>
            <Textarea
              id="editRequiredDocs"
              placeholder="List all required documents"
              rows={4}
              value={formData.requiredDocs}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  requiredDocs: e.target.value,
                })
              }
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="editEligibility">Eligibility (one per line)</Label>
            <Textarea
              id="editEligibility"
              placeholder="Eligibility requirements"
              rows={4}
              value={formData.eligibility}
              onChange={(e) =>
                setFormData({ ...formData, eligibility: e.target.value })
              }
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="editProcessingTime">Processing Time</Label>
            <Input
              id="editProcessingTime"
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
            onClick={handleSave}
            disabled={isLoading}
            className="rounded-md px-10 py-6 bg-[#77AEE1] hover:bg-[#77AEE1]/80 shadow min-w-[140px]"
          >
            {isLoading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
            {isLoading ? "Saving..." : "Save Changes"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
