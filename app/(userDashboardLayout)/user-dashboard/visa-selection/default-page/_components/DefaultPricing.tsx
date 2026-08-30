"use client";

import { Check, Crown, Loader } from "lucide-react";
import { motion, useInView, useMotionValue, useSpring, useTransform, animate } from "framer-motion";
import { useRef, useEffect, useState } from "react";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { useGetSubscriptionPlansQuery, useCreateCheckoutSessionMutation } from "@/lib/features/subscription/subscriptionApi";
import { useRouter } from "next/navigation";
import { useGetMeQuery } from "@/lib/features/user/userApi";
import { PaymentModal } from "@/components/landing_page/PaymentModal";

interface Plan {
    id: string;
    title: string;
    price: string;
    subtext: string;
    description: string;
    features: string[];
}

const defaultPlans: Plan[] = [
    {
        id: "1",
        title: "Per Trip Smart Plan",
        price: "$9.99",
        subtext: "",
        description: "This is for users who just need help for one specific trip.",
        features: [
            "Full visa requirement analysis",
            "Transit visa analysis",
            "Document checklist",
            "Unlimited trip analyses",
            "Multi-country route comparison",
            "Priority support",
        ],
    },
    {
        id: "2",
        title: "Monthly subscription",
        price: "$29.99",
        subtext: "/monthly",
        description: "This is for users who travels a lot throughout the month",
        features: [
            "Full visa requirement analysis",
            "Transit visa analysis",
            "Document checklist",
            "Unlimited trip analyses",
            "Multi-country route comparison",
            "Dedicated assistant",
        ],
    },
];

const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: { staggerChildren: 0.2 },
    },
};

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

// Smooth spring hover card
function PlanCard({ plan, index, isInView, onChoose, isSubscribing }: { plan: Plan; index: number; isInView: boolean; onChoose: (plan: Plan) => void; isSubscribing: boolean }) {
    const cardRef = useRef<HTMLDivElement>(null);

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

    return (
        <motion.div
            ref={cardRef}
            variants={cardVariants}
            style={{ y, boxShadow }}
            onMouseEnter={() => { rawY.set(-7); rawShadow.set(1); }}
            onMouseLeave={() => { rawY.set(0); rawShadow.set(0); }}
            className="flex flex-col justify-between w-84.75 h-130 bg-white border border-blue-50 rounded-2xl overflow-hidden cursor-pointer"
        >
            <div className="flex flex-col">
                {/* Blue Header Section */}
                <div className="bg-[#77AEE1] p-6 text-white h-30 flex flex-col justify-center">
                    <h3 className="text-[17px] font-medium mb-1">{plan.title}</h3>
                    <div className="flex items-baseline gap-1">
                        <motion.span
                            initial={{ opacity: 0, scale: 0.75 }}
                            animate={isInView ? { opacity: 1, scale: 1 } : {}}
                            transition={{
                                type: "spring",
                                stiffness: 180,
                                damping: 13,
                                delay: 0.5 + index * 0.15,
                            }}
                            className="text-3xl font-bold"
                        >
                            {plan.price}
                        </motion.span>
                        {plan.subtext && <span className="text-xs opacity-80">{plan.subtext}</span>}
                    </div>
                </div>

                {/* Content Section */}
                <div className="p-6">
                    <motion.p
                        initial={{ opacity: 0 }}
                        animate={isInView ? { opacity: 1 } : {}}
                        transition={{ duration: 0.5, delay: 0.45 + index * 0.1 }}
                        className="text-slate-500 text-[13px] mb-6 leading-snug h-10"
                    >
                        {plan.description}
                    </motion.p>

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
                                <span className="text-[13px] text-slate-700 font-medium">{feature}</span>
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
                    initial={{ opacity: 0, y: 10 }}
                    animate={isInView ? { opacity: 1, y: 0 } : {}}
                    onClick={() => onChoose(plan)}
                    disabled={isSubscribing}
                    className="w-full py-3.5 bg-[#77AEE1] text-white font-bold rounded-xl shadow-md text-sm flex items-center justify-center gap-2"
                >
                    {isSubscribing ? (
                        <>
                            <Loader className="w-4 h-4 animate-spin" />
                            Redirecting...
                        </>
                    ) : (
                        "Choose Plan"
                    )}
                </motion.button>
            </div>
        </motion.div>
    );
}

export default function DefaultPricing() {

    const ref = useRef<HTMLDivElement>(null);
    const isInView = useInView(ref, { once: true, margin: "-60px" });
    const [selectedPlan, setSelectedPlan] = useState<Plan | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const { data: plansData, isLoading, isError } = useGetSubscriptionPlansQuery();
    const [createCheckoutSession, { isLoading: isSubscribing }] = useCreateCheckoutSessionMutation();
    const { data: userData } = useGetMeQuery();
    const router = useRouter();

    const plans: Plan[] = plansData?.data?.length 
        ? plansData.data.map((p: any) => ({
            id: p.id,
            title: p.name,
            price: `$${p.price}`,
            subtext: p.billingPeriod === "MONTHLY" ? "/monthly" : "",
            description: p.description,
            features: Array.isArray(p.features) ? p.features : [],
        })) 
        : defaultPlans;

    const handleChoosePlan = async (plan: Plan) => {
        if (!userData) {
            toast.error("You are not logged in, please login");
            const currentPath = window.location.pathname + window.location.search + window.location.hash;
            const targetPath = currentPath.includes("#pricing") ? currentPath : `${window.location.pathname}${window.location.search}#pricing`;
            const callbackUrl = encodeURIComponent(targetPath);
            router.push(`/login?callbackUrl=${callbackUrl}`);
            return;
        }

        setSelectedPlan(plan);
        const toastId = toast.loading("Preparing checkout...");
        try {
            const response = await createCheckoutSession({ planId: plan.id }).unwrap();
            if (response.success && response.data) {
                toast.success("Redirecting to payment...", { id: toastId });
                window.location.href = response.data;
            } else {
                toast.error("Failed to create checkout session", { id: toastId });
            }
        } catch (error: any) {
            console.error("Checkout error:", error);
            toast.error(error?.data?.message || "Please login to subscribe", { id: toastId });
        }
    };

    useEffect(() => {
        const handleScroll = () => {
            if (window.location.hash === "#pricing" && ref.current) {
                // Small timeout to ensure layout is settled
                setTimeout(() => {
                    const targetPosition = ref.current!.offsetTop - 80;
                    animate(window.scrollY, targetPosition, {
                        type: "spring",
                        stiffness: 35,
                        damping: 20,
                        mass: 1.2,
                        onUpdate: (latest) => window.scrollTo(0, latest)
                    });
                }, 100);
            }
        };

        handleScroll();
        window.addEventListener("hashchange", handleScroll);
        return () => window.removeEventListener("hashchange", handleScroll);
    }, []);

    return (
        <div id="pricing" ref={ref} className="flex flex-col items-center font-sans">
            {/* Main Container */}
            <motion.div
                initial={{ opacity: 0, y: 28 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] as const, delay: 0.1 }}
                className="flex flex-col justify-center items-start gap-6 p-6 bg-white shadow-[0_10px_15px_-3px_rgba(119,174,225,0.05),0_4px_6px_-4px_rgba(119,174,225,0.05)] border-[#77AEE1]/20 border-[0.871px] rounded-[8.707px] max-w-fit mx-auto"
            >
                {/* Header inside card */}
                <div className="w-full">
                    <div className="flex items-center gap-2 mb-1">
                        <motion.div
                            initial={{ scale: 0, rotate: -30 }}
                            animate={isInView ? { scale: 1, rotate: 0 } : {}}
                            transition={{ type: "spring", stiffness: 240, damping: 14, delay: 0.3 }}
                        >
                            <Crown className="text-amber-400 w-5 h-5" fill="currentColor" />
                        </motion.div>
                        <motion.h2
                            initial={{ opacity: 0, x: -12 }}
                            animate={isInView ? { opacity: 1, x: 0 } : {}}
                            transition={{ duration: 0.45, ease: "easeOut", delay: 0.38 }}
                            className="text-xl font-bold text-slate-900"
                        >
                            Upgrade to Pro
                        </motion.h2>
                    </div>
                    <motion.p
                        initial={{ opacity: 0 }}
                        animate={isInView ? { opacity: 1 } : {}}
                        transition={{ duration: 0.45, delay: 0.48 }}
                        className="text-slate-400 text-[11px] mb-6"
                    >
                        Unlock powerful features to make your travel planning seamless
                    </motion.p>
                </div>

                {/* Plans Flexbox */}
                <motion.div
                    variants={containerVariants}
                    initial="hidden"
                    animate={isInView ? "visible" : "hidden"}
                    className="flex flex-wrap gap-6 justify-center min-h-[400px]"
                >
                    {isLoading ? (
                        <div className="flex items-center justify-center w-full min-h-[400px]">
                            <Loader2 className="w-10 h-10 animate-spin text-[#77AEE1]" />
                        </div>
                    ) : (
                        plans.map((plan, index) => (
                            <PlanCard 
                                key={index} 
                                plan={plan} 
                                index={index} 
                                isInView={isInView} 
                                onChoose={handleChoosePlan} 
                                isSubscribing={isSubscribing && selectedPlan?.id === plan.id}
                            />
                        ))
                    )}
                </motion.div>
            </motion.div>

            {/* Payment Modal */}
            <PaymentModal
                planTitle={selectedPlan?.title || ""}
                planPrice={selectedPlan?.price || ""}
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
            />
        </div>
    );
}