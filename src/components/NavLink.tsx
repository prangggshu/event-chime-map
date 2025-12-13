import { NavLink as RouterNavLink, NavLinkProps } from "react-router-dom";
import { forwardRef } from "react";
import { cn } from "@/lib/utils";

interface NavLinkCompatProps extends Omit<NavLinkProps, "className"> {
  className?: string;
  activeClassName?: string;
  pendingClassName?: string;
}

const NavLink = forwardRef<HTMLAnchorElement, NavLinkCompatProps>(
  ({ className, activeClassName, pendingClassName, to, ...props }, ref) => {
    return (
      <RouterNavLink
        ref={ref}
        to={to}
        className={({ isActive, isPending }) =>
          cn(
            // base style (font + neutral color)
            "font-playfair font-semibold tracking-wide text-gray-600 hover:text-orange-600 transition-colors",

            // external override
            className,

            // active state (orange highlight)
            isActive &&
              (activeClassName ??
                "text-orange-600 border-b-2 border-orange-500"),

            // pending state (soft orange)
            isPending &&
              (pendingClassName ?? "text-orange-400")
          )
        }
        {...props}
      />
    );
  }
);

NavLink.displayName = "NavLink";

export { NavLink };
