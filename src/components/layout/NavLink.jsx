import React from 'react';
import { Link } from 'react-router-dom';

const NavLink = ({ to, children, onClick }) => {
  const baseClasses = "fixed text-light-body dark:text-dark-body hover:text-light-primary dark:hover:text-dark-primary transition-colors";
  return (
    <Link to={to} className={baseClasses} onClick={onClick}>
      {children}
    </Link>
  );
};

export default NavLink;
