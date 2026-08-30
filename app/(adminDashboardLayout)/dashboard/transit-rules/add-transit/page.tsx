"use client";

import { useState, useRef, useEffect, type FormEvent } from "react";
import { X, ChevronDown, Search, Globe, Clock, FileText, CheckCircle } from "lucide-react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { useCreateTransitRuleMutation } from "@/lib/features/transit/transitApi";
import { Loader2 } from "lucide-react";

const countries: string[] = [
  "Afghanistan", "Albania", "Algeria", "Argentina", "Australia", "Austria",
  "Bangladesh", "Belgium", "Brazil", "Canada", "Chile", "China", "Colombia",
  "Czech Republic", "Denmark", "Egypt", "Ethiopia", "Finland", "France",
  "Germany", "Ghana", "Greece", "Hungary", "India", "Indonesia", "Iran",
  "Iraq", "Ireland", "Israel", "Italy", "Japan", "Jordan", "Kenya",
  "Malaysia", "Mexico", "Morocco", "Netherlands", "New Zealand", "Nigeria",
  "Norway", "Pakistan", "Philippines", "Poland", "Portugal", "Romania",
  "Russia", "Saudi Arabia", "South Africa", "South Korea", "Spain",
  "Sweden", "Switzerland", "Thailand", "Turkey", "Ukraine", "United Arab Emirates",
  "United Kingdom", "United States", "Vietnam", "Zimbabwe",
];

interface VisaOption {
  value: string;
  label: string;
  description: string;
  color: string;
  dot: string;
}

const visaOptions: VisaOption[] = [
  {
    value: "required",
    label: "Visa Required",
    description: "Transit visa is required",
    color: "border-red-300 bg-red-50",
    dot: "bg-red-400",
  },
  {
    value: "not_required",
    label: "Not Required",
    description: "Transit visa is not required",
    color: "border-green-300 bg-green-50",
    dot: "bg-green-400",
  },
  {
    value: "conditional",
    label: "Conditional",
    description: "Transit visa requirement depends on specific conditions",
    color: "border-amber-300 bg-amber-50",
    dot: "bg-amber-400",
  },
];

interface CountryDropdownProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
}

function CountryDropdown({ label, value, onChange, placeholder }: CountryDropdownProps) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const ref = useRef<HTMLDivElement>(null);

  const filtered = countries.filter((c) =>
    c.toLowerCase().includes(search.toLowerCase())
  );

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  return (
    <div className="relative" ref={ref}>
      <label className="block text-sm font-semibold text-gray-700 mb-1.5">
        {label} <span className="text-blue-500">*</span>
      </label>
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between px-4 py-3 rounded-xl border border-gray-200 bg-white text-left shadow-sm hover:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-200 transition-all duration-200"
      >
        <span className={`text-sm ${value ? "text-gray-800 font-medium" : "text-gray-400"}`}>
          {value || placeholder}
        </span>
        <ChevronDown
          className={`w-4 h-4 text-gray-400 transition-transform duration-200 ${open ? "rotate-180" : ""}`}
        />
      </button>

      {open && (
        <div className="absolute z-50 mt-1.5 w-full bg-white border border-gray-200 rounded-xl shadow-xl overflow-hidden">
          <div className="p-2 border-b border-gray-100">
            <div className="flex items-center gap-2 px-3 py-2 bg-gray-50 rounded-lg">
              <Search className="w-4 h-4 text-gray-400" />
              <input
                autoFocus
                className="flex-1 bg-transparent text-sm outline-none text-gray-700 placeholder-gray-400"
                placeholder="Search country..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
          </div>
          <div className="max-h-52 overflow-y-auto">
            {filtered.length === 0 ? (
              <div className="px-4 py-3 text-sm text-gray-400 text-center">No results found</div>
            ) : (
              filtered.map((country) => (
                <button
                  key={country}
                  type="button"
                  className={`w-full text-left px-4 py-2.5 text-sm hover:bg-blue-50 transition-colors flex items-center gap-2 ${value === country ? "bg-blue-50 text-blue-700 font-medium" : "text-gray-700"
                    }`}
                  onClick={() => {
                    onChange(country);
                    setSearch("");
                    setOpen(false);
                  }}
                >
                  <Globe className="w-3.5 h-3.5 text-gray-400 flex-shrink-0" />
                  {country}
                  {value === country && <CheckCircle className="w-3.5 h-3.5 text-blue-500 ml-auto" />}
                </button>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}

interface TransitForm {
  travelerNationality: string;
  transitCountry: string;
  visaRequirement: string;
  conditionalDetails: string;
  maxLayoverDuration: string;
  notes: string;
}

export default function AddTransitPage() {
  const router = useRouter();
  const [createTransitRule, { isLoading }] = useCreateTransitRuleMutation();
  const [form, setForm] = useState<TransitForm>({
    travelerNationality: "",
    transitCountry: "",
    visaRequirement: "required",
    conditionalDetails: "",
    maxLayoverDuration: "",
    notes: "",
  });

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (!form.travelerNationality || !form.transitCountry || !form.visaRequirement) {
      toast.error("Please fill in all required fields");
      return;
    }

    try {
      // Map form to API payload
      const payload = {
        travelerCountry: form.travelerNationality,
        transitCountry: form.transitCountry,
        requirement: form.visaRequirement.toUpperCase() as "REQUIRED" | "NOT_REQUIRED" | "CONDITIONAL",
        maxLayoverDuration: form.maxLayoverDuration,
        conditions: form.conditionalDetails,
        notes: form.notes,
      };

      const response = await createTransitRule(payload).unwrap();
      toast.success(response?.message || "Transit rule created successfully");
      router.push("/dashboard/transit-rules");
    } catch (err: any) {
      toast.error(err?.data?.message || "Failed to add transit rule. Please try again.");
    }
  };

  return (
    <div className="p-4 flex justify-center">
      <div className="bg-white w-full max-w-3xl rounded-xl shadow-xs border border-gray-100 flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-gray-100">
          <div>
            <h2 className="text-xl font-bold text-gray-900">Add New Transit Exception</h2>
            <p className="text-xs text-gray-400 mt-0.5">Configure transit visa rules</p>
          </div>
          <button
            onClick={() => router.back()}
            className="p-2 rounded-xl hover:bg-gray-100 transition-colors text-gray-400 hover:text-gray-600"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="px-6 py-5 space-y-5">
          {/* Traveler Nationality */}
          <CountryDropdown
            label="Traveler Nationality"
            value={form.travelerNationality}
            onChange={(v) => setForm({ ...form, travelerNationality: v })}
            placeholder="Search for a country..."
          />

          {/* Transit Country */}
          <CountryDropdown
            label="Transit Country"
            value={form.transitCountry}
            onChange={(v) => setForm({ ...form, transitCountry: v })}
            placeholder="Search for a country..."
          />

          {/* Transit Visa Requirement */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Transit Visa Requirement <span className="text-blue-500">*</span>
            </label>
            <div className="space-y-2">
              {visaOptions.map((opt) => (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => setForm({ ...form, visaRequirement: opt.value })}
                  className={`w-full flex items-start gap-3 px-4 py-3 rounded-xl border-2 text-left transition-all duration-200 ${form.visaRequirement === opt.value
                    ? opt.color + " shadow-sm"
                    : "border-gray-150 bg-gray-50 hover:border-gray-300"
                    }`}
                >
                  <div className="flex-shrink-0 mt-0.5">
                    <div
                      className={`w-4 h-4 rounded-full border-2 flex items-center justify-center transition-all ${form.visaRequirement === opt.value
                        ? "border-current"
                        : "border-gray-300"
                        }`}
                    >
                      {form.visaRequirement === opt.value && (
                        <div className={`w-2 h-2 rounded-full ${opt.dot}`} />
                      )}
                    </div>
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-gray-800">{opt.label}</p>
                    <p className="text-xs text-gray-500 mt-0.5">{opt.description}</p>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Conditional Details */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1.5 flex items-center gap-1.5">
              <FileText className="w-3.5 h-3.5 text-gray-400" />
              Conditional Details
            </label>
            <textarea
              className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-200 focus:border-blue-400 resize-none transition-all"
              rows={3}
              placeholder="Additional requirements, restrictions, or important information..."
              value={form.conditionalDetails}
              onChange={(e) => setForm({ ...form, conditionalDetails: e.target.value })}
            />
          </div>

          {/* Max Layover Duration */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1.5 flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-gray-400" />
              Maximum layover duration
            </label>
            <input
              type="text"
              className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-200 focus:border-blue-400 transition-all"
              placeholder="e.g., 24 hours, 48 hours, 5 days"
              value={form.maxLayoverDuration}
              onChange={(e) => setForm({ ...form, maxLayoverDuration: e.target.value })}
            />
          </div>

          {/* Notes */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1.5">Notes</label>
            <textarea
              className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-200 focus:border-blue-400 resize-none transition-all"
              rows={3}
              placeholder="Additional requirements, restrictions, or important information..."
              value={form.notes}
              onChange={(e) => setForm({ ...form, notes: e.target.value })}
            />
          </div>

          {/* Footer */}
          <div className="flex justify-end gap-4 px-8 py-6 bg-gray-50 border-t">
            <Button
              type="button"
              variant="outline"
              onClick={() => router.back()}
              disabled={isLoading}
              className="rounded-md px-10 py-6"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isLoading}
              className="rounded-md px-10 py-6 bg-[#77AEE1] hover:bg-[#77AEE1]/80 shadow min-w-[200px]"
            >
              {isLoading && <Loader2 className="w-4 h-4 animate-spin mr-2" />}
              {isLoading ? "Adding..." : "Add Transit Exception"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
