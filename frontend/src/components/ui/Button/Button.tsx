import { cn } from '@/lib/utils';
import { cva, type VariantProps } from 'class-variance-authority';
import { HTMLMotionProps, motion } from 'framer-motion';
import { Loader2 } from 'lucide-react';
import type React from 'react';

const buttonVariants = cva(
    'inline-flex items-center justify-center rounded-lg text-sm font-medium transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none shadow-sm',
    {
        variants: {
            variant: {
                primary: 'bg-emerald-500 text-white hover:bg-emerald-600 focus-visible:ring-emerald-500 shadow-emerald-500/20',
                secondary: 'bg-blue-500 text-white hover:bg-blue-600 focus-visible:ring-blue-500 shadow-blue-500/20',
                outline: 'border-2 border-gray-200 bg-white text-gray-700 hover:bg-gray-50 hover:border-gray-300 focus-visible:ring-gray-500',
                ghost: 'text-gray-600 hover:bg-gray-100 hover:text-gray-900 focus-visible:ring-gray-500',
                soft: 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100 focus-visible:ring-emerald-500',
                danger: 'bg-red-500 text-white hover:bg-red-600 focus-visible:ring-red-500 shadow-red-500/20',
            },
            size: {
                sm: 'h-9 px-4 text-xs',
                default: 'h-11 px-6 text-sm',
                lg: 'h-12 px-8 text-base',
                xl: 'h-14 px-10 text-lg',
            },
        },
        defaultVariants: {
            variant: 'primary',
            size: 'default',
        },
    }
);

interface ButtonProps
    extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, keyof HTMLMotionProps<'button'>>,
        HTMLMotionProps<'button'>,
        VariantProps<typeof buttonVariants> {
    isLoading?: boolean;
    loadingText?: string;
    children: React.ReactNode;
    asChild?: boolean;
}

export const Button: React.FC<ButtonProps> = ({
    children,
    variant,
    size,
    isLoading = false,
    loadingText,
    disabled,
    className,
    asChild,
    ...props
}) => {
    if (asChild) {
        return (
            <span className={cn(buttonVariants({ variant, size, className }))}>
                {children}
            </span>
        );
    }

    return (
        <motion.button
            whileHover={{ scale: disabled || isLoading ? 1 : 1.02 }}
            whileTap={{ scale: disabled || isLoading ? 1 : 0.98 }}
            disabled={disabled || isLoading}
            className={cn(buttonVariants({ variant, size, className }))}
            {...props}
        >
            {isLoading && (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            )}
            {isLoading && loadingText ? loadingText : children}
        </motion.button>
    );
};
