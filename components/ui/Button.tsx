
import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'danger' | 'ghost' | 'danger-ghost';
  size?: 'sm' | 'md' | 'lg';
}

const Button: React.FC<ButtonProps> = ({ children, variant = 'primary', size = 'md', className, ...props }) => {
  const baseStyles = 'inline-flex items-center justify-center font-semibold rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-q-dark disabled:opacity-50 disabled:cursor-not-allowed';

  const variantStyles = {
    primary: 'bg-q-green text-black hover:bg-q-green-hover focus:ring-q-green',
    secondary: 'bg-q-gray-700 text-white hover:bg-q-gray-600 focus:ring-q-gray-500',
    danger: 'bg-red-600 text-white hover:bg-red-700 focus:ring-red-500',
    ghost: 'text-q-gray-400 hover:bg-q-gray-700 hover:text-white',
    'danger-ghost': 'text-q-gray-400 hover:bg-red-500/20 hover:text-red-400',
  };

  const sizeStyles = {
    sm: 'px-2.5 py-1.5 text-xs',
    md: 'px-4 py-2 text-sm',
    lg: 'px-6 py-3 text-base',
  };

  const classes = `${baseStyles} ${variantStyles[variant]} ${sizeStyles[size]} ${className || ''}`;

  return (
    <button className={classes} {...props}>
      {children}
    </button>
  );
};

export default Button;
