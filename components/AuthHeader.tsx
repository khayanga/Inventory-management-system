import { Lock, Shield } from "lucide-react";

interface AuthHeaderProps {
  title: string;
  subtitle?: string;
}

export function AuthHeader({ title, subtitle }: AuthHeaderProps) {
  return (
    <div className="flex flex-col items-center space-y-2 text-center">
      <div className="flex justify-center items-center w-12 h-12 rounded-full bg-tactical-accent/20 border border-tactical-accent/30">
        <Lock className="h-6 w-6 text-tactical-accent" />
      </div>
      <h1 className="text-2xl font-bold tracking-tight text-foreground">{title}</h1>
      {subtitle && (
        <p className="text-sm text-muted-foreground">{subtitle}</p>
      )}
      <div className="flex items-center justify-center gap-2 mt-1 text-xs text-tactical-gray">
        <Shield className="h-3 w-3" />
        <span className="uppercase tracking-wider">Secure Authentication</span>
      </div>
    </div>
  );
}