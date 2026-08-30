"use client";

import { useState, use, useEffect } from "react";
import {
    X,
    Globe,
    Plane,
    Briefcase,
    Clock,
    Plus,
    Minus,
    Loader2,
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
import { toast } from "sonner";
import { 
    useGetSingleCountryPolicyQuery, 
    useUpdateCountryPolicyMutation 
} from "@/lib/features/country-policy/countryPolicyApi";

const CountryVisaExceptionTableEditPage = ({ params }: { params: Promise<{ id: string }> }) => {
    const router = useRouter();
    const resolvedParams = use(params);
    const id = resolvedParams.id;

    const { data: response, isLoading: isFetching } = useGetSingleCountryPolicyQuery(id);
    const [updateCountryPolicy, { isLoading: isUpdating }] = useUpdateCountryPolicyMutation();

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

    const [showAdditional, setShowAdditional] = useState(true);

    useEffect(() => {
        if (response?.data) {
            const data = response.data;
            setFormData({
                travelerCountry: data.travelerCountry || "",
                destinationCountry: data.destinationCountry || "",
                travelPurpose: data.travelPurpose || "",
                visaOutcome: data.visaOutcome || "VISA_REQUIRED",
                status: data.status || "ACTIVE",
                visaType: data.visaType || "",
                maxStayDuration: data.maxStayDuration || "",
                notesConditions: data.notesConditions || "",
            });
        }
    }, [response]);

    if (isFetching) {
        return (
            <div className="flex flex-col items-center justify-center min-h-screen gap-4">
                <Loader2 className="w-10 h-10 animate-spin text-[#77AEE1]" />
                <p className="text-gray-500 font-medium">Loading policy data...</p>
            </div>
        );
    }

    if (!response?.data) {
        return (
            <div className="flex flex-col items-center justify-center min-h-screen gap-4">
                <h2 className="text-2xl font-bold text-gray-800">Exception Not Found</h2>
                <Button onClick={() => router.push("/dashboard/country-visa-exception")}>Back to List</Button>
            </div>
        );
    }

    const outcomes = [
        { id: "VISA_REQUIRED", label: "Visa Required", desc: "Standard visa needed" },
        { id: "VISA_NOT_REQUIRED", label: "Visa Free", desc: "No visa required" },
        { id: "SPECIAL_CASE", label: "Special Case", desc: "e-Visa / ETA / VOA" },
    ];

    const handleSubmit = async () => {
        try {
            const res = await updateCountryPolicy({ id, data: formData }).unwrap();
            if (res.success) {
                toast.success(res.message || "Visa exception updated successfully!");
                router.push("/dashboard/country-visa-exception");
            }
        } catch (error: any) {
            toast.error(error?.data?.message || "Failed to update exception");
        }
    };

    const handleChange = (field: string, value: string) => {
        setFormData((prev) => ({ ...prev, [field]: value }));
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50 p-6 md:p-10">
            <div className="max-w-4xl mx-auto rounded-xl bg-white shadow-[0_25px_70px_rgba(0,0,0,0.06)] border border-gray-100 overflow-hidden">

                {/* Header */}
                <div className="flex items-center justify-center px-8 py-6 relative">
                    <h2 className="text-3xl font-bold text-gray-800 tracking-tight">
                        Edit Country & Exception
                    </h2>
                    <button
                        onClick={() => router.back()}
                        className="absolute right-8 p-2 rounded-full hover:bg-gray-100 transition"
                    >
                        <X size={24} className="text-gray-400" />
                    </button>
                </div>

                {/* Body */}
                <div className="p-8 space-y-8">

                    {/* Input block */}
                    <div className="space-y-3">
                        <Label className="font-semibold text-gray-700">Traveler Country</Label>
                        <div className="relative group">
                            <Globe className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-blue-500 transition" />
                            <Input
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

                    {/* Status Cards */}
                    <div className="space-y-3 w-full">
                        <Label className="font-semibold text-gray-700">Status</Label>
                        <div className="grid grid-cols-2 gap-4">
                            {[
                                { id: "ACTIVE", label: "Active", desc: "Currently in effect" },
                                { id: "INACTIVE", label: "Inactive", desc: "Disabled for now" },
                            ].map((s) => (
                                <button
                                    key={s.id}
                                    onClick={() => handleChange("status", s.id)}
                                    className={`p-5 rounded-xl border text-left transition-all ${formData.status === s.id
                                            ? "border-blue-500 bg-blue-50 shadow-sm"
                                            : "border-gray-200 bg-white hover:border-gray-300"
                                        }`}
                                >
                                    <p className="font-semibold text-gray-800">{s.label}</p>
                                    <p className="text-sm text-gray-500">{s.desc}</p>
                                </button>
                            ))}
                        </div>
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
                        disabled={isUpdating}
                    >
                        Cancel
                    </Button>
                    <Button
                        onClick={handleSubmit}
                        className="rounded-md px-10 py-6 bg-[#77AEE1] hover:bg-[#77AEE1]/80 shadow"
                        disabled={isUpdating}
                    >
                        {isUpdating ? "Updating..." : "Update Exception"}
                    </Button>
                </div>
            </div>
        </div>
    );
};

export default CountryVisaExceptionTableEditPage;