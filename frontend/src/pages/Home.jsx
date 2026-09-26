import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import {
  Sparkles,
  Wand2,
  ScanLine,
  Layers,
  ShieldCheck,
  Zap,
  UploadCloud,
  Cpu,
  Download,
  Check,
  ArrowRight,
} from "lucide-react";
import Button from "../components/Button";
import GlassCard from "../components/GlassCard";

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } },
};

const features = [
  {
    icon: ScanLine,
    title: "AI Upscaling",
    desc: "Boost resolution up to 4K while preserving natural detail and edges.",
  },
  {
    icon: Wand2,
    title: "Smart Restoration",
    desc: "Repair old, compressed or low-quality footage automatically.",
  },
  {
    icon: Layers,
    title: "Noise Reduction",
    desc: "Remove grain and compression artifacts without losing texture.",
  },
  {
    icon: Zap,
    title: "Sharpening",
    desc: "Enhance clarity and crispness across every frame.",
  },
  {
    icon: ShieldCheck,
    title: "Private by Design",
    desc: "Your videos are processed temporarily and deleted automatically.",
  },
  {
    icon: Sparkles,
    title: "Pluggable AI Engine",
    desc: "Built to connect state-of-the-art AI enhancement models.",
  },
];

const steps = [
  {
    icon: UploadCloud,
    title: "Upload",
    desc: "Drop in your low-quality video — MP4, MOV, AVI, MKV or WebM.",
  },
  {
    icon: Cpu,
    title: "Enhance",
    desc: "Choose a mode and let VIDEOLUX AI process your footage on the server.",
  },
  {
    icon: Download,
    title: "Download",
    desc: "Get your enhanced, high-quality video — no watermarks, no traces left behind.",
  },
];

const plans = [
  {
    name: "Starter",
    price: "$0",
    period: "/mo",
    desc: "Try AI enhancement on a few short clips.",
    features: ["Up to 3 videos / month", "720p output", "Standard queue", "Max 2 min length"],
    highlighted: false,
  },
  {
    name: "Pro",
    price: "$19",
    period: "/mo",
    desc: "For creators who need consistent, high-quality output.",
    features: [
      "Unlimited videos",
      "Up to 4K output",
      "Priority processing queue",
      "Max 30 min length",
      "Batch uploads",
    ],
    highlighted: true,
  },
  {
    name: "Studio",
    price: "$49",
    period: "/mo",
    desc: "Built for teams and production pipelines.",
    features: [
      "Everything in Pro",
      "API access",
      "Dedicated processing",
      "Priority support",
      "Custom AI model routing",
    ],
    highlighted: false,
  },
];

export default function Home() {
  return (
    <div>
      {/* HERO */}
      <section id="home" className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-radial-glow pointer-events-none" />
        <div className="absolute -top-24 -left-24 w-96 h-96 bg-brand-purple/20 rounded-full blur-3xl animate-float pointer-events-none" />
        <div className="absolute top-40 -right-24 w-96 h-96 bg-brand-cyan/10 rounded-full blur-3xl animate-float pointer-events-none" />

        <div className="relative max-w-5xl mx-auto px-6 pt-20 pb-28 text-center">
          <motion.div
            initial="hidden"
            animate="show"
            variants={fadeUp}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full glass text-xs font-medium text-brand-cyan mb-8"
          >
            <Sparkles size={14} />
            Next-generation AI video enhancement
          </motion.div>

          <motion.h1
            initial="hidden"
            animate="show"
            variants={fadeUp}
            transition={{ delay: 0.1 }}
            className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight leading-tight"
          >
            Enhance Your Videos <br className="hidden sm:block" />
            <span className="text-gradient">With AI</span>
          </motion.h1>

          <motion.p
            initial="hidden"
            animate="show"
            variants={fadeUp}
            transition={{ delay: 0.2 }}
            className="mt-6 text-lg text-text-secondary max-w-2xl mx-auto"
          >
            Upscale, sharpen, restore and transform your videos into stunning
            high-quality footage.
          </motion.p>

          <motion.div
            initial="hidden"
            animate="show"
            variants={fadeUp}
            transition={{ delay: 0.3 }}
            className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            <Button as={Link} to="/enhance" icon={ArrowRight}>
              Enhance a Video
            </Button>
            <Button as="a" href="#how-it-works" variant="secondary">
              See How It Works
            </Button>
          </motion.div>
        </div>
      </section>

      {/* FEATURES */}
      <section id="features" className="max-w-7xl mx-auto px-6 py-24">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold">
            Everything you need for <span className="text-gradient">flawless footage</span>
          </h2>
          <p className="mt-4 text-text-secondary">
            A complete enhancement pipeline built for quality, speed and privacy.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((f, i) => (
            <motion.div
              key={f.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.5, delay: i * 0.05 }}
            >
              <GlassCard hover className="h-full">
                <div className="w-11 h-11 rounded-xl bg-gradient-purple-violet flex items-center justify-center mb-4">
                  <f.icon size={20} className="text-white" />
                </div>
                <h3 className="font-semibold text-text-primary mb-2">{f.title}</h3>
                <p className="text-sm text-text-secondary">{f.desc}</p>
              </GlassCard>
            </motion.div>
          ))}
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section id="how-it-works" className="max-w-6xl mx-auto px-6 py-24">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold">
            How <span className="text-gradient">VIDEOLUX AI</span> works
          </h2>
          <p className="mt-4 text-text-secondary">
            Three simple steps between raw footage and a polished result.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
          {steps.map((s, i) => (
            <motion.div
              key={s.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className="relative text-center"
            >
              <div className="mx-auto w-16 h-16 rounded-2xl bg-gradient-purple-cyan flex items-center justify-center shadow-glow mb-5">
                <s.icon size={26} className="text-white" />
              </div>
              <div className="text-xs font-bold text-brand-cyan mb-2">STEP {i + 1}</div>
              <h3 className="font-semibold text-lg mb-2">{s.title}</h3>
              <p className="text-sm text-text-secondary max-w-xs mx-auto">{s.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* PRICING */}
      <section id="pricing" className="max-w-6xl mx-auto px-6 py-24">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold">
            Simple, <span className="text-gradient">transparent pricing</span>
          </h2>
          <p className="mt-4 text-text-secondary">Start free. Upgrade when you need more power.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-stretch">
          {plans.map((plan) => (
            <div
              key={plan.name}
              className={`rounded-2xl p-8 flex flex-col ${
                plan.highlighted
                  ? "bg-gradient-purple-cyan shadow-glow relative"
                  : "glass"
              }`}
            >
              {plan.highlighted && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-bg text-brand-cyan text-xs font-bold px-3 py-1 rounded-full border border-brand-cyan/30">
                  MOST POPULAR
                </div>
              )}
              <h3 className={`font-semibold text-lg ${plan.highlighted ? "text-white" : "text-text-primary"}`}>
                {plan.name}
              </h3>
              <div className="mt-4 flex items-baseline gap-1">
                <span className={`text-4xl font-extrabold ${plan.highlighted ? "text-white" : "text-text-primary"}`}>
                  {plan.price}
                </span>
                <span className={plan.highlighted ? "text-white/70" : "text-text-secondary"}>
                  {plan.period}
                </span>
              </div>
              <p className={`mt-3 text-sm ${plan.highlighted ? "text-white/80" : "text-text-secondary"}`}>
                {plan.desc}
              </p>

              <ul className="mt-6 space-y-3 flex-1">
                {plan.features.map((f) => (
                  <li
                    key={f}
                    className={`flex items-center gap-2 text-sm ${
                      plan.highlighted ? "text-white/90" : "text-text-secondary"
                    }`}
                  >
                    <Check size={16} className={plan.highlighted ? "text-white" : "text-brand-cyan"} />
                    {f}
                  </li>
                ))}
              </ul>

              <Button
                as={Link}
                to="/enhance"
                variant={plan.highlighted ? "secondary" : "primary"}
                className={`mt-8 w-full ${plan.highlighted ? "!bg-white !text-bg" : ""}`}
              >
                Get Started
              </Button>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="max-w-5xl mx-auto px-6 pb-24">
        <GlassCard className="text-center py-16 px-8">
          <h2 className="text-3xl sm:text-4xl font-bold mb-4">
            Ready to transform your footage?
          </h2>
          <p className="text-text-secondary max-w-xl mx-auto mb-8">
            Upload a video and see the VIDEOLUX AI enhancement pipeline in action.
          </p>
          <Button as={Link} to="/enhance" icon={ArrowRight}>
            Start Enhancing — It's Free
          </Button>
        </GlassCard>
      </section>
    </div>
  );
}
