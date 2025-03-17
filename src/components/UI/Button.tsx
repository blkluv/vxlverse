import { LucideIcon } from "lucide-react";
import { ButtonHTMLAttributes, forwardRef } from "react";
import { Link } from "react-router-dom";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "outline" | "ghost";
  size?: "xs" | "sm" | "md" | "lg";
  icon?: LucideIcon;
  to?: string;
  isLoading?: boolean;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className = "",
      variant = "primary",
      size = "md",
      icon: Icon,
      children,
      to,
      isLoading,
      ...props
    },
    ref
  ) => {
    const sizes = {
      xs: "px-2 py-1 text-xs",
      sm: "px-3 py-1.5 text-sm",
      md: "px-4 py-2",
      lg: "px-6 py-3 text-lg",
    };

    const baseStyles = `inline-flex items-center justify-center gap-2  font-medium transition-all duration-200 ${sizes[size]}`;

    const variants = {
      primary: `bg-gradient-to-r from-blue-500 via-violet-500 to-purple-500 text-white hover:brightness-110 
                active:brightness-90 disabled:opacity-50 disabled:hover:brightness-100 
                shadow-[0_0_0_1px_rgba(255,255,255,0.1)] backdrop-blur-sm`,
      secondary: `bg-gradient-to-br from-gray-900/90 via-gray-800/90 to-gray-900/90 text-white hover:bg-white/10 
                  active:bg-white/5 disabled:opacity-50 disabled:hover:bg-white/5 
                  shadow-[0_0_0_1px_rgba(255,255,255,0.1)] backdrop-blur-sm border border-white/10`,
      outline: `border border-white/10 text-gray-300 hover:bg-white/5 hover:text-white 
                active:bg-transparent disabled:opacity-50 disabled:hover:bg-transparent 
                backdrop-blur-sm`,
      ghost: `text-gray-300 hover:bg-white/5 hover:text-white 
                active:bg-transparent disabled:opacity-50 disabled:hover:bg-transparent 
                backdrop-blur-sm`,
    };

    const content = (
      <>
        {isLoading ? (
          <div className="w-5 h-5 border-2 border-current border-t-transparent  animate-spin" />
        ) : (
          <>
            {Icon && <Icon className="w-5 h-5" strokeWidth={1.5} />}
            {children}
          </>
        )}
      </>
    );

    const buttonStyles = `${baseStyles} ${variants[variant]} ${className}`;

    if (to) {
      return (
        <Link to={to} className={buttonStyles}>
          {content}
        </Link>
      );
    }

    return (
      <button
        onClick={props.onClick}
        type={props.type}
        ref={ref}
        className={buttonStyles}
        disabled={isLoading || props.disabled}
      >
        {content}
      </button>
    );
  }
);
