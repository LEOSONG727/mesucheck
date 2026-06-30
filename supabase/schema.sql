create extension if not exists pgcrypto;

create table if not exists law_refs (
  id uuid primary key default gen_random_uuid(),
  law_name text not null,
  article text,
  clause text,
  title text,
  summary text,
  original_text text,
  law_api_id text,
  source_url text,
  enforcement_date date,
  basis_date date not null,
  last_synced_at timestamptz,
  verification_status text not null default 'needs_review',
  memo text,
  created_at timestamptz default now()
);

create table if not exists complexes (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  sido text not null default '서울특별시',
  sigungu text not null default '광진구',
  dong text not null default '자양동',
  lawd_cd text not null default '11215',
  address text,
  built_year integer,
  household_count integer,
  default_area_m2 numeric,
  naver_land_url text,
  hogangnono_url text,
  zigbang_url text,
  basis_date date not null,
  verification_status text not null default 'needs_review',
  memo text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create table if not exists transactions (
  id uuid primary key default gen_random_uuid(),
  complex_id uuid references complexes(id) on delete cascade,
  lawd_cd text not null,
  deal_ym text not null,
  deal_date date,
  deal_amount_krw bigint not null,
  deposit_krw bigint,
  monthly_rent_krw bigint,
  area_m2 numeric not null,
  floor integer,
  transaction_type text not null check (transaction_type in ('trade', 'rent')),
  source text not null default 'MOLIT',
  source_raw jsonb,
  basis_date date not null,
  verification_status text not null default 'needs_review',
  memo text,
  created_at timestamptz default now()
);

create table if not exists acquisition_tax_rules (
  id uuid primary key default gen_random_uuid(),
  home_count_min integer not null,
  home_count_max integer,
  zone_type text not null,
  price_min_krw bigint,
  price_max_krw bigint,
  area_threshold_m2 numeric,
  acquisition_tax_rate numeric,
  acquisition_tax_formula text,
  local_education_tax_rate numeric,
  special_rural_tax_rate numeric,
  label text not null,
  description text,
  law_ref_id uuid references law_refs(id),
  effective_from date not null,
  effective_to date,
  basis_date date not null,
  verification_status text not null default 'needs_review',
  memo text,
  created_at timestamptz default now()
);

create table if not exists incidental_fees (
  id uuid primary key default gen_random_uuid(),
  fee_key text not null,
  label text not null,
  calculation_type text not null check (calculation_type in ('fixed', 'rate', 'range', 'manual_note')),
  price_min_krw bigint,
  price_max_krw bigint,
  rate numeric,
  fixed_amount_krw bigint,
  min_amount_krw bigint,
  max_amount_krw bigint,
  confidence_label text not null check (confidence_label in ('rule_based', 'variable', 'needs_expert_check', 'concept_only')),
  description text,
  law_ref_id uuid references law_refs(id),
  effective_from date not null,
  effective_to date,
  basis_date date not null,
  verification_status text not null default 'needs_review',
  memo text,
  created_at timestamptz default now()
);

create table if not exists regulated_zones (
  id uuid primary key default gen_random_uuid(),
  lawd_cd text not null,
  sido text,
  sigungu text,
  dong text,
  zone_type text not null,
  is_active boolean not null default true,
  effective_from date not null,
  effective_to date,
  source_title text,
  source_url text,
  basis_date date not null,
  verification_status text not null default 'needs_review',
  memo text,
  created_at timestamptz default now()
);

create table if not exists concept_notes (
  id uuid primary key default gen_random_uuid(),
  note_key text not null unique,
  title text not null,
  summary text not null,
  body text,
  confidence_label text not null default 'concept_only' check (confidence_label in ('rule_based', 'variable', 'needs_expert_check', 'concept_only')),
  law_ref_id uuid references law_refs(id),
  basis_date date not null,
  verification_status text not null default 'needs_review',
  memo text,
  created_at timestamptz default now()
);

create table if not exists reports (
  id uuid primary key default gen_random_uuid(),
  complex_id uuid references complexes(id),
  input jsonb not null,
  output jsonb not null,
  basis_date date not null,
  share_token text unique,
  created_at timestamptz default now()
);

create table if not exists watchlist_items (
  id uuid primary key default gen_random_uuid(),
  user_id uuid,
  anonymous_id text,
  complex_id uuid references complexes(id),
  saved_conditions jsonb,
  last_report_id uuid references reports(id),
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create table if not exists newsletter_subscribers (
  id uuid primary key default gen_random_uuid(),
  email text not null,
  interested_region text,
  interested_topics text[],
  source text,
  consented_at timestamptz default now(),
  unsubscribed_at timestamptz,
  created_at timestamptz default now()
);

create index if not exists complexes_lawd_cd_idx on complexes(lawd_cd);
create index if not exists complexes_name_idx on complexes using gin (to_tsvector('simple', name));
create index if not exists transactions_complex_deal_idx on transactions(complex_id, deal_date desc);
create index if not exists acquisition_tax_rules_lookup_idx on acquisition_tax_rules(home_count_min, home_count_max, zone_type, effective_from, effective_to);
create index if not exists regulated_zones_lawd_active_idx on regulated_zones(lawd_cd, is_active);
create index if not exists watchlist_items_anonymous_idx on watchlist_items(anonymous_id);
create index if not exists newsletter_subscribers_email_idx on newsletter_subscribers(email);
