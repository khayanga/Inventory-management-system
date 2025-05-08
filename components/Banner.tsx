import { Shield } from "lucide-react";

interface RestrictedAccessBannerProps {
  className?: string;
}

export function RestrictedAccessBanner({ className }: RestrictedAccessBannerProps) {
  return (
    <div className={`
        flex items-center gap-2 
        bg-red-500/20 dark:bg-red-600/30 
        backdrop-blur-sm
        border border-red-400/50 dark:border-red-500/60
        text-red-700 dark:text-red-100
        rounded-sm px-3 py-2 
        text-sm font-medium
        shadow-inner shadow-red-300/20 dark:shadow-red-900/20
        transition-all duration-200 hover:bg-red-500/30 dark:hover:bg-red-600/40
        ${className}
      `}>
        <Shield className="h-4 w-4" />
        <span className="uppercase tracking-wider">
          Restricted Access - Authorized Personnel Only
        </span>
      </div>
  );
}
