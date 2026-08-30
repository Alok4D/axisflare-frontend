"use client";

import { Check, Pencil, Loader, Edit } from 'lucide-react';
import { useGetSubscriptionPlansQuery, useDeleteSubscriptionPlanMutation } from '@/lib/features/subscription/subscriptionApi';
import { toast } from 'sonner';
import EditPlanModal from './components/EditPlanModal';
import { useState } from 'react';

interface PricingPlan {
    id: string;
    name: string;
    price: number;
    period: string;
    description: string;
    features: { text: string }[];
    isPopular?: boolean;
}

const PricingCard: React.FC<{ plan: PricingPlan; onEdit: (plan: PricingPlan) => void; onDelete: (id: string) => void; isDeleting: boolean }> = ({ plan, onEdit, onDelete }) => {
    return (
        <div className="flex flex-col bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 border border-slate-100">
            {/* Blue Header Section */}
            <div className="bg-[#77AEE1] p-6 text-white h-32 flex flex-col justify-center relative">
                {/* Popular Badge */}
                <h3 className="text-[17px] font-medium mb-1">{plan.name}</h3>
                <div className="flex items-baseline gap-1">
                    <span className="text-4xl font-bold">
                        ${plan.price}
                    </span>
                    <span className="text-xs opacity-80">{plan.period}</span>
                </div>
            </div>

            {/* Content Section */}
            <div className="p-6 flex-1">
                <p className="text-slate-500 text-[13px] mb-6 leading-relaxed h-10">
                    {plan.description}
                </p>

                {/* Features List */}
                <div className="space-y-4">
                    {plan.features.map((feature, fIndex) => (
                        <div key={fIndex} className="flex items-center gap-3">
                            <div className="w-5 h-5 rounded-full border border-[#77AEE1]/30 flex items-center justify-center shrink-0 bg-[#77AEE1]/5">
                                <Check className="text-[#77AEE1] w-3 h-3" strokeWidth={4} />
                            </div>
                            <span className="text-[13px] text-slate-700 font-medium">{feature.text}</span>
                        </div>
                    ))}
                </div>
            </div>

            {/* Action Buttons */}
            <div className="p-6 pt-0 mt-auto">
                <div className='flex gap-2.5'>
                    <button
                        onClick={() => onEdit(plan)}
                        className="w-full py-3 px-4 bg-[#77AEE1] hover:bg-[#5a9fd4] text-black font-medium rounded-md text-[13px] flex items-center justify-center gap-2 text-[16px] transition-colors"
                    >
                        Edit Plan Information
                        <Edit className="w-3.5 h-3.5" />
                    </button>
                </div>
            </div>
        </div>
    );
};

const PricingSection: React.FC = () => {
    const { data: plansResponse, isLoading, isError } = useGetSubscriptionPlansQuery();
    const [deletePlan, { isLoading: isDeleting }] = useDeleteSubscriptionPlanMutation();
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [selectedPlan, setSelectedPlan] = useState<PricingPlan | null>(null);

    const handleEdit = (plan: PricingPlan) => {
        setSelectedPlan(plan);
        setIsEditModalOpen(true);
    };

    const handleDelete = async (id: string) => {
        try {
            await deletePlan(id).unwrap();
            toast.success('Plan deleted successfully');
        } catch (err: any) {
            toast.error(err?.data?.message || 'Failed to delete plan');
        }
    };

    // Helper to format period
    const formatPeriod = (period: string) => {
        switch (period) {
            case 'MONTHLY': return '/month';
            case 'ONE_TIME': return '';
            default: return '';
        }
    };

    // Map API data to UI structure
    const pricingPlans: PricingPlan[] = plansResponse?.data?.map(plan => ({
        id: plan.id,
        name: plan.name,
        price: plan.price,
        period: formatPeriod(plan.billingPeriod),
        description: plan.description,
        features: plan.features.map(f => ({ text: f })),
        isPopular: plan.billingPeriod === 'MONTHLY'
    })) || [];

    if (isError) {
        toast.error('Failed to load subscription plans');
    }

    return (
        <div className="min-h-screen bg-gray-50/50 py-12 px-4 font-sans">
            <div className="max-w-7xl mx-auto">
                {/* Page Header */}
                <div className="text-center mb-16 max-w-3xl mx-auto space-y-4">
                    <h1 className="text-4xl md:text-6xl font-black text-[#1E293B] tracking-tight leading-tight">
                        Powerful Plans for <br className="hidden md:block" />
                        <span className="bg-linear-to-r from-[#FF7A00] to-[#FFA500] bg-clip-text text-transparent">
                            Users
                        </span>
                    </h1>
                    <p className="text-[#64748B] text-lg md:text-xl font-medium max-w-2xl mx-auto leading-relaxed">
                        Choose the perfect roadmap for your journey. Start <span className="text-[#1E293B] font-bold">Free</span> or unlock 
                        <span className="text-[#77AEE1] font-bold"> Advanced Admin Controls</span> and premium capabilities.
                    </p>
                </div>

                {isLoading ? (
                    <div className="flex flex-col items-center justify-center py-20">
                        <Loader className="w-10 h-10 text-[#77AEE1] animate-spin mb-4" />
                        <p className="text-gray-500">Loading subscription plans...</p>
                    </div>
                ) : pricingPlans.length === 0 ? (
                    <div className="text-center py-20">
                        <p className="text-gray-500">No subscription plans found. Create one to get started.</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 items-stretch">
                        {pricingPlans.map((plan) => (
                            <PricingCard
                                key={plan.id}
                                plan={plan}
                                onEdit={handleEdit}
                                onDelete={handleDelete}
                                isDeleting={isDeleting}
                            />
                        ))}
                    </div>
                )}

                <EditPlanModal 
                    isOpen={isEditModalOpen} 
                    onClose={() => setIsEditModalOpen(false)} 
                    plan={selectedPlan}
                />
            </div>
        </div>
    );
};

export default PricingSection;
