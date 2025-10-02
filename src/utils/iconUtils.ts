// Utility para aplicar classe icon automaticamente em componentes Lucide
export const withIconClass = (IconComponent: any) => {
  return (props: any) => <IconComponent {...props} className={`icon ${props.className || ''}`} />;
};