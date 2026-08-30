import { useRef, useState } from 'react';
import { Check, Pencil, Loader, Edit } from 'lucide-react';
import { useGetSubscriptionPlansQuery, useDeleteSubscriptionPlanMutation } from '@/lib/features/subscription/subscriptionApi';
import { toast } from 'sonner';
import EditPlanModal from './components/EditPlanModal';
import { motion, useInView, useMotionValue, useSpring, useTransform } from "framer-motion";

interface PricingPlan {
    id: string;
    name: string;
    price: number;
    period: string;
    description: string;
    features: { text: string }[];
    isPopular?: boolean;
}

const PricingCard: React.FC<{ plan: PricingPlan; onEdit: (plan: PricingPlan) => void; onDelete: (id: string) => void; isDeleting: boolean }> = ({ plan, onEdit }) => {
    const cardRef = useRef<HTMLDivElement>(null);
    const isInView = useInView(cardRef, { once: true });

    const rawY = useMotionValue(0);
    const rawShadow = useMotionValue(0);

    const y = useSpring(rawY, { stiffness: 120, damping: 18, mass: 0.6 });
    const shadowBlur = useSpring(rawShadow, { stiffness: 120, damping: 18, mass: 0.6 });
    const boxShadow = useTransform(
        shadowBlur,
        [0, 1],
        [
            "0 4px 12px -2px rgba(119,174,225,0.08)",
            "0 24px 40px -8px rgba(119,174,225,0.22)",
        ]
    );

    const cardVariants = {
        hidden: { opacity: 0, y: 40, scale: 0.96 },
        visible: {
            opacity: 1,
            y: 0,
            scale: 1,
            transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] as const },
        },
    };

    const featureVariants = {
        hidden: { opacity: 0, x: -16 },
        visible: (i: number) => ({
            opacity: 1,
            x: 0,
            transition: { duration: 0.38, ease: [0.22, 1, 0.36, 1] as const, delay: i * 0.07 },
        }),
    };

    return (
        <motion.div
            ref={cardRef}
            variants={cardVariants}
            initial="hidden"
            animate={isInView ? "visible" : "hidden"}
            style={{ y, boxShadow }}
            onMouseEnter={() => { rawY.set(-7); rawShadow.set(1); }}
            onMouseLeave={() => { rawY.set(0); rawShadow.set(0); }}
            className="flex flex-col justify-between w-84.75 h-130 bg-white border border-blue-50 rounded-2xl overflow-hidden cursor-pointer"
        >
            <div className="flex flex-col">
                {/* Blue Header Section */}
                <div className="bg-[#77AEE1] p-6 text-white h-30 flex flex-col justify-center">
                    <div className="flex items-center gap-2 mb-1">
                        <h3 className="text-[17px] font-medium">{plan.name}</h3>
                        {plan.period === "/year" && (
                            <span className="bg-amber-400 text-white px-2 py-0.5 rounded-full text-[9px] font-black uppercase">Popular</span>
                        )}
                    </div>
                    <div className="flex items-baseline gap-1">
                        <span className="text-3xl font-bold">
                            ${plan.price}
                        </span>
                        {plan.period && <span className="text-xs opacity-80">{plan.period}</span>}
                    </div>
                </div>

                {/* Content Section */}
                <div className="p-6">
                    <p className="text-slate-500 text-[13px] mb-6 leading-snug h-10">
                        {plan.description}
                    </p>

                    {/* Features List */}
                    <div className="space-y-3">
                        {plan.features.map((feature, fIndex) => (
                            <motion.div
                                key={fIndex}
                                custom={fIndex}
                                variants={featureVariants}
                                initial="hidden"
                                animate={isInView ? "visible" : "hidden"}
                                className="flex items-center gap-3"
                            >
                                <motion.div
                                    initial={{ scale: 0, opacity: 0 }}
                                    animate={isInView ? { scale: 1, opacity: 1 } : {}}
                                    transition={{
                                        type: "spring",
                                        stiffness: 300,
                                        damping: 14,
                                        delay: 0.4 + fIndex * 0.07,
                                    }}
                                    className="w-4.5 h-4.5 rounded-full border border-[#77AEE1] flex items-center justify-center shrink-0"
                                >
                                    <Check className="text-[#77AEE1] w-2.5 h-2.5" strokeWidth={4} />
                                </motion.div>
                                <span className="text-[13px] text-slate-700 font-medium">{feature.text}</span>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Action Button */}
            <div className="p-6 pt-0">
                <motion.button
                    whileHover={{ backgroundColor: "#5a9fd4", scale: 1.02 }}
                    whileTap={{ scale: 0.97 }}
                    transition={{ type: "spring", stiffness: 300, damping: 20 }}
                    onClick={() => onEdit(plan)}
                    className="w-full py-3.5 bg-[#77AEE1] text-white font-bold rounded-xl shadow-md text-sm flex items-center justify-center gap-2"
                >
                    Edit Plan Information
                    <Edit className="w-4 h-4" />
                </motion.button>
            </div>
        </motion.div>
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
        <div className="p-12 bg-[#F9FAFB] min-h-screen space-y-10 font-sans">
            <div className="max-w-7xl mx-auto space-y-10">
                {/* Page Header */}
                <div className="space-y-2">
                    <h1 className="text-3xl font-bold text-[#1C1F37]">
                        Subscription Management
                    </h1>
                    <p className="text-[#999999] text-sm font-normal">
                        Configure and manage pricing tiers, billing periods, and available features for your users.
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
                    <div className="flex flex-wrap gap-8 justify-start min-h-[400px]">
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
