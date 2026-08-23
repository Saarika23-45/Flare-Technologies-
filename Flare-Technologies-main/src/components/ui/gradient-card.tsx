// components/ui/gradient-card.tsx
"use client";

import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";

import { cn } from "@/lib/utils"; 

// Define variants for the card's overall style using cva
const cardVariants = cva(
  "relative flex flex-col justify-between h-full w-full overflow-hidden rounded-3xl p-8 shadow-sm transition-shadow duration-300 hover:shadow-lg border border-white/5",
  {
    variants: {
      gradient: {
        orange: "bg-gradient-to-br from-orange-500/10 to-amber-500/5 backdrop-blur-xl",
        gray: "bg-gradient-to-br from-slate-500/10 to-slate-800/5 backdrop-blur-xl",
        purple: "bg-gradient-to-br from-purple-500/10 to-indigo-500/5 backdrop-blur-xl",
        green: "bg-gradient-to-br from-emerald-500/10 to-teal-500/5 backdrop-blur-xl",
        lavender: "bg-gradient-to-br from-pink-500/15 via-purple-500/10 to-violet-500/10 backdrop-blur-xl",
        cyan: "bg-gradient-to-br from-blue-500/15 via-cyan-500/10 to-sky-500/10 backdrop-blur-xl",
      },
    },
    defaultVariants: {
      gradient: "gray",
    },
  }
);

// Define the props interface for type safety and reusability
export interface GradientCardProps extends React.HTMLAttributes<HTMLDivElement>, VariantProps<typeof cardVariants> {
  badgeText: string;
  badgeColor: string; // Expecting a hex color string, e.g., "#FF5733"
  title: string;
  description: string;
  ctaText: string;
  ctaHref: string;
  imageUrl?: string;
  children?: React.ReactNode;
}

const GradientCard = React.forwardRef<HTMLDivElement, GradientCardProps>(
  ({ className, gradient, badgeText, badgeColor, title, description, ctaText, ctaHref, imageUrl, children, ...props }, ref) => {
    
    // Animation variants for framer-motion
    const cardAnimation = {
      rest: { scale: 1, y: 0 },
      hover: { scale: 1.02, y: -8 },
    };

    const imageAnimation = {
      rest: { scale: 1, rotate: 0, opacity: 0.1 },
      hover: { scale: 1.1, rotate: 3, opacity: 0.2 },
    };

    return (
      <motion.div
        variants={cardAnimation}
        initial="rest"
        whileHover="hover"
        animate="rest"
        className="h-full"
        ref={ref}
      >
        <div
          className={cn(cardVariants({ gradient }), className)}
          {...props}
        >
          {/* Decorative background image with animation */}
          {imageUrl && (
            <motion.img
              src={imageUrl}
              alt={`${title} background graphic`}
              variants={imageAnimation}
              transition={{ type: "spring", stiffness: 400, damping: 15 }}
              className="absolute -right-1/4 -bottom-1/4 w-3/4 pointer-events-none"
            />
          )}

          {/* Card Content */}
          <div className="z-10 flex flex-col h-full">
            {/* Badge */}
            <div className="mb-6 inline-flex items-center gap-2 rounded-full bg-white/5 border border-white/10 px-4 py-1.5 text-xs font-bold uppercase tracking-wider backdrop-blur-md w-fit" style={{ color: 'var(--theme-text-primary)' }}>
              <span 
                className="h-2 w-2 rounded-full shadow-[0_0_8px_rgba(255,255,255,0.5)]" 
                style={{ backgroundColor: badgeColor }}
              />
              {badgeText}
            </div>

            {/* Title and Description */}
            <div className="flex-grow">
              <h3 className="text-3xl font-black mb-4 tracking-tighter" style={{ color: 'var(--theme-text-primary)' }}>{title}</h3>
              <p className="text-lg leading-relaxed mb-6 font-medium italic" style={{ color: 'var(--theme-text-secondary)' }}>{description}</p>
              
              {/* Custom content slot for Results list items etc */}
              {children}
            </div>
            
            {/* Call to Action Link */}
            <a
              href={ctaHref}
              className="group mt-8 inline-flex items-center gap-2 text-sm font-bold transition-colors"
              style={{ color: 'var(--theme-text-primary)' }}
            >
              <span className="border-b transition-all pb-0.5" style={{ borderColor: 'color-mix(in srgb, var(--theme-text-primary) 20%, transparent)' }}>
                {ctaText}
              </span>
              <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
            </a>
          </div>
        </div>
      </motion.div>
    );
  }
);
GradientCard.displayName = "GradientCard";

export { GradientCard, cardVariants };
