import type { ButtonHTMLAttributes, ReactNode } from 'react';


interface BotonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  variante?: 'minimal' | 'outline-minimal' | 'danger' | 'light' |'dark';
}

export default function Boton({ 
  children, 
  variante = 'minimal', 
  className = '', 
  ...props 
}: BotonProps) {
  return (
    <button 
      className={`btn btn-${variante} ${className}`} 
      {...props}
    >
      {children}
    </button>
  );
}