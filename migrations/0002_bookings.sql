create table if not exists bookings (
  id         serial primary key,
  name       text not null,
  phone      text not null default '',
  area       text not null,
  service    text not null,
  notes      text not null default '',
  created_at timestamptz not null default now()
);
