import React from 'react';

const Badge = ({ children, variant = 'default', className = '' }) => {
    const variants = {
        default: "bg-slate-100 text-slate-800 border border-slate-200",
        success: "bg-white text-emerald-700 border border-emerald-200 font-semibold",
        warning: "bg-white text-amber-700 border border-amber-200 font-semibold",
        danger: "bg-white text-red-700 border border-red-200 font-semibold",
        primary: "bg-slate-900 text-white border border-slate-900",
        outline: "bg-white text-slate-900 border border-slate-900",
    };

    return (
        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${variants[variant]} ${className}`}>
            {children}
        </span>
    );
};

export default Badge;
