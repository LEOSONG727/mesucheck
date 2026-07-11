# 매수체크 MVP

부동산 매수 전 리스크 체크 리포트 서비스 `매수체크`의 Phase 0~3 구현입니다.

현재 범위는 정적 MVP UI와 DB 규칙 기반 비용 계산 엔진까지입니다. 실제 공공 API 호출, 리포트 DB 저장, 공유 링크, 로그인, 결제, 전문가 매칭, 자동 법령 센싱은 포함하지 않았습니다.

## 구현 범위

- Next.js App Router + TypeScript strict 기반 프로젝트
- CSS variables 기반 디자인 토큰
- Supabase browser/server 유틸
- mock/Supabase 전환을 위한 repository 데이터 접근 계층
- formatter 유틸
- 홈/검색, 단지 요약, 조건 입력, 리포트, 관심단지, 뉴스레터 라우트
- localStorage 기반 관심단지 저장
- mock 리포트와 비용 Breakdown
- 신뢰 라벨, 기준일, 근거 보기, 면책 문구
- 전문가 질문 복사 Toast
- 뉴스레터 구독 mock Toast
- Loading / Empty / Error 상태
- 차트 hover/touch tooltip
- Supabase `schema.sql`, `seed.sql`
- DB 규칙/Supabase fallback 저장소
- deterministic 취득세·부대비용 계산 엔진
- `POST /api/cost-estimate`
- Phase 3 필수 사례 단위 테스트

## 설치

```bash
npm install
```

환경변수 파일은 필요할 때만 복사합니다.

```bash
cp .env.local.example .env.local
```

Phase 0~2는 기본값에서 외부 API와 Supabase 연결 없이 실행됩니다.

## 실행

```bash
npm run dev
```

브라우저에서 `http://localhost:3000`을 엽니다.

## 주요 경로

- `/` 홈/검색
- `/complexes/terrapalace-gundae-2` 단지 요약
- `/estimate?complexId=terrapalace-gundae-2` 조건 입력
- `/reports/demo` 규칙 엔진 리포트
- `/api/cost-estimate` 비용 견적 POST API
- `/watchlist` 관심단지
- `/newsletter` 뉴스레터

## 테스트 방법

```bash
npm run test
npm run build
```

수동 확인:

- 홈에서 `자양동`, `래미안`, `더샵` 검색
- 존재하지 않는 단지명을 입력해 Empty 상태 확인
- 검색창에 `오류` 입력해 Error 상태 확인
- 단지 상세에서 차트 포인트 hover/touch tooltip 확인
- 조건 입력 후 리포트 생성 Loading 문구 확인
- 리포트에서 근거 보기, 질문 복사, PDF 준비 중 Toast 확인
- 관심단지 저장 후 `/watchlist`에서 저장 상태 확인
- 뉴스레터 이메일 입력 후 구독 Toast 확인

## DB 적용

Supabase SQL editor에서 순서대로 실행합니다.

1. `supabase/schema.sql`
2. `supabase/seed.sql`

모든 세금·규제·법령 seed는 `basis_date='2026-06-30'`, `verification_status='needs_review'` 기준의 검토용 데이터입니다.

단지 목록/요약 조회를 Supabase adapter로 시도하려면 `.env.local`에서 아래 값을 설정합니다.

```env
MAESUCHECK_DATA_SOURCE=supabase
NEXT_PUBLIC_SUPABASE_URL=...
NEXT_PUBLIC_SUPABASE_ANON_KEY=...
SUPABASE_SERVICE_ROLE_KEY=...
```

Supabase env가 없거나 조회 결과가 비어 있으면 mock 데이터로 fallback합니다.

## 비용 견적 API

```bash
curl -X POST http://localhost:3000/api/cost-estimate \
  -H 'content-type: application/json' \
  -d '{
    "complexId":"terrapalace-gundae-2",
    "priceKRW":1000000000,
    "areaM2":84.9,
    "homeCountAfterPurchase":1,
    "isActualResidence":true,
    "isFirstHomeBuyer":"unknown",
    "willUseLoan":true,
    "isTemporaryTwoHome":"unknown",
    "willDisposeExistingHome":"unknown"
  }'
```

기본 로컬 실행에서는 검토용 seed fallback을 사용합니다. Supabase 모드에서는
`acquisition_tax_rules`, `incidental_fees`, `law_refs`, `regulated_zones`,
`concept_notes`를 조회합니다. 규칙 조회 실패 시 결과를 중단하지 않고 검토용 seed로
fallback하지만, 모든 규칙은 `needs_review` 상태와 기준일을 결과에 표시합니다.

## 아직 mock/demo인 부분

- 실거래가 데이터는 mock seed
- 규칙 seed는 실제 런칭 전 세무·법무 전문가 최종 검증 필요
- 관심단지는 localStorage 저장
- 뉴스레터는 Toast만 표시
- PDF/공유 링크는 준비 중 상태
- Supabase adapter는 단지 목록/요약 조회 준비 단계이며, 기본 실행은 mock fallback

## 다음 Phase

- Phase 4: 국토부 실거래가 API 서버 연동 및 transactions upsert
- Phase 5: reports 저장과 공유 링크
- Phase 6: watchlist/newsletter Supabase 저장
- Phase 7: 규칙/법령 변경 운영 skeleton

## 법무/세무 검증 필요

- 취득세 규칙 seed
- 지방교육세/농어촌특별세 조건
- 생애최초 감면 조건
- 일시적 2주택 예외 조건
- 중개보수 상한 표현
- 등기/법무사/국민주택채권 표현
- LTV/DSR 안내 문구
- 규제지역 seed
- 면책 문구와 개인정보/이용약관
