
import React from 'react';
import { NavLink } from 'react-router-dom';
import { cn } from '@/lib/utils';

const ContactNavItem = () => {
  return (
    <NavLink
      to="/contact"
      className={({ isActive }) =>
        cn(
          "flex items-center px-4 py-2 text-sm font-medium transition-colors hover:text-primary",
          isActive
            ? "text-primary"
            : "text-muted-foreground"
        )
      }
    >
      Contact
    </NavLink>
  );
};

export default ContactNavItem;
