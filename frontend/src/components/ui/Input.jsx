import React from 'react';

const Input = ({
    label,
    error,
    className = '',
    ...props
}) => {
    return (
        <div className={`w-full ${className}`}>
            {label && (
                <label className="block text-sm font-semibold text-slate-700 mb-1.5 ml-1">
                    {label}
                </label>
            )}
            <input
                className={`
          w-full px-4 py-2.5 
          bg-white border-2 border-slate-200 rounded-xl 
          text-slate-900 placeholder-slate-400 font-medium
          focus:outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10
          transition-all duration-200
          ${error ? 'border-rose-300 focus:border-rose-500 focus:ring-rose-500/10' : 'hover:border-slate-300'}
        `}
                {...props}
            />
            {error && (
                <p className="mt-1 text-sm text-rose-500 font-medium ml-1">{error}</p>
            )}
        </div>
    );
};

export const TextArea = ({
    label,
    error,
    className = '',
    ...props
}) => {
    return (
        <div className={`w-full ${className}`}>
            {label && (
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    {label}
                </label>
            )}
            <textarea
                className={`
          w-full px-4 py-2.5 
          bg-white border-2 border-slate-200 rounded-lg 
          text-slate-900 placeholder-slate-400 font-medium
          focus:outline-none focus:border-slate-900 focus:ring-0
          transition-colors duration-200
          ${error ? 'border-red-500 focus:border-red-600' : ''}
        `}
                {...props}
            />
            {error && (
                <p className="mt-1 text-sm text-red-500">{error}</p>
            )}
        </div>
    );
};

export default Input;
