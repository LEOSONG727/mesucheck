# Phase Tasks for Codex

## Phase 0 — Project Setup

Prompt:

```txt
Next.js App Router + TypeScript 프로젝트를 세팅하라. strict mode, 기본 라우팅, CSS variables 디자인 토큰, Supabase client/server 유틸, formatter 유틸, README 실행 방법을 포함하라. 아직 실제 API 연동과 계산 엔진은 구현하지 마라.
```

완료 기준:

- npm run dev 실행
- 기본 홈 화면 표시
- README 작성
- .env.local.example 작성

---

## Phase 1 — DB Schema and Seed

Prompt:

```txt
03_DB_SCHEMA_AND_SEED_SPEC.md 기준으로 Supabase SQL schema와 seed 파일을 작성하라. 초기 지역은 서울 광진구 자양동이며 LAWD_CD=11215다. 세율/규제/법령 seed에는 verification_status='needs_review'와 basis_date를 포함하라.
```

완료 기준:

- schema.sql
- seed.sql
- 마이그레이션 실행 방법
- seed 데이터 설명

---

## Phase 2 — Static MVP UI from Design Reference

Prompt:

```txt
design_reference_매수체크_v3.zip 안의 HTML 프로토타입을 참고해 Next.js 컴포넌트 기반 UI를 구현하라. 홈/검색, 조건 입력, 리포트, 워치리스트, 뉴스레터, Loading/Empty/Error, Toast, 차트 tooltip, 전문가 질문 복사, localStorage 관심단지 저장을 포함하라. 계산은 mock JSON으로 연결하고 실제 API는 호출하지 마라.
```

완료 기준:

- 디자인 방향 반영
- 조건 입력 후 리포트 표시
- 관심단지 저장 상태 동작
- 질문 복사 Toast
- 뉴스레터 Toast
- Empty/Error/Loading 데모 가능

---

## Phase 3 — Rule Engine API

Prompt:

```txt
04_RULE_ENGINE_AND_TEST_CASES.md 기준으로 비용 계산 엔진을 구현하라. 세율은 코드 하드코딩이 아니라 DB 규칙 테이블에서 조회하라. POST /api/cost-estimate를 구현하고 테스트 케이스를 작성하라. AI는 계산에 사용하지 마라.
```

완료 기준:

- POST /api/cost-estimate
- rule engine unit tests
- CostEstimateReport JSON 반환
- confidenceLabel/lawRef/disclaimer 포함

---

## Phase 4 — MOLIT API Integration

Prompt:

```txt
05_API_INTEGRATION_GUIDE.md 기준으로 국토교통부 아파트 매매 실거래가 API 연동을 구현하라. 클라이언트에서 직접 호출하지 말고 서버 Route 또는 Edge Function에서 호출하라. XML 파싱, 금액 단위 변환, 캐싱/DB 저장, 실패 시 Error State를 구현하라.
```

완료 기준:

- MOLIT API wrapper
- parseMolitAmountToKRW
- transactions upsert
- 단지별 최근 실거래 요약
- 실패 시 에러 처리

---

## Phase 5 — Report Persistence and Share

Prompt:

```txt
리포트 저장과 공유 링크를 구현하라. reports 테이블에 input/output/basis_date/share_token을 저장하고, /reports/[id] 또는 /share/[token]에서 리포트를 볼 수 있게 하라. 공유 링크에는 개인정보를 최소화하라.
```

완료 기준:

- reports 저장
- share token 생성
- 공유 링크 표시
- 개인정보 최소화

---

## Phase 6 — Watchlist and Newsletter DB

Prompt:

```txt
localStorage 기반 관심단지를 Supabase 저장 구조로 확장하라. newsletter_subscribers에 이메일/관심지역/관심주제를 저장하라. 로그인 없는 anonymous_id 기반으로 시작하되, 향후 Supabase Auth 확장이 가능하게 설계하라.
```

완료 기준:

- watchlist_items 저장
- newsletter_subscribers 저장
- 중복 구독 처리
- 동의 시각 저장

---

## Phase 7 — Admin/Operations Skeleton

Prompt:

```txt
규칙/법령/규제 변경 운영을 위한 최소 admin skeleton을 만든다. review_queue, rule_change_log, watch_sources 테이블을 표시하고, 수동 반영/무시 상태를 바꿀 수 있게 하라. 실제 자동 센싱은 아직 구현하지 않아도 된다.
```

완료 기준:

- /admin/review skeleton
- review_queue 목록
- status 변경
- rule_change_log 보기

