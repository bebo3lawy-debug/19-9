import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

export function SiteHeader() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 72);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-50 transition-[opacity,transform,background-color,border-color] duration-200",
        scrolled
          ? "translate-y-0 border-b border-border bg-background/90 opacity-100 backdrop-blur-md"
          : "pointer-events-none -translate-y-2 border-b border-transparent bg-transparent opacity-0",
      )}
    >
      <div className="mx-auto flex h-12 max-w-lg items-center px-4 sm:max-w-xl">
        <a href="#top" className="font-display text-base font-semibold text-gold-bright">
          مساج منزلي برايفت
        </a>
      </div>
    </header>
  );
}
