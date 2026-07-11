# 매수체크 MVP

부동산 매수 전 리스크 체크 리포트 서비스 `매수체크`의 Phase 0~4 구현입니다.

현재 범위는 정적 MVP UI, DB 규칙 기반 비용 계산 엔진, 국토교통부 아파트 실거래가 및 행정안전부 법정동코드 조회까지입니다. 리포트 DB 저장, 공유 링크, 로그인, 결제, 전문가 매칭, 자동 법령 센싱은 포함하지 않았습니다.

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
- 국토교통부 아파트 매매·전월세 실거래가 서버 연동
- 행정안전부 법정동코드 검색
- 홈 주소 검색 → 법정동 선택 → 최근 실거래 단지·면적 선택 흐름
- 공개데이터 단지 선택값을 상세·견적·리포트까지 재현하는 검증형 ID
- 취소 거래 제외, 동일 단지·유사 면적(±3㎡) 통계
- 최근 거래·중앙값·최저/최고·전세가율·월별 평단가 계산
- API 키 서버 전용 보관과 공개 응답 비노출
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

공공데이터 연동 시 `.env.local`에 아래 값을 둡니다. 인증키가 없으면 단지 상세는
검토용 데이터로 안전하게 fallback합니다.

```env
DATA_GO_KR_SERVICE_KEY=
MOLIT_APT_TRADE_API_URL=https://apis.data.go.kr/1613000/RTMSDataSvcAptTrade/getRTMSDataSvcAptTrade
MOLIT_APT_RENT_API_URL=https://apis.data.go.kr/1613000/RTMSDataSvcAptRent/getRTMSDataSvcAptRent
MOIS_LEGAL_DONG_API_URL=https://apis.data.go.kr/1741000/StanReginCd/getStanReginCdList
```

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
- `/api/public-data/legal-dongs?q=서울특별시 광진구 자양동` 법정동 검색
- `/api/public-data/apartment-complexes?lawdCd=11215&dong=자양동&fullName=서울특별시%20광진구%20자양동&months=6` 최근 실거래 단지 검색
- `/api/public-data/apartment-market?lawdCd=11215&apartmentName=테라팰리스%20건대2차&areaM2=84.9&months=6` 실거래 통계
- `/watchlist` 관심단지
- `/newsletter` 뉴스레터

## 테스트 방법

```bash
npm run test
npm run build
```

수동 확인:

- 홈에서 `서울 광진구 자양동` 검색 후 정확한 법정동 선택
- 조회된 실제 단지에서 전용면적을 선택해 상세·견적·리포트 이동 확인
- 최근 거래가 없는 법정동과 공공 API 장애 시 Empty/Error 상태 확인
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

## 공공데이터 처리 원칙

- 공공데이터 호출은 Route Handler와 서버 저장소에서만 수행합니다.
- 인증키는 `.env.local`에만 두고 브라우저 응답에 포함하지 않습니다.
- 단지명은 공백·괄호 차이만 정규화하며 유사 이름을 임의로 합치지 않습니다.
- 단지 검색은 신고 취소를 제외하고 법정동·단지명·지번을 분리해 묶습니다.
- 면적 선택 ID는 법정동 코드·정확한 단지명·전용면적을 검증해 재현합니다.
- 기본 전용면적 기준 ±3㎡ 거래만 비교합니다.
- 신고 취소 거래와 보증부 월세는 매매 중앙값·전세가율에서 제외합니다.
- 외부 API 실패 또는 일치 거래 없음은 0원으로 표시하지 않고 상태로 구분합니다.

## 아직 mock/demo인 부분

- 주소 검색 전 보이는 예시 단지 카드와 공공데이터 조회 실패 시 검토용 값
- 규칙 seed는 실제 런칭 전 세무·법무 전문가 최종 검증 필요
- 관심단지는 localStorage 저장
- 뉴스레터는 Toast만 표시
- PDF/공유 링크는 준비 중 상태
- Supabase adapter는 단지 목록/요약 조회 준비 단계이며, 기본 실행은 mock fallback

## 다음 Phase

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
