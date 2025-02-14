import React, { InputHTMLAttributes } from 'react';

interface Props extends InputHTMLAttributes<HTMLInputElement> {
    label?: string;
    error?: string;
}

export const Input = React.forwardRef<HTMLInputElement, Props>(
    ({ className = '', label, error, ...props }, ref) => {
        return (
            <div className="w-full">
                {label && (
                    <label className="block text-sm font-medium text-got-light-text dark:text-got-dark-text mb-1">
                        {label}
                    </label>
                )}
                <input
                    ref={ref}
                    className={`w-full rounded-md border-gray-300 shadow-sm 
                        focus:border-got-tech focus:ring-got-tech
                        dark:bg-got-dark-bg dark:border-gray-700 
                        dark:text-white ${className}`}
                    {...props}
                />
                {error && (
                    <p className="mt-1 text-sm text-red-600">{error}</p>
                )}
            </div>
        );
    }
);

Input.displayName = 'Input'; 