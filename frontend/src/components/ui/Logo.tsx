import React from 'react';

interface LogoProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  className?: string;
}

export function Logo({ className, ...props }: LogoProps) {
  return (
    <img 
      src="/logo.ico" 
      alt="VFAQ Logo" 
      className={`object-contain ${className || ''}`}
      {...props}
    />
  );
}
