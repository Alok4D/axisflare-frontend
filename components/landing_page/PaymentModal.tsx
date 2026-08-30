"use client";

import { useState } from "react";
import {
    Dialog,
    DialogContent
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue
} from "@/components/ui/select";
import { ArrowLeft, CreditCard } from "lucide-react";
import { toast } from "sonner";

interface PaymentModalProps {
    planTitle: string;
    planPrice: string;
    isOpen: boolean;
    onClose: () => void;
}

export function PaymentModal({ planTitle, isOpen, onClose }: PaymentModalProps) {
    const [isProcessing, setIsProcessing] = useState(false);

    const handlePay = async () => {
        setIsProcessing(true);
        // Simulate payment processing
        await new Promise((resolve) => setTimeout(resolve, 2000));
        setIsProcessing(false);
        toast.success(`Payment successful for ${planTitle}!`);
        onClose();
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-120 p-0 overflow-hidden bg-white border-none shadow-2xl rounded-2xl">
                <div className="p-8">
                    {/* Back Button */}
                    <button
                        onClick={onClose}
                        className="flex items-center gap-2 text-slate-500 hover:text-slate-800 transition-colors mb-6 text-[13px] font-medium"
                    >
                        <ArrowLeft className="w-4 h-4" />
                        Back
                    </button>

                    <div className="space-y-6">
                        {/* Email Section */}
                        <div className="space-y-2">
                            <Label htmlFor="email" className="text-[13px] font-medium text-slate-600">Email</Label>
                            <Input
                                id="email"
                                type="email"
                                placeholder="alex@example.com"
                                className="h-12 border-slate-200 focus:border-[#77AEE1]/50 focus:ring-[#77AEE1]/20 rounded-xl"
                            />
                        </div>

                        {/* Card Information Section */}
                        <div className="space-y-2">
                            <Label className="text-[13px] font-medium text-slate-600">Card information</Label>
                            <div className="border border-slate-200 rounded-xl overflow-hidden focus-within:ring-2 focus-within:ring-[#77AEE1]/20 focus-within:border-[#77AEE1]/50 transition-all">
                                <div className="relative">
                                    <Input
                                        placeholder="1234 1234 1234 1234"
                                        className="h-12 border-none rounded-none focus-visible:ring-0 px-4"
                                    />
                                    <div className="absolute right-4 top-1/2 -translate-y-1/2 flex items-center gap-1.5 grayscale-0">
                                        {/* Visa */}
                                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="17" viewBox="0 0 27 19" fill="none">
                                            <rect x="0.25" y="0.25" width="26.1359" height="18.0789" rx="1.71491" fill="white" stroke="#E5E5E5" stroke-width="0.5" />
                                            <path d="M11.4681 12.2797H10.0186L10.9252 6.67383H12.3746L11.4681 12.2797Z" fill="#142EBD" />
                                            <path d="M16.7222 6.81093C16.4363 6.6975 15.9828 6.57227 15.4221 6.57227C13.9906 6.57227 12.9826 7.33558 12.9764 8.4269C12.9645 9.23207 13.6981 9.67928 14.2468 9.94775C14.8076 10.2221 14.9982 10.4011 14.9982 10.6457C14.9925 11.0212 14.5451 11.1944 14.1278 11.1944C13.549 11.1944 13.239 11.1051 12.7677 10.8962L12.5769 10.8066L12.374 12.065C12.714 12.2199 13.3403 12.3573 13.9906 12.3633C15.5116 12.3633 16.5017 11.6118 16.5135 10.4489C16.5193 9.81071 16.1319 9.32172 15.2968 8.92215C14.7898 8.66565 14.4793 8.49269 14.4793 8.23025C14.4852 7.99166 14.7419 7.74729 15.3142 7.74729C15.7854 7.73532 16.1316 7.84859 16.3939 7.96193L16.525 8.02146L16.7222 6.81093Z" fill="#142EBD" />
                                            <path d="M18.6489 10.2938C18.7683 9.97172 19.2276 8.72528 19.2276 8.72528C19.2216 8.73725 19.3467 8.39728 19.4183 8.18858L19.5196 8.67162C19.5196 8.67162 19.7941 10.0135 19.8537 10.2938C19.6272 10.2938 18.9352 10.2938 18.6489 10.2938ZM20.4381 6.67383H19.3169C18.9712 6.67383 18.7085 6.77513 18.5593 7.13895L16.4062 12.2797H17.9272C17.9272 12.2797 18.1776 11.5878 18.2314 11.4387C18.3983 11.4387 19.8778 11.4387 20.0925 11.4387C20.1341 11.6356 20.2654 12.2797 20.2654 12.2797H21.6075L20.4381 6.67383Z" fill="#142EBD" />
                                            <path d="M8.80724 6.67383L7.38769 10.4965L7.23257 9.72124C6.97012 8.82666 6.14704 7.85471 5.22852 7.37144L6.52877 12.2738H8.0616L10.34 6.67383H8.80724Z" fill="#142EBD" />
                                            <path d="M6.06985 6.67383H3.73773L3.71387 6.7871C5.53307 7.2523 6.7379 8.37366 7.2329 9.72148L6.72593 7.14506C6.64246 6.78702 6.38596 6.68564 6.06985 6.67383Z" fill="#142EBD" />
                                        </svg>
                                        {/* Mastercard */}
                                        <svg xmlns="http://www.w3.org/2000/svg" width="22" height="15" viewBox="0 0 26 18" fill="none">
                                            <rect width="25.6359" height="17.5789" rx="1.46491" fill="black" />
                                            <path d="M16.2432 3.66211C19.0033 3.66227 21.241 5.92566 21.2412 8.71777C21.2412 11.5101 19.0034 13.7743 16.2432 13.7744C15.0053 13.7744 13.873 13.3184 13 12.5645C12.1272 13.3179 10.9961 13.7744 9.75879 13.7744C6.99844 13.7744 4.76074 11.5102 4.76074 8.71777C4.76099 5.92558 6.99859 3.66214 9.75879 3.66211C10.9959 3.66211 12.1272 4.11789 13 4.87109C13.8729 4.11738 15.0056 3.66211 16.2432 3.66211Z" fill="#ED0006" />
                                            <path d="M16.2432 3.66211C19.0033 3.66221 21.241 5.92562 21.2412 8.71777C21.2412 11.5101 19.0035 13.7743 16.2432 13.7744C15.0056 13.7744 13.8739 13.3181 13.001 12.5645C14.075 11.6371 14.7568 10.2582 14.7568 8.71777C14.7567 7.17728 14.0752 5.79838 13.001 4.87109C13.8738 4.11763 15.0058 3.66211 16.2432 3.66211Z" fill="#F9A000" />
                                            <path fill-rule="evenodd" clip-rule="evenodd" d="M13.001 4.87109C14.0754 5.79848 14.7568 7.17798 14.7568 8.71875C14.7567 10.2591 14.075 11.6371 13.001 12.5645C11.9271 11.6371 11.2452 10.259 11.2451 8.71875C11.2451 7.1781 11.9267 5.79848 13.001 4.87109Z" fill="#FF5E00" />
                                        </svg>
                                        {/* Amex */}
                                        <svg xmlns="http://www.w3.org/2000/svg" width="22" height="15" viewBox="0 0 26 18" fill="none">
                                            <mask id="mask0_2865_4763" style={{ maskType: 'alpha' }} maskUnits="userSpaceOnUse" x="0" y="0" width="26" height="18">
                                                <rect width="25.6359" height="17.5789" fill="#016FD0" />
                                            </mask>
                                            <g mask="url(#mask0_2865_4763)">
                                                <rect width="25.6359" height="17.5789" rx="1.46491" fill="#016FD0" />
                                                <path d="M4.98633 13.4481V9.41504H9.25662L9.71478 10.0123L10.1881 9.41504H25.6882V13.17C25.6882 13.17 25.2829 13.4441 24.814 13.4481H16.2313L15.7147 12.8124V13.4481H14.022V12.3629C14.022 12.3629 13.7908 12.5144 13.2909 12.5144H12.7148V13.4481H10.1519L9.69436 12.8381L9.22984 13.4481H4.98633Z" fill="white" />
                                                <path d="M0 6.37539L0.962969 4.13037H2.62832L3.17482 5.38794V4.13037H5.24501L5.57033 5.0393L5.88573 4.13037H15.1787V4.58732C15.1787 4.58732 15.6673 4.13037 16.4701 4.13037L19.4853 4.14091L20.0224 5.38202V4.13037H21.7549L22.2317 4.84329V4.13037H23.98V8.16346H22.2317L21.7747 7.44823V8.16346H19.2294L18.9734 7.5277H18.2891L18.0373 8.16346H16.3112C15.6203 8.16346 15.1787 7.71584 15.1787 7.71584V8.16346H12.5761L12.0595 7.5277V8.16346H2.38161L2.12582 7.5277H1.44373L1.18974 8.16346H0V6.37539Z" fill="white" />
                                                <path d="M1.30274 4.62744L0.00390625 7.64729H0.849514L1.08917 7.04258H2.48237L2.72078 7.64729H3.58501L2.28742 4.62744H1.30274ZM1.78328 5.33025L2.20795 6.38695H1.35738L1.78328 5.33025Z" fill="#016FD0" />
                                                <path d="M3.6748 7.6468V4.62695L4.87646 4.63142L5.57538 6.57843L6.25757 4.62695H7.44962V7.6468H6.69466V5.42165L5.89438 7.6468H5.23228L4.42977 5.42165V7.6468H3.6748Z" fill="#016FD0" />
                                                <path d="M7.9668 7.64683V4.62695H10.4304V5.30245H8.72971V5.81901H10.3906V6.45478H8.72971V6.9912H10.4304V7.64683H7.9668Z" fill="#016FD0" />
                                                <path d="M10.8672 4.62744V7.64732H11.6222V6.57447H11.94L12.8453 7.64732H13.7679L12.7745 6.53474C13.1822 6.50033 13.6027 6.15042 13.6027 5.60717C13.6027 4.97168 13.1039 4.62744 12.5472 4.62744H10.8672ZM11.6222 5.30294H12.4852C12.6922 5.30294 12.8428 5.46488 12.8428 5.62082C12.8428 5.82145 12.6477 5.93871 12.4963 5.93871H11.6222V5.30294Z" fill="#016FD0" />
                                                <path d="M14.683 7.64683H13.9121V4.62695H14.683V7.64683Z" fill="#016FD0" />
                                                <path d="M16.5101 7.64683H16.3437C15.5386 7.64683 15.0498 7.01256 15.0498 6.14931C15.0498 5.26473 15.5331 4.62695 16.5498 4.62695H17.3843V5.34219H16.5193C16.1066 5.34219 15.8147 5.66427 15.8147 6.15676C15.8147 6.7416 16.1485 6.98723 16.6293 6.98723H16.828L16.5101 7.64683Z" fill="#016FD0" />
                                                <path d="M18.1533 4.62744L16.8545 7.64729H17.7001L17.9398 7.04258H19.333L19.5714 7.64729H20.4356L19.138 4.62744H18.1533ZM18.6339 5.33025L19.0585 6.38695H18.208L18.6339 5.33025Z" fill="#016FD0" />
                                                <path d="M20.5234 7.64683V4.62695H21.4833L22.7089 6.52431V4.62695H23.4638V7.64683H22.535L21.2784 5.69981V7.64683H20.5234Z" fill="#016FD0" />
                                                <path d="M5.50293 12.9315V9.91162H7.96652V10.5871H6.26585V11.1037H7.92678V11.7394H6.26585V12.2759H7.96652V12.9315H5.50293Z" fill="#016FD0" />
                                                <path d="M17.5742 12.9315V9.91162H20.0378V10.5871H18.3371V11.1037H19.9901V11.7394H18.3371V12.2759H20.0378V12.9315H17.5742Z" fill="#016FD0" />
                                                <path d="M8.06274 12.9315L9.26224 11.4402L8.03418 9.91162H8.98533L9.7167 10.8566L10.4506 9.91162H11.3645L10.1525 11.4215L11.3543 12.9315H10.4032L9.69311 12.0014L9.00023 12.9315H8.06274Z" fill="#016FD0" />
                                                <path d="M11.4434 9.91211V12.932H12.2182V11.9783H13.0129C13.6853 11.9783 14.195 11.6216 14.195 10.9278C14.195 10.3531 13.7953 9.91211 13.111 9.91211H11.4434ZM12.2182 10.5951H13.0551C13.2724 10.5951 13.4276 10.7282 13.4276 10.9427C13.4276 11.1443 13.2731 11.2904 13.0526 11.2904H12.2182V10.5951Z" fill="#016FD0" />
                                                <path d="M14.5234 9.91162V12.9315H15.2784V11.8586H15.5963L16.5015 12.9315H17.4241L16.4307 11.8189C16.8384 11.7845 17.259 11.4346 17.259 10.8913C17.259 10.2559 16.7602 9.91162 16.2035 9.91162H14.5234ZM15.2784 10.5871H16.1414C16.3484 10.5871 16.499 10.7491 16.499 10.905C16.499 11.1056 16.3039 11.2229 16.1526 11.2229H15.2784V10.5871Z" fill="#016FD0" />
                                                <path d="M20.3879 12.9315V12.2759H21.8988C22.1224 12.2759 22.2192 12.1551 22.2192 12.0226C22.2192 11.8956 22.1227 11.7673 21.8988 11.7673H21.216C20.6225 11.7673 20.292 11.4057 20.292 10.8628C20.292 10.3786 20.5947 9.91162 21.4766 9.91162H22.9468L22.6289 10.5911H21.3574C21.1143 10.5911 21.0395 10.7186 21.0395 10.8404C21.0395 10.9656 21.132 11.1037 21.3177 11.1037H22.0329C22.6945 11.1037 22.9816 11.479 22.9816 11.9704C22.9816 12.4988 22.6617 12.9315 21.9969 12.9315H20.3879Z" fill="#016FD0" />
                                                <path d="M23.1584 12.9315V12.2759H24.6693C24.8929 12.2759 24.9897 12.1551 24.9897 12.0226C24.9897 11.8956 24.8932 11.7673 24.6693 11.7673H23.9865C23.393 11.7673 23.0625 11.4057 23.0625 10.8628C23.0625 10.3786 23.3652 9.91162 24.2471 9.91162H25.6873L25.3994 10.5911H24.1279C23.8848 10.5911 23.81 10.7186 23.81 10.8404C23.81 10.9656 23.9025 11.1037 24.0882 11.1037H24.8034C25.465 11.1037 25.7521 11.479 25.7521 11.9704C25.7521 12.4988 25.4322 12.9315 24.7674 12.9315H23.1584Z" fill="#016FD0" />
                                            </g>
                                        </svg>
                                        {/* Discover */}
                                        <svg xmlns="http://www.w3.org/2000/svg" width="22" height="15" viewBox="0 0 26 18" fill="none">
                                            <rect width="25.6359" height="17.5789" rx="1.46491" fill="#232342" />
                                            <path d="M11.1699 17.5793L25.6359 13.3677V16.1144C25.6359 16.9234 24.9801 17.5793 24.171 17.5793H11.1699Z" fill="#FD6020" />
                                            <path d="M10.5303 7.03958C10.8088 7.03958 11.1275 7.07944 11.3662 7.23685V8.02396C11.1672 7.78784 10.8486 7.63041 10.5303 7.63041C9.89361 7.66977 9.37622 8.2205 9.41602 8.85013V8.92826C9.41602 9.5579 9.93363 10.0308 10.5703 10.0308C10.8886 10.0307 11.1673 9.87329 11.3662 9.63724V10.4244C11.0877 10.5424 10.8086 10.6206 10.4902 10.6206C9.4957 10.6205 8.70046 9.79459 8.7002 8.81107C8.7002 7.78791 9.49567 6.96089 10.5303 7.03958ZM16.7773 9.40091L17.7324 7.03958H18.4492L16.9766 10.6206H16.6182L15.1465 7.03958H15.8623L16.7773 9.40091ZM7.34668 6.96146C7.70481 6.96146 8.06325 7.1189 8.3418 7.35501L7.9834 7.82669C7.82433 7.66942 7.62557 7.55142 7.42676 7.5513C7.18801 7.51195 6.98902 7.70875 6.94922 7.94486C6.94923 8.14153 7.06827 8.22019 7.46582 8.37748C8.26167 8.6923 8.46118 8.92868 8.50098 9.40091V9.51908C8.46112 10.1487 7.94328 10.6209 7.30664 10.5816C6.82932 10.5814 6.35199 10.3453 6.11328 9.91263L6.55078 9.48001C6.67023 9.75534 6.94934 9.95169 7.26758 9.95169H7.30664C7.5454 9.95169 7.78418 9.71544 7.78418 9.43998C7.78409 9.28287 7.70503 9.16512 7.58594 9.08646C7.42685 9.0078 7.26749 8.92857 7.1084 8.88919C6.47173 8.69244 6.27247 8.41707 6.27246 7.94486V7.9058C6.31225 7.35491 6.78965 6.9222 7.34668 6.96146ZM3.20801 7.03958C4.16286 7.07893 4.91938 7.86586 4.87988 8.81009C4.87988 9.32152 4.64087 9.79385 4.24316 10.148C3.8851 10.4234 3.4474 10.5808 3.00977 10.5415H2.01465V7.03958H3.20801ZM5.83496 10.5425H5.1582V7.03958H5.83496V10.5425ZM20.6777 7.63041H19.4434V8.41751H20.6377V9.00736H19.4434V9.95169H20.6777V10.5425H18.7676V7.03958H20.6777V7.63041ZM22.1104 7.03958C22.9059 7.0397 23.3437 7.39423 23.3438 8.06302C23.3834 8.57439 23.0251 9.00667 22.5479 9.08548L23.6221 10.5415H22.7861L21.8711 9.12552H21.792V10.5415H21.1152V7.03958H22.1104ZM2.88965 7.62943H2.69141V9.95169H2.88965C3.20799 9.99105 3.56691 9.87307 3.80566 9.6763C4.04429 9.44021 4.16309 9.12511 4.16309 8.77103C4.16303 8.45646 4.0441 8.14181 3.80566 7.9058C3.56691 7.70907 3.20795 7.59009 2.88965 7.62943ZM21.792 8.65287H21.9902C22.4279 8.65284 22.627 8.45623 22.627 8.10208C22.6269 7.78738 22.4278 7.5904 21.9902 7.59037H21.792V8.65287Z" fill="white" />
                                            <path fill-rule="evenodd" clip-rule="evenodd" d="M13.3959 6.9585C12.4011 6.9585 11.5654 7.74555 11.5654 8.76871C11.5654 9.75253 12.3613 10.5789 13.3959 10.6183C14.4305 10.6576 15.2264 9.83123 15.2661 8.80807C15.2264 7.7849 14.4305 6.9585 13.3959 6.9585V6.9585Z" fill="#FD6020" />
                                        </svg>
                                    </div>
                                </div>
                                <div className="flex border-t border-slate-200">
                                    <Input
                                        placeholder="MM / YY"
                                        className="h-12 border-none border-r border-slate-200 rounded-none focus-visible:ring-0 w-1/2 px-4"
                                    />
                                    <div className="relative w-1/2">
                                        <Input
                                            placeholder="CVC"
                                            className="h-12 border-none rounded-none focus-visible:ring-0 px-4"
                                        />
                                        <CreditCard className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Cardholder Name Section */}
                        <div className="space-y-2">
                            <Label htmlFor="cardname" className="text-[13px] font-medium text-slate-600">Cardholder name</Label>
                            <Input
                                id="cardname"
                                placeholder="Full name on card"
                                className="h-12 border-slate-200 focus:border-[#77AEE1]/50 focus:ring-[#77AEE1]/20 rounded-xl"
                            />
                        </div>

                        {/* Country and ZIP Section */}
                        <div className="space-y-2">
                            <Label className="text-[13px] font-medium text-slate-600">Country or region</Label>
                            <div className="border border-slate-200 rounded-xl overflow-hidden focus-within:ring-2 focus-within:ring-[#77AEE1]/20 focus-within:border-[#77AEE1]/50 transition-all">
                                <Select defaultValue="us">
                                    <SelectTrigger className="h-12 border-none rounded-none focus:ring-0 px-4 shadow-none">
                                        <SelectValue placeholder="Select country" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="us">United States</SelectItem>
                                        <SelectItem value="uk">United Kingdom</SelectItem>
                                        <SelectItem value="ca">Canada</SelectItem>
                                        <SelectItem value="bd">Bangladesh</SelectItem>
                                    </SelectContent>
                                </Select>
                                <Input
                                    placeholder="ZIP"
                                    className="h-12 border-none border-t border-slate-200 rounded-none focus-visible:ring-0 px-4"
                                />
                            </div>
                        </div>

                        {/* Pay Button */}
                        <div className="pt-4 space-y-4">
                            <Button
                                onClick={handlePay}
                                disabled={isProcessing}
                                className="w-full h-14 bg-[#77AEE1] hover:bg-[#669dcf] text-white font-bold rounded-xl shadow-[0_4px_14px_0_rgba(119,174,225,0.39)] text-lg transition-all active:scale-[0.98]"
                            >
                                {isProcessing ? "Processing..." : "Pay"}
                            </Button>

                            <p className="text-center text-slate-400 text-[11px] leading-relaxed">
                                By clicking Pay, you agree to the Link <span className="text-slate-600 font-medium cursor-pointer">Terms</span> and <span className="text-slate-600 font-medium cursor-pointer">Privacy Policy</span>.
                            </p>
                        </div>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}