import { Link } from "react-router-dom";
import { Github, Twitter, Linkedin } from "lucide-react";
import Logo from "./Logo";

export default function Footer() {
  return (
    <footer id="contact" className="border-t border-white/5 mt-24">
      <div className="max-w-7xl mx-auto px-6 py-14 grid grid-cols-1 md:grid-cols-4 gap-10">
        <div className="md:col-span-2">
          <Logo />
          <p className="mt-4 text-text-secondary text-sm max-w-sm">
            Enhance Your Videos With AI. Upscale, sharpen, restore and transform your
            footage into stunning high-quality video.
          </p>
          <div className="flex gap-4 mt-6">
            {[Github, Twitter, Linkedin].map((Icon, i) => (
              <a
                key={i}
                href="#"
                className="w-9 h-9 rounded-lg glass flex items-center justify-center text-text-secondary hover:text-brand-cyan transition-colors"
              >
                <Icon size={16} />
              </a>
            ))}
          </div>
        </div>

        <div>
          <h4 className="text-text-primary font-semibold mb-4 text-sm">Product</h4>
          <ul className="space-y-3 text-sm text-text-secondary">
            <li><a href="/#features" className="hover:text-text-primary">Features</a></li>
            <li><a href="/#how-it-works" className="hover:text-text-primary">How It Works</a></li>
            <li><a href="/#pricing" className="hover:text-text-primary">Pricing</a></li>
            <li><Link to="/enhance" className="hover:text-text-primary">Enhance a Video</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="text-text-primary font-semibold mb-4 text-sm">Company</h4>
          <ul className="space-y-3 text-sm text-text-secondary">
            <li><a href="#" className="hover:text-text-primary">About</a></li>
            <li><a href="#" className="hover:text-text-primary">Privacy Policy</a></li>
            <li><a href="#" className="hover:text-text-primary">Terms of Service</a></li>
            <li><a href="#contact" className="hover:text-text-primary">Contact</a></li>
          </ul>
        </div>
      </div>

      <div className="border-t border-white/5 py-6 text-center text-xs text-text-secondary">
        © {new Date().getFullYear()} VIDEOLUX AI. All rights reserved.
      </div>
    </footer>
  );
}
