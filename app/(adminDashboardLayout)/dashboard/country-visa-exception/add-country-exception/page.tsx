"use client";

import { useState } from "react";
import {
    X,
    Globe,
    Plane,
    Briefcase,
    Clock,
    Plus,
    Minus,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { useCreateCountryPolicyMutation } from "@/lib/features/country-policy/countryPolicyApi";
import { toast } from "sonner";

const AddCountryExceptionPage = () => {
    const router = useRouter();
    const [createCountryPolicy, { isLoading }] = useCreateCountryPolicyMutation();

    const [formData, setFormData] = useState({
        travelerCountry: "",
        destinationCountry: "",
        travelPurpose: "",
        visaOutcome: "VISA_REQUIRED",
        status: "ACTIVE",
        visaType: "",
        maxStayDuration: "",
        notesConditions: "",
    });

    const [showAdditional, setShowAdditional] = useState(false);

    const outcomes = [
        { id: "VISA_REQUIRED", label: "Visa Required", desc: "Standard visa needed" },
        { id: "VISA_NOT_REQUIRED", label: "Visa Free", desc: "No visa required" },
        { id: "SPECIAL_CASE", label: "Special Case", desc: "e-Visa / ETA / VOA" },
    ];

    const handleSubmit = async () => {
        if (!formData.travelerCountry || !formData.destinationCountry || !formData.travelPurpose) {
            toast.error("Please fill in all required fields");
            return;
        }

        try {
            const res = await createCountryPolicy(formData).unwrap();
            if (res.success) {
                toast.success(res.message || "Country policy created successfully");
                router.push("/dashboard/country-visa-exception");
            }
        } catch (error: any) {
            toast.error(error?.data?.message || "Failed to create country policy");
        }
    };

    const handleChange = (field: string, value: string) => {
        setFormData((prev) => ({ ...prev, [field]: value }));
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50 p-6 md:p-10">
            <div className="max-w-4xl mx-auto rounded-xl bg-white shadow-[0_25px_70px_rgba(0,0,0,0.06)] border border-gray-100 overflow-hidden">

                {/* Header */}
                <div className="flex items-center justify-center px-8 py-6">
                    <h2 className="text-3xl font-bold text-gray-800 tracking-tight">
                        Add Country & Exception to Default Policy
                    </h2>
                </div>

                {/* Body */}
                <div className="p-8 space-y-8">

                    {/* Input block */}
                    <div className="space-y-3">
                        <Label className="font-semibold text-gray-700">Country Name (Traveler)</Label>
                        <div className="relative group">
                            <Globe className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-blue-500 transition" />
                            <Input
                                placeholder="Enter traveler country"
                                value={formData.travelerCountry}
                                onChange={(e) => handleChange("travelerCountry", e.target.value)}
                                className="pl-12 h-14 rounded-xl border-gray-200 bg-gray-50 focus:bg-white focus:ring-2 focus:ring-blue-100"
                            />
                        </div>
                    </div>

                    <div className="space-y-3">
                        <Label className="font-semibold text-gray-700">Travel Purpose</Label>
                        <div className="relative group">
                            <Briefcase className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-blue-500 transition" />
                            <Input
                                placeholder="Tourism, Business, Student..."
                                value={formData.travelPurpose}
                                onChange={(e) => handleChange("travelPurpose", e.target.value)}
                                className="pl-12 h-14 rounded-xl border-gray-200 bg-gray-50 focus:bg-white focus:ring-2 focus:ring-blue-100"
                            />
                        </div>
                    </div>

                    {/* Destination */}
                    <div className="space-y-3 w-full">
                        <Label className="font-semibold text-gray-700">Destination Country</Label>
                        <Select
                            value={formData.destinationCountry}
                            onValueChange={(val) => handleChange("destinationCountry", val)}
                        >
                            <SelectTrigger className="h-14 rounded-xl border-gray-200 bg-gray-50 w-full">
                                <SelectValue placeholder="Select country" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="USA">United States</SelectItem>
                                <SelectItem value="UK">United Kingdom</SelectItem>
                                <SelectItem value="JAPAN">Japan</SelectItem>
                                <SelectItem value="INDIA">India</SelectItem>
                                <SelectItem value="BANGLADESH">Bangladesh</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    {/* Visa Cards */}
                    <div className="space-y-3 w-full">
                        <Label className="font-semibold text-gray-700">Visa Outcome</Label>
                        <div className="grid gap-4">
                            {outcomes.map((o) => (
                                <button
                                    key={o.id}
                                    onClick={() => handleChange("visaOutcome", o.id)}
                                    className={`p-5 rounded-xl border text-left transition-all ${formData.visaOutcome === o.id
                                        ? "border-blue-500 bg-blue-50 shadow-sm"
                                        : "border-gray-200 bg-white hover:border-gray-300"
                                        }`}
                                >
                                    <p className="font-semibold text-gray-800">{o.label}</p>
                                    <p className="text-sm text-gray-500">{o.desc}</p>
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Status */}
                    <div className="space-y-3">
                        <Label className="font-semibold text-gray-700">Status</Label>
                        <Select
                            value={formData.status}
                            onValueChange={(val) => handleChange("status", val)}
                        >
                            <SelectTrigger className="h-14 rounded-xl border-gray-200 bg-gray-50 w-full">
                                <SelectValue placeholder="Select status" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="ACTIVE">Active</SelectItem>
                                <SelectItem value="INACTIVE">Inactive</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    {/* Toggle */}
                    <button
                        type="button"
                        onClick={() => setShowAdditional(!showAdditional)}
                        className="flex items-center gap-2 border rounded-xl p-2 text-[#00439B] hover:text-[#00439B]/80 font-semibold text-lg transition-all active:scale-95 py-2 group"
                    >
                        {showAdditional ? (
                            <div className="flex items-center gap-2">
                                <Minus size={20} className="stroke-[3px]" />
                                <span>Hide additional details (optional)</span>
                            </div>
                        ) : (
                            <div className="flex items-center gap-2">
                                <Plus size={20} className="stroke-[3px]" />
                                <span>Show additional details (optional)</span>
                            </div>
                        )}
                    </button>

                    {showAdditional && (
                        <div className="space-y-6 animate-in fade-in slide-in-from-top-4">

                            <div className="space-y-3">
                                <Label className="font-semibold">Visa Type</Label>
                                <div className="relative">
                                    <Plane className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400" />
                                    <Input
                                        className="pl-12 h-14 rounded-xl"
                                        placeholder="Student visa, e-Visa..."
                                        value={formData.visaType}
                                        onChange={(e) => handleChange("visaType", e.target.value)}
                                    />
                                </div>
                            </div>

                            <div className="space-y-3">
                                <Label className="font-semibold">Stay Duration</Label>
                                <div className="relative">
                                    <Clock className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400" />
                                    <Input
                                        className="pl-12 h-14 rounded-xl"
                                        placeholder="90 days, 6 months..."
                                        value={formData.maxStayDuration}
                                        onChange={(e) => handleChange("maxStayDuration", e.target.value)}
                                    />
                                </div>
                            </div>

                            <div className="space-y-3">
                                <Label className="font-semibold">Notes</Label>
                                <Textarea
                                    className="rounded-xl min-h-[140px]"
                                    value={formData.notesConditions}
                                    onChange={(e) => handleChange("notesConditions", e.target.value)}
                                />
                            </div>
                        </div>
                    )}
                </div>

                {/* Footer */}
                <div className="flex justify-end gap-4 px-8 py-6 bg-gray-50 border-t">
                    <Button
                        variant="outline"
                        onClick={() => router.back()}
                        className="rounded-md px-10 py-6"
                        disabled={isLoading}
                    >
                        Cancel
                    </Button>
                    <Button
                        onClick={handleSubmit}
                        className="rounded-md px-10 py-6 bg-[#77AEE1] hover:bg-[#77AEE1]/80 shadow"
                        disabled={isLoading}
                    >
                        {isLoading ? "Saving..." : "Save Policy"}
                    </Button>
                </div>
            </div>
        </div>
    );
};

export default AddCountryExceptionPage;