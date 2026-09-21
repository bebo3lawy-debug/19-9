import { useEffect, useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { listBookings, type BookingRow } from "@/lib/bookings";
import { CAPTAIN_NAME } from "@/lib/site";

export const Route = createFileRoute("/talabat")({ component: OwnerInbox });

const PIN_KEY = "owner-pin";

function formatWhen(value: string) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return date.toLocaleString("ar-EG", {
    timeZone: "Africa/Cairo",
    dateStyle: "medium",
    timeStyle: "short",
  });
}

function OwnerInbox() {
  const [pin, setPin] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [bookings, setBookings] = useState<BookingRow[] | null>(null);

  async function load(nextPin: string) {
    setLoading(true);
    setError("");
    try {
      const result = await listBookings({ data: { pin: nextPin } });
      if (!result.ok) {
        sessionStorage.removeItem(PIN_KEY);
        setBookings(null);
        setError("الرقم السري غلط.");
        return;
      }
      sessionStorage.setItem(PIN_KEY, nextPin);
      setBookings(result.bookings);
    } catch {
      setError("حصل مشكلة في تحميل الطلبات. جرّب تاني.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    const saved = sessionStorage.getItem(PIN_KEY);
    if (saved) {
      setPin(saved);
      void load(saved);
      return;
    }
    setLoading(false);
  }, []);

  return (
    <div className="min-h-dvh bg-background px-5 pb-10 pt-8">
      <div className="mx-auto max-w-lg sm:max-w-xl">
        <p className="section-kicker">صاحب الموقع</p>
        <h1 className="mt-2 font-display text-3xl font-semibold">الطلبات</h1>
        <p className="mt-2 text-lg text-muted">{CAPTAIN_NAME}</p>

        {bookings ? (
          <div className="mt-6">
            <div className="mb-4 flex items-center justify-between gap-3">
              <p className="text-lg text-gold-bright">
                {bookings.length === 0 ? "مفيش طلبات لسه." : `${bookings.length} طلب`}
              </p>
              <button type="button" className="btn-ghost h-11 min-h-11 px-4 text-base" onClick={() => void load(pin)}>
                تحديث
              </button>
            </div>
            <div className="grid gap-3">
              {bookings.map((item) => (
                <article key={item.id} className="surface-card rounded-xl p-4">
                  <p className="font-display text-xl font-semibold">{item.name}</p>
                  <p className="mt-1 text-lg text-gold-bright" dir="ltr">
                    {item.phone}
                  </p>
                  <p className="mt-2 text-base text-muted">{item.area}</p>
                  <p className="mt-1 text-lg">{item.service}</p>
                  {item.notes ? <p className="mt-2 text-base leading-7 text-muted">{item.notes}</p> : null}
                  <p className="mt-3 text-sm text-subtle">{formatWhen(item.created_at)}</p>
                </article>
              ))}
            </div>
          </div>
        ) : (
          <form
            className="surface-card mt-6 rounded-xl p-5"
            onSubmit={(event) => {
              event.preventDefault();
              if (!pin.trim()) {
                setError("اكتب الرقم السري.");
                return;
              }
              void load(pin);
            }}
          >
            <label className="mb-4 block">
              <span className="mb-1.5 block text-lg text-muted">الرقم السري</span>
              <input
                className="field"
                value={pin}
                onChange={(e) => {
                  setPin(e.target.value);
                  setError("");
                }}
                type="password"
                autoComplete="current-password"
                placeholder="اكتب الرقم السري"
              />
            </label>
            {error ? <p className="mb-3 text-lg form-error-text">{error}</p> : null}
            <button type="submit" className="btn-gold w-full" disabled={loading}>
              {loading ? "جاري الفتح..." : "فتح الطلبات"}
            </button>
          </form>
        )}

        <Link to="/" className="btn-ghost mt-6 w-full">
          الرجوع للموقع
        </Link>
      </div>
    </div>
  );
}
