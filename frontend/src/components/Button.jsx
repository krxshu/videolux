import { motion } from "framer-motion";

const variants = {
  primary:
    "bg-gradient-purple-cyan text-white shadow-glow hover:shadow-glow-cyan",
  secondary:
    "glass text-text-primary hover:border-brand-cyan/40",
  ghost: "text-text-secondary hover:text-text-primary",
};

export default function Button({
  children,
  variant = "primary",
  className = "",
  as: Component = "button",
  icon: Icon,
  ...props
}) {
  return (
    <motion.div whileTap={{ scale: 0.97 }} whileHover={{ scale: 1.02 }} className="inline-block">
      <Component
        className={`inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl font-semibold text-sm transition-all duration-200 ${variants[variant]} ${className}`}
        {...props}
      >
        {Icon && <Icon size={18} />}
        {children}
      </Component>
    </motion.div>
  );
}
