import { type FormEvent, type ReactNode, useEffect, useState } from "react";
import { Link } from "@tanstack/react-router";
import {
  BadgeCheck,
  Clock3,
  Droplets,
  GraduationCap,
  Hand,
  HeartPulse,
  Home,
  Layers,
  MapPin,
  PersonStanding,
  UserRound,
  Wind,
} from "lucide-react";
import { SiteHeader } from "@/components/site-header";
import { createBooking } from "@/lib/bookings";
import {
  BOOKING_NOTES,
  CAPTAIN_NAME,
  SERVICE_HINT,
  SERVICES,
  SESSION_FACTS,
  SESSION_TYPES,
  SITE_TAGLINE,
} from "@/lib/site";
import { cn } from "@/lib/utils";

const SERVICE_ICONS: Record<string, ReactNode> = {
  relaxation: <Wind className="size-6" />,
  swedish: <Hand className="size-6" />,
  therapeutic: <HeartPulse className="size-6" />,
  deep: <Layers className="size-6" />,
  thai: <PersonStanding className="size-6" />,
  hijama: <Droplets className="size-6" />,
};

const REVEAL_VARIANTS = ["up", "left", "right", "scale", "up", "left"] as const;

const FACT_ICONS: Record<string, ReactNode> = {
  home: <Home className="size-5" />,
  men: <UserRound className="size-5" />,
  area: <MapPin className="size-5" />,
  duration: <Clock3 className="size-5" />,
  deposit: <BadgeCheck className="size-5" />,
};

const DOCK = [
  { id: "about", label: "من أنا" },
  { id: "services", label: "الخدمات" },
  { id: "book", label: "الحجز" },
] as const;

function useReveal() {
  useEffect(() => {
    const nodes = document.querySelectorAll("[data-reveal], [data-img]");
    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            io.unobserve(entry.target);
          }
        }
      },
      { threshold: 0.16, rootMargin: "0px 0px -10% 0px" },
    );
    nodes.forEach((node) => {
      const rect = node.getBoundingClientRect();
      if (rect.top < window.innerHeight * 0.86 && rect.bottom > 56) {
        node.classList.add("is-visible");
      } else {
        io.observe(node);
      }
    });
    return () => io.disconnect();
  }, []);
}

function useActiveSection() {
  const [active, setActive] = useState("");

  useEffect(() => {
    const onScroll = () => {
      const marker = window.scrollY + window.innerHeight * 0.34;
      const order = [
        { id: "about", nav: "about" },
        { id: "services", nav: "services" },
        { id: "session", nav: "services" },
        { id: "book", nav: "book" },
      ];
      let current = "";
      for (const item of order) {
        const el = document.getElementById(item.id);
        if (el && el.offsetTop <= marker) current = item.nav;
      }
      setActive(current);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return active;
}

function scrollToId(id: string) {
  const el = document.getElementById(id);
  if (!el) return;
  el.scrollIntoView({ behavior: "smooth", block: "start" });
  el.classList.remove("is-arriving");
  void el.offsetWidth;
  el.classList.add("is-arriving");
}

export function LandingPage() {
  useReveal();
  const active = useActiveSection();

  return (
    <div id="top" className="relative min-h-dvh bg-background pb-28">
      <SiteHeader />
      <Hero />
      <About />
      <Services />
      <Session />
      <Booking />
      <Footer />
      <nav className="dock" aria-label="تنقل الصفحة">
        {DOCK.map((item) => (
          <button
            key={item.id}
            type="button"
            className={cn("dock-btn", active === item.id && "is-active")}
            onClick={() => scrollToId(item.id)}
          >
            {item.label}
          </button>
        ))}
      </nav>
    </div>
  );
}

function Hero() {
  return (
    <section className="relative overflow-hidden">
      <img
        src="/images/hero.jpg"
        alt=""
        className="hero-photo absolute inset-0 size-full object-cover object-[80%_center] brightness-[0.58] contrast-110 saturate-80"
      />
      <div className="hero-veil absolute inset-0" />
      <div className="relative mx-auto flex min-h-[28rem] max-w-lg flex-col justify-end px-5 pb-8 pt-10 sm:max-w-xl sm:min-h-[32rem]">
        <div className="hero-copy">
          <h1 className="gold-text font-display text-4xl font-bold leading-none sm:text-5xl">
            مساج منزلي برايفت
          </h1>
          <p className="mt-3 font-display text-2xl text-foreground">{SITE_TAGLINE}</p>
          <div className="mt-4 flex flex-wrap gap-2">
            <span className="chip">للرجال فقط</span>
            <span className="chip">زيارات منزلية داخل مصر</span>
          </div>
          <a
            href="#book"
            className="btn-gold mt-6"
            onClick={(event) => {
              event.preventDefault();
              scrollToId("book");
            }}
          >
            احجز جلستك
          </a>
        </div>
      </div>
    </section>
  );
}

function About() {
  return (
    <section id="about" className="scroll-mt-16 px-5 py-12">
      <div className="mx-auto max-w-lg sm:max-w-xl" data-reveal>
        <p className="section-kicker">من أنا</p>
        <h2 className="mt-4 font-display text-3xl font-semibold leading-snug">{CAPTAIN_NAME}</h2>
        <p className="mt-4 flex items-center gap-2.5 text-lg text-muted">
          <GraduationCap className="icon-float size-5 shrink-0 text-gold" />
          خريج تربية رياضية
        </p>
        <p className="mt-2.5 flex items-center gap-2.5 text-lg text-muted">
          <BadgeCheck className="icon-float size-5 shrink-0 text-gold" />
          مدرب معتمد من نقابة المهن الرياضية
        </p>
        <p className="mt-5 text-lg leading-8 text-muted">
          جلسات مساج منزلية برايفت للرجال. قبل الجلسة بحدد الأسلوب والضغط المناسب لراحتك.
        </p>
      </div>
    </section>
  );
}

function Services() {
  return (
    <section id="services" className="scroll-mt-16 px-5 py-11">
      <div className="mx-auto max-w-lg sm:max-w-xl">
        <h2 className="section-kicker" data-reveal>
          الخدمات
        </h2>
        <div className="mt-6 grid gap-4">
          {SERVICES.map((service, index) => (
            <article
              key={service.id}
              className="service-card"
              data-reveal={REVEAL_VARIANTS[index]}
              data-delay={String(index + 1)}
            >
              <span className="icon-btn size-12 shrink-0">{SERVICE_ICONS[service.id]}</span>
              <div>
                <h3 className="font-display text-xl font-semibold leading-snug">{service.title}</h3>
                <p className="mt-1.5 text-lg leading-8 text-muted">{service.body}</p>
              </div>
            </article>
          ))}
        </div>
        <p className="hint-line mt-5" data-reveal="up">
          {SERVICE_HINT}
        </p>
      </div>
    </section>
  );
}

function Session() {
  return (
    <section id="session" className="scroll-mt-16 px-5 py-8">
      <div className="mx-auto max-w-lg sm:max-w-xl">
        <h2 className="section-kicker" data-reveal>
          معلومات الجلسة
        </h2>
        <ul className="fact-list mt-4" data-reveal="up">
          {SESSION_FACTS.map((fact) => (
            <li key={fact.id} className="fact-row">
              <span className="text-gold">{FACT_ICONS[fact.id]}</span>
              <span className="text-lg leading-7">{fact.text}</span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

function Booking() {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [area, setArea] = useState("");
  const [service, setService] = useState<string>(SESSION_TYPES[0]);
  const [notes, setNotes] = useState("");
  const [error, setError] = useState("");
  const [sent, setSent] = useState(false);
  const [sending, setSending] = useState(false);

  async function onSubmit(event: FormEvent) {
    event.preventDefault();
    if (!name.trim() || !phone.trim() || !area.trim()) {
      setError("اكتب الاسم ورقم الموبايل والمنطقة قبل الإرسال.");
      return;
    }
    setSending(true);
    setError("");
    try {
      await createBooking({
        data: {
          name: name.trim(),
          phone: phone.trim(),
          area: area.trim(),
          service,
          notes: notes.trim(),
        },
      });
      setSent(true);
    } catch {
      setError("حصل مشكلة في الإرسال. جرّب تاني.");
    } finally {
      setSending(false);
    }
  }

  return (
    <section id="book" className="scroll-mt-16 px-5 pt-11 pb-12">
      <div className="mx-auto max-w-lg sm:max-w-xl">
        <h2 className="font-display text-3xl font-semibold" data-reveal>
          احجز جلستك
        </h2>
        <p className="mt-3 text-lg leading-8 text-muted" data-reveal="up">
          املأ البيانات واضغط إرسال.
        </p>

        {sent ? (
          <div className="success-card mt-6" data-reveal="scale">
            <BadgeCheck className="size-11 text-gold" />
            <p className="mt-3 font-display text-2xl font-semibold">تم استلام طلبك</p>
            <p className="mt-2 text-lg leading-8 text-muted">تم استلام الطلب بنجاح.</p>
            <button
              type="button"
              className="btn-gold mt-6"
              onClick={() => {
                setSent(false);
                setName("");
                setPhone("");
                setArea("");
                setService(SESSION_TYPES[0]);
                setNotes("");
                setError("");
              }}
            >
              حجز جديد
            </button>
          </div>
        ) : (
          <form onSubmit={onSubmit} className="surface-card mt-6 rounded-xl p-5 sm:p-6" data-reveal="up">
            <label className="mb-4 block">
              <span className="mb-1.5 block text-lg text-muted">الاسم</span>
              <input
                className={cn("field", error && !name.trim() && "field-error")}
                value={name}
                onChange={(e) => {
                  setName(e.target.value);
                  setError("");
                }}
                placeholder="اكتب اسمك"
                autoComplete="name"
                required
                suppressHydrationWarning
              />
            </label>
            <label className="mb-4 block">
              <span className="mb-1.5 block text-lg text-muted">رقم الموبايل</span>
              <input
                className={cn("field", error && !phone.trim() && "field-error")}
                value={phone}
                onChange={(e) => {
                  setPhone(e.target.value);
                  setError("");
                }}
                placeholder="01xxxxxxxxx"
                autoComplete="tel"
                inputMode="tel"
                dir="ltr"
                required
                suppressHydrationWarning
              />
            </label>
            <label className="mb-4 block">
              <span className="mb-1.5 block text-lg text-muted">المنطقة / المحافظة</span>
              <input
                className={cn("field", error && !area.trim() && "field-error")}
                value={area}
                onChange={(e) => {
                  setArea(e.target.value);
                  setError("");
                }}
                placeholder="مثال: الإسكندرية"
                autoComplete="address-level1"
                required
                suppressHydrationWarning
              />
            </label>
            <label className="mb-4 block">
              <span className="mb-1.5 block text-lg text-muted">نوع الجلسة</span>
              <select
                className="field"
                value={service}
                onChange={(e) => setService(e.target.value)}
              >
                {SESSION_TYPES.map((item) => (
                  <option key={item} value={item}>
                    {item}
                  </option>
                ))}
              </select>
            </label>
            <label className="mb-5 block">
              <span className="mb-1.5 block text-lg text-muted">ملاحظات</span>
              <textarea
                className="field min-h-28 py-3"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="اكتب احتياجك أو أي ملاحظة"
                suppressHydrationWarning
              />
            </label>
            {error ? <p className="mb-4 text-lg form-error-text">{error}</p> : null}
            <div className="note-box mb-5">
              {BOOKING_NOTES.map((note) => (
                <p key={note}>{note}</p>
              ))}
            </div>
            <button type="submit" className="btn-gold w-full" disabled={sending}>
              {sending ? "جاري الإرسال..." : "إرسال طلب الحجز"}
            </button>
          </form>
        )}
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer className="px-5 pb-5 pt-2">
      <div className="mx-auto max-w-lg border-t border-border pt-5 text-center sm:max-w-xl">
        <p className="font-display text-xl text-gold-bright">مساج منزلي برايفت</p>
        <Link to="/talabat" className="mt-1 inline-block text-lg text-muted">
          {CAPTAIN_NAME}
        </Link>
      </div>
    </footer>
  );
}
