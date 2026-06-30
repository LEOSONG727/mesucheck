# DB Schema and Seed Spec

DB는 Supabase Postgres 기준으로 설계한다.

## 공통 원칙

- 세율·규제·법령 기준은 코드가 아니라 DB 테이블로 관리한다.
- 모든 규칙에는 `basis_date`, `effective_from`, `effective_to`, `source_url`, `verification_status`를 둔다.
- MVP seed 값은 데모/검증 필요 값이므로 반드시 `verification_status = 'needs_review'` 또는 memo에 검증 필요 표시를 둔다.
- 내부 금액 계산은 KRW 원 단위 integer로 통일한다.

---

## 1. complexes

아파트 단지 기본 정보.

```sql
create table complexes (
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
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);
```

---

## 2. transactions

실거래가 데이터. 국토부 API 연동 전에는 seed/mock로 사용한다.

```sql
create table transactions (
  id uuid primary key default gen_random_uuid(),
  complex_id uuid references complexes(id),
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
  created_at timestamptz default now()
);
```

---

## 3. acquisition_tax_rules

취득세 규칙.

```sql
create table acquisition_tax_rules (
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
  law_ref_id uuid,
  effective_from date not null,
  effective_to date,
  basis_date date not null,
  verification_status text not null default 'needs_review',
  memo text,
  created_at timestamptz default now()
);
```

주의: 6~9억 구간처럼 누진식이 필요한 경우 `acquisition_tax_formula`에 사람이 읽을 수 있는 설명을 넣고, 실제 계산 함수는 테스트 케이스로 검증한다.

---

## 4. incidental_fees

부대비용 규칙.

```sql
create table incidental_fees (
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
  law_ref_id uuid,
  effective_from date not null,
  effective_to date,
  basis_date date not null,
  verification_status text not null default 'needs_review',
  memo text,
  created_at timestamptz default now()
);
```

---

## 5. regulated_zones

규제지역 수동 관리 테이블.

```sql
create table regulated_zones (
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
  memo text,
  created_at timestamptz default now()
);
```

---

## 6. law_refs

법령 근거.

```sql
create table law_refs (
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
  created_at timestamptz default now()
);
```

---

## 7. concept_notes

정밀 계산하지 않는 개념 안내 카드.

```sql
create table concept_notes (
  id uuid primary key default gen_random_uuid(),
  note_key text not null unique,
  title text not null,
  summary text not null,
  body text,
  confidence_label text not null default 'concept_only',
  law_ref_id uuid,
  basis_date date not null,
  verification_status text not null default 'needs_review',
  created_at timestamptz default now()
);
```

---

## 8. reports

사용자가 생성한 리포트.

```sql
create table reports (
  id uuid primary key default gen_random_uuid(),
  complex_id uuid references complexes(id),
  input jsonb not null,
  output jsonb not null,
  basis_date date not null,
  share_token text unique,
  created_at timestamptz default now()
);
```

MVP 초기에는 DB 저장 대신 mock/local state로 시작 가능. Phase 3 이후 저장.

---

## 9. watchlist_items

관심단지.

```sql
create table watchlist_items (
  id uuid primary key default gen_random_uuid(),
  user_id uuid,
  anonymous_id text,
  complex_id uuid references complexes(id),
  saved_conditions jsonb,
  last_report_id uuid,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);
```

MVP 초기에는 localStorage 사용 가능.

---

## 10. newsletter_subscribers

뉴스레터 구독자.

```sql
create table newsletter_subscribers (
  id uuid primary key default gen_random_uuid(),
  email text not null,
  interested_region text,
  interested_topics text[],
  source text,
  consented_at timestamptz default now(),
  unsubscribed_at timestamptz,
  created_at timestamptz default now()
);
```

---

## 11. 운영 테이블 — 이후 Phase

```sql
create table watch_sources (
  id uuid primary key default gen_random_uuid(),
  source_type text not null check (source_type in ('law', 'rss', 'manual')),
  name text not null,
  target text not null,
  keywords text[],
  last_checked_at timestamptz,
  is_active boolean default true,
  created_at timestamptz default now()
);

create table review_queue (
  id uuid primary key default gen_random_uuid(),
  source_id uuid references watch_sources(id),
  title text not null,
  link text,
  detected_at timestamptz default now(),
  summary text,
  status text not null default 'new' check (status in ('new', 'reviewing', 'applied', 'ignored')),
  created_at timestamptz default now()
);

create table rule_change_log (
  id uuid primary key default gen_random_uuid(),
  rule_table text not null,
  rule_id uuid,
  change_summary text not null,
  before_value jsonb,
  after_value jsonb,
  effective_from date,
  law_ref_id uuid,
  applied_by text,
  applied_at timestamptz default now()
);
```

---

## Seed 데이터 원칙

초기 seed는 실제 서비스 확정값이 아니라 MVP용 검증 데이터다.

- 모든 세율/규제/법령 seed에 `verification_status = 'needs_review'`
- 모든 화면에 기준일 표시
- README에 “실제 런칭 전 세무/법무 검증 필요” 명시

