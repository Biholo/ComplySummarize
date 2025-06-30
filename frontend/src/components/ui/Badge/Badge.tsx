import { cn } from '@/lib/utils';
import { cva, type VariantProps } from 'class-variance-authority';
import type React from 'react';

const badgeVariants = cva(
    'inline-flex items-center rounded-full px-3 py-1 text-xs font-medium ring-1 ring-inset',
    {
        variants: {
            variant: {
                success: 'bg-emerald-50 text-emerald-700 ring-emerald-600/20',
                pending: 'bg-yellow-50 text-yellow-700 ring-yellow-600/20',
                error: 'bg-red-50 text-red-700 ring-red-600/20',
                processing: 'bg-blue-50 text-blue-700 ring-blue-600/20',
                secondary: 'bg-gray-50 text-gray-700 ring-gray-600/20',
                info: 'bg-sky-50 text-sky-700 ring-sky-600/20',
            },
        },
        defaultVariants: {
            variant: 'secondary',
        },
    }
);

interface BadgeProps
    extends React.HTMLAttributes<HTMLDivElement>,
        VariantProps<typeof badgeVariants> {
    children: React.ReactNode;
}

export const Badge: React.FC<BadgeProps> = ({
    children,
    variant,
    className,
    ...props
}) => {
    return (
        <div
            className={cn(badgeVariants({ variant, className }))}
            {...props}
        >
            {children}
        </div>
    );
};
