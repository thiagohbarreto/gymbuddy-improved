import React from 'react';

// Utility para aplicar classe icon automaticamente em componentes Lucide
export const withIconClass = (IconComponent: any) => {
  return (props: any) => React.createElement(IconComponent, {
    ...props,
    className: `icon ${props.className || ''}`
  });
};