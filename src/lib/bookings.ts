import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

export type BookingRow = {
  id: number;
  name: string;
  phone: string;
  area: string;
  service: string;
  notes: string;
  created_at: string;
};

export const createBooking = createServerFn({ method: "POST" })
  .validator(
    z.object({
      name: z.string().trim().min(1).max(80),
      phone: z.string().trim().min(8).max(20),
      area: z.string().trim().min(1).max(80),
      service: z.string().trim().min(1).max(80),
      notes: z.string().trim().max(500),
    }),
  )
  .handler(async ({ data }) => {
    const { getSql } = await import("@/lib/db");
    const sql = await getSql();
    await sql`
      insert into bookings (name, phone, area, service, notes)
      values (${data.name}, ${data.phone}, ${data.area}, ${data.service}, ${data.notes})
    `;
    return { ok: true as const };
  });

export const listBookings = createServerFn({ method: "POST" })
  .validator(z.object({ pin: z.string().trim().min(1).max(40) }))
  .handler(async ({ data }): Promise<{ ok: true; bookings: BookingRow[] } | { ok: false }> => {
    const { verifyOwnerPin } = await import("@/lib/owner-pin.server");
    if (!verifyOwnerPin(data.pin)) return { ok: false };
    const { getSql } = await import("@/lib/db");
    const sql = await getSql();
    const bookings = await sql<BookingRow>`
      select id, name, phone, area, service, notes, created_at::text as created_at
      from bookings
      order by created_at desc
      limit 100
    `;
    return { ok: true, bookings };
  });
