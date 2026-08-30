import { X, Loader2 } from 'lucide-react';
import { createPortal } from 'react-dom';
import { useEffect, useState } from 'react';
import { useUpdateSubscriptionPlanMutation } from '@/lib/features/subscription/subscriptionApi';
import { toast } from 'sonner';
import { useForm } from 'react-hook-form';

interface PricingPlan {
    id: string;
    name: string;
    price: number;
    period: string;
    description: string;
    features: { text: string }[];
    isPopular?: boolean;
}

interface EditPlanModalProps {
    isOpen: boolean;
    onClose: () => void;
    plan: PricingPlan | null;
}

interface PlanFormValues {
    name: string;
    price: string;
    description: string;
}

const EditPlanModal: React.FC<EditPlanModalProps> = ({ isOpen, onClose, plan }) => {
    const [mounted, setMounted] = useState(false);
    const [updatePlan, { isLoading }] = useUpdateSubscriptionPlanMutation();

    const { register, handleSubmit, reset } = useForm<PlanFormValues>();

    useEffect(() => {
        setMounted(true);
        if (plan) {
            reset({
                name: plan.name,
                price: plan.price.toString(),
                description: plan.description,
            });
        }
    }, [plan, reset]);

    if (!isOpen || !mounted) return null;

    const onSubmit = async (data: PlanFormValues) => {
        if (!plan?.id) return;

        try {
            const res = await updatePlan({
                id: plan.id,
                data: {
                    name: data.name,
                    price: Number(data.price),
                    description: data.description,
                },
            }).unwrap();

            if (res.success) {
                toast.success(res.message || 'Plan updated successfully!');
                onClose();
            }
        } catch (error: any) {
            toast.error(error?.data?.message || 'Failed to update plan');
        }
    };

    return createPortal(
        <div className="fixed inset-0 z-9999 flex items-center justify-center bg-black/60 px-4 backdrop-blur-sm">
            {/* Modal Container */}
            <form onSubmit={handleSubmit(onSubmit)} className="w-full max-w-2xl rounded-xl bg-white shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200">

                {/* Header */}
                <div className="flex items-center justify-between border-b border-gray-100 px-8 py-5 bg-slate-50/50">
                    <h2 className="text-2xl font-semibold text-gray-800">Edit Plan</h2>
                    <button
                        type="button"
                        onClick={onClose}
                        className="text-gray-400 transition-colors hover:text-gray-600 p-1 hover:bg-gray-100 rounded-full"
                    >
                        <X size={24} />
                    </button>
                </div>

                {/* Form Body */}
                <div className="p-8 space-y-6">

                    {/* Plan Name */}
                    <div className="space-y-2">
                        <label className="text-[15px] font-medium text-gray-600">
                            Plan Name <span className="text-red-500">*</span>
                        </label>
                        <input
                            {...register("name", { required: true })}
                            type="text"
                            className="w-full rounded-lg border border-gray-200 px-4 py-3 text-gray-800 outline-none focus:border-blue-400 focus:ring-1 focus:ring-blue-400 transition-all bg-white"
                        />
                    </div>

                    {/* Price */}
                    <div className="space-y-2">
                        <label className="text-[15px] font-medium text-gray-600">
                            Price <span className="text-red-500">*</span>
                        </label>
                        <div className="relative">
                            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 font-medium">$</span>
                            <input
                                {...register("price", { required: true })}
                                type="number"
                                step="0.01"
                                className="w-full rounded-lg border border-gray-200 pl-8 pr-4 py-3 text-gray-800 outline-none focus:border-blue-400 focus:ring-1 focus:ring-blue-400 transition-all bg-white"
                            />
                        </div>
                    </div>

                    {/* Description */}
                    <div className="space-y-2">
                        <label className="text-[15px] font-medium text-gray-600">
                            Description
                        </label>
                        <textarea
                            {...register("description")}
                            rows={4}
                            className="w-full resize-none rounded-lg border border-gray-200 px-4 py-3 text-gray-800 outline-none focus:border-blue-400 focus:ring-1 focus:ring-blue-400 transition-all bg-white"
                        />
                    </div>
                </div>

                {/* Footer Buttons */}
                <div className="flex gap-4 p-8 pt-2 bg-slate-50/50 border-t border-gray-100">
                    <button
                        type="button"
                        onClick={onClose}
                        className="flex-1 rounded-xl border border-gray-300 py-3.5 font-medium text-gray-600 transition-all hover:bg-white hover:border-gray-400 active:scale-95"
                    >
                        Cancel
                    </button>
                    <button
                        type="submit"
                        disabled={isLoading}
                        className="flex-1 rounded-xl bg-[#77AEE1] py-3.5 font-medium text-white transition-all hover:bg-[#669ed0] disabled:opacity-70 shadow-sm flex items-center justify-center gap-2 active:scale-95"
                    >
                        {isLoading && <Loader2 className="w-4 h-4 animate-spin" />}
                        {isLoading ? "Updating..." : "Update Plan"}
                    </button>
                </div>
            </form>
        </div>,
        document.body
    );
};

export default EditPlanModal;