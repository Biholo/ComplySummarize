import { cn } from '@/lib/utils';
import { HTMLMotionProps, motion } from 'framer-motion';
import type React from 'react';

interface CardProps extends HTMLMotionProps<'div'> {
    children: React.ReactNode;
    hoverable?: boolean;
    padding?: 'none' | 'sm' | 'md' | 'lg';
}

const paddingVariants = {
    none: '',
    sm: 'p-4',
    md: 'p-6',
    lg: 'p-8',
};

export const Card: React.FC<CardProps> = ({
    children,
    className,
    hoverable = false,
    padding = 'md',
    ...props
}) => {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            whileHover={hoverable ? { y: -2, scale: 1.01 } : undefined}
            transition={{ duration: 0.2 }}
            className={cn(
                'bg-white rounded-xl shadow-sm border border-gray-100',
                paddingVariants[padding],
                hoverable && 'cursor-pointer hover:shadow-md transition-shadow duration-200',
                className
            )}
            {...props}
        >
            {children}
        </motion.div>
    );
};
