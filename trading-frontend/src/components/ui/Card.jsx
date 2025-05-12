export const Card = ({ children, className }) => {
  return (
    <div className={`bg-white shadow-sm rounded-lg border border-neutral-200 ${className || ''}`}>
      {children}
    </div>
  );
};

export const CardHeader = ({ title, subtitle, className }) => {
  return (
    <div className={`px-6 py-4 border-b border-neutral-200 ${className || ''}`}>
      <h3 className="text-lg font-semibold text-neutral-900">{title}</h3>
      {subtitle && <p className="text-sm text-neutral-500 mt-1">{subtitle}</p>}
    </div>
  );
};

export const CardBody = ({ children, className }) => {
  return (
    <div className={`p-6 ${className || ''}`}>
      {children}
    </div>
  );
};