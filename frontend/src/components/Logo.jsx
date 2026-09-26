import { Aperture } from "lucide-react";

export default function Logo({ size = "md" }) {
  const sizes = {
    sm: { icon: 18, text: "text-lg" },
    md: { icon: 22, text: "text-xl" },
    lg: { icon: 28, text: "text-2xl" },
  };
  const s = sizes[size] || sizes.md;

  return (
    <div className="flex items-center gap-2 select-none">
      <div className="relative flex items-center justify-center w-9 h-9 rounded-xl bg-gradient-purple-cyan shadow-glow">
        <Aperture size={s.icon} className="text-white" strokeWidth={2.2} />
      </div>
      <span className={`font-extrabold tracking-tight ${s.text} text-text-primary`}>
        VIDEOLUX <span className="text-gradient">AI</span>
      </span>
    </div>
  );
}
