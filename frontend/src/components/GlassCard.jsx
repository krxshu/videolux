export default function GlassCard({ children, className = "", hover = false }) {
  return (
    <div
      className={`glass rounded-2xl p-6 ${
        hover ? "transition-all duration-300 hover:border-brand-purple/40 hover:-translate-y-1" : ""
      } ${className}`}
    >
      {children}
    </div>
  );
}
