import React, { forwardRef } from "react";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
    label: string;
    disabled: boolean;
    error?: string;
}

export const InputGroup = forwardRef<HTMLInputElement, InputProps>(
    ({ label, disabled, error, ...props }, ref) => {
        return (
            <div className="flex flex-col gap-1.5 w-full">
                <label className="text-sm font-medium text-slate-700">{label}</label>
                <input
                    {...props}
                    ref={ref}
                    disabled={disabled}
                    className={`
            w-full px-4 py-3 rounded-xl border transition-all text-sm outline-none
            ${disabled
                            ? 'bg-slate-50 border-slate-100 text-slate-400 cursor-not-allowed'
                            : error
                                ? 'border-red-500 bg-red-50/30 focus:ring-4 focus:ring-red-500/10'
                                : 'bg-white border-slate-200 text-slate-900 focus:border-[#7CB1E6] focus:ring-4 focus:ring-[rgba(119,174,225,0.2)]'}
          `}
                />
                {error && (
                    <span className="text-[12px] text-red-500 font-medium animate-in fade-in slide-in-from-top-1">
                        {error}
                    </span>
                )}
            </div>
        );
    }
);

InputGroup.displayName = "InputGroup";