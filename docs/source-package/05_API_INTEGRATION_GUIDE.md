# Public API Integration Guide

## 1. API 연동 원칙

- 외부 API 키는 절대 클라이언트에 노출하지 않는다.
- Next.js Route Handler 또는 Supabase Edge Function에서 호출한다.
- API 응답은 가능한 DB에 캐싱한다.
- 프론트는 외부 API를 직접 호출하지 않고 내부 API 또는 DB만 조회한다.
- 공공 API 실패에 대비해 Loading / Empty / Error state를 구현한다.

---

## 2. 국토교통부 아파트 매매 실거래가 API

용도:

- 최근 실거래가
- 평단가
- 6개월 거래량
- 단지 요약

주요 파라미터:

- `LAWD_CD`: 법정동 코드 앞 5자리. 광진구는 `11215`
- `DEAL_YMD`: 계약년월 6자리. 예: `202606`
- `serviceKey`: 공공데이터포털 인증키

주의:

- 응답은 XML일 수 있다.
- 금액은 콤마 포함 문자열일 수 있다.
- 금액 단위는 만원일 수 있으므로 내부 계산 전 KRW 원 단위로 변환한다.
- 페이지네이션 처리 필요.
- 단지명 trim/normalize 필요.

권장 구조:

```txt
MOLIT API
→ Server Route / Edge Function
→ parse XML
→ normalize data
→ transactions table upsert
→ UI reads from DB
```

MVP 첫 구현에서는 실제 API 호출 대신 seed/mock transactions로 시작한다.

---

## 3. 국토교통부 아파트 전월세 실거래가 API

용도:

- 전세가율 참고
- 전월세 거래 흐름

MVP에서는 선택 기능이다.  
Phase 4 이후 연동한다.

---

## 4. 법제처 국가법령정보 OPEN API

용도:

- 법령명 검색
- 조문 원문 조회
- 시행일 조회
- 근거 보기

주요 환경변수:

- `LAW_OPEN_API_OC`
- `LAW_OPEN_API_SEARCH_URL`
- `LAW_OPEN_API_SERVICE_URL`

권장 구조:

```txt
law_refs table
→ sync-law-refs function
→ law.go.kr API
→ original_text / enforcement_date 갱신
→ UI evidence accordion에서 표시
```

MVP에서는 law_refs seed만 사용하고, 실제 동기화는 이후 Phase에서 구현한다.

---

## 5. 규제지역 정보

조정대상지역/투기과열지구 등은 깔끔한 단일 API에 의존하지 않는다.

MVP에서는 `regulated_zones` 테이블에 수동 seed로 관리한다.

향후:

- 국토부 보도자료
- 기재부 보도자료
- 행안부 지방세 발표
- 금융위 대출 규제 발표

를 RSS/알리미로 모니터링하고 review_queue에 쌓는다.

---

## 6. API Route 제안

### GET `/api/complex-search?query=`

단지 검색.

### GET `/api/complexes/[id]/summary`

단지 실거래 요약.

### POST `/api/cost-estimate`

조건 기반 비용 계산.

### POST `/api/reports`

리포트 생성/저장.

### POST `/api/watchlist`

관심단지 저장.

### POST `/api/newsletter-subscribe`

뉴스레터 구독.

---

## 7. 환경변수

`.env.local.example`에만 이름을 정의하고 실제 키는 커밋하지 않는다.

```env
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
DATA_GO_KR_SERVICE_KEY=
MOLIT_APT_TRADE_API_URL=
MOLIT_APT_RENT_API_URL=
LAW_OPEN_API_OC=
LAW_OPEN_API_SEARCH_URL=
LAW_OPEN_API_SERVICE_URL=
```

