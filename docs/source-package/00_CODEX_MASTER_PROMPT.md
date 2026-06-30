# Codex Master Prompt — 매수체크 MVP 구현

너는 Next.js App Router + TypeScript + Supabase 기반 서비스를 구현하는 Staff Full-stack Engineer다.  
이번 작업의 목표는 `매수체크`라는 부동산 매수 전 리스크 체크 리포트 서비스의 MVP를 구현하는 것이다.

첨부된 자료를 반드시 먼저 읽어라.

- `design_reference_매수체크_v3.zip`: 최종 디자인 HTML 프로토타입
- `01_PRODUCT_BUSINESS_PRD.md`: 사업/제품 기획서
- `02_MVP_IMPLEMENTATION_SCOPE.md`: MVP 구현 범위
- `03_DB_SCHEMA_AND_SEED_SPEC.md`: DB 설계
- `04_RULE_ENGINE_AND_TEST_CASES.md`: 계산 엔진 및 테스트 케이스
- `05_API_INTEGRATION_GUIDE.md`: 공공 API 연동 가이드
- `06_UI_IMPLEMENTATION_GUIDE.md`: UI 구현 가이드
- `07_LEGAL_TRUST_GUARDRAILS.md`: 법무/신뢰/AI 가드레일
- `08_PHASE_TASKS_FOR_CODEX.md`: Phase별 작업 계획

---

## 서비스 정의

`매수체크`는 사용자가 외부 부동산 플랫폼에서 본 아파트 단지를 내 조건 기준으로 검토할 수 있게 해주는 **부동산 매수 전 리스크 체크 리포트 서비스**다.

핵심 포지셔닝:

> 매물은 익숙한 곳에서 보고, 내 상황 기준 매수 판단은 매수체크에서 확인한다.

이 서비스는 네이버부동산·호갱노노·직방 같은 매물 탐색 서비스를 대체하지 않는다.  
매물 탐색은 외부 서비스로 링크아웃하고, 우리는 매수 판단에 필요한 비용·세금·규제·대출 리스크 리포트를 제공한다.

---

## 가장 중요한 구현 원칙

1. **전체 서비스를 한 번에 만들려고 하지 마라.**  
   Phase 단위로 구현하고, 각 Phase 완료 후 실행 방법/테스트 방법/남은 TODO를 보고하라.

2. **디자인 HTML은 UI/UX 레퍼런스다.**  
   디자인, 카피, 정보구조, 인터랙션은 최대한 유지하되, 내부 계산식은 데모값으로 보고 그대로 신뢰하지 마라.

3. **세율·규제·법령 기준은 코드에 하드코딩하지 마라.**  
   Supabase/Postgres의 규칙 테이블과 seed 데이터로 관리하라.

4. **AI는 계산하지 않는다.**  
   계산은 규칙 엔진이 담당하고, AI는 향후 쉬운 말 설명/뉴스레터 초안/전문가 질문 정리에만 사용할 수 있다. MVP에서는 AI 호출을 넣지 않아도 된다.

5. **모든 리포트에는 기준일·근거·면책 문구가 있어야 한다.**  
   결과 숫자만 보여주지 말고, `basis_date`, `law_ref`, `confidence_label`, `disclaimer`를 포함하라.

6. **매물은 직접 수집하지 않는다.**  
   네이버부동산·호갱노노·직방 등 외부 서비스로 목적형 링크아웃만 제공하라. 크롤링/복제/매물 DB화 금지.

7. **초기 지역은 서울 광진구 자양동만 지원한다.**  
   LAWD_CD는 `11215`를 사용하고, 초기 seed 단지는 자양동 주요 단지 10~20개로 제한한다.

8. **양도세·종부세·법인·증여·상속·임대사업자는 정밀 계산하지 않는다.**  
   `참고 개념` 또는 `전문가 확인 필요` 카드로만 안내한다.

---

## 이번 첫 작업 범위

이번 요청에서는 **Phase 0~2까지만 구현**하라.

### Phase 0 — 프로젝트 기반 세팅

- Next.js App Router + TypeScript 프로젝트 구조 구성
- strict mode 유지
- Supabase client/server 유틸 생성
- 기본 라우팅 구성
- CSS variables 기반 디자인 토큰 구성
- 공통 formatter 생성
- README 실행 방법 작성

### Phase 1 — DB 스키마/시드/목업 데이터

- Supabase SQL schema 작성
- seed SQL 작성
- 자양동 주요 단지 seed 데이터 작성
- 규칙 테이블 seed 작성
- regulated_zones seed 작성
- law_refs seed 작성
- 모든 seed에는 기준일과 검증 필요 메모 포함

### Phase 2 — 디자인 기반 정적 MVP UI + 목업 계산 연결

- 디자인 HTML을 참고해 Next.js 컴포넌트 구조로 재구현
- 홈/검색 화면
- 조건 입력 화면
- 리포트 화면
- 관심단지 워치리스트 화면
- 뉴스레터 구독 섹션
- Loading / Empty / Error State
- Toast
- 차트 tooltip/touch interaction
- 외부 매물 링크 카드
- 전문가 질문 복사 기능
- localStorage 기반 관심단지 저장
- mock 데이터 기반 리포트 표시

단, Phase 2에서 실제 공공 API 연동까지 하지 마라.  
공공 API 연동은 Phase 4에서 한다.

---

## 필수 라우트 제안

- `/` 홈/검색
- `/complexes/[id]` 단지 요약
- `/estimate` 조건 입력
- `/reports/[id]` 리포트 상세
- `/watchlist` 관심단지
- `/newsletter` 뉴스레터

---

## 필수 컴포넌트 제안

- `Header`
- `HeroSearch`
- `ComplexSearch`
- `ComplexSummaryCard`
- `TrendChart`
- `ConditionForm`
- `ConditionSummary`
- `ReportHero`
- `CostBreakdown`
- `ConfidenceLabel`
- `RiskBadge`
- `EvidenceAccordion`
- `ExpertQuestionList`
- `ExternalListingLinks`
- `WatchlistCTA`
- `NewsletterSignup`
- `DisclaimerFooter`
- `StateView`
- `ToastProvider`

---

## 필수 유틸

- `formatKRW`
- `formatKRWShort`
- `formatAreaM2`
- `formatPyeong`
- `parseMolitAmountToKRW`
- `calculatePyeongPrice`
- `safeNumber`
- `getBasisDateLabel`

---

## 완료 기준

1. `npm run dev`로 로컬 실행 가능
2. 디자인 방향이 HTML 프로토타입과 유사하게 반영됨
3. 홈에서 단지 검색 UI가 보임
4. 조건 입력 후 mock 리포트 화면으로 이동 가능
5. 리포트에 총 추가 필요금액, 비용 Breakdown, 라벨, 근거, 면책이 표시됨
6. 관심단지 저장/저장됨 상태가 localStorage로 동작
7. 전문가 질문 복사 시 Toast 표시
8. 뉴스레터 구독 mock 동작 및 Toast 표시
9. Empty / Error / Loading 상태를 데모로 확인할 수 있음
10. DB schema/seed SQL 파일이 생성됨
11. `.env.local.example`이 생성됨
12. README에 설치/실행/테스트/다음 Phase가 정리됨

---

## 구현 후 반드시 보고할 것

작업 완료 후 아래 형식으로 보고하라.

1. 구현한 것
2. 변경/생성한 파일 목록
3. 실행 방법
4. 테스트 방법
5. 아직 mock/demo로 남겨둔 부분
6. 다음 Phase에서 해야 할 일
7. 법무/세무 검증이 필요한 항목

---

## 절대 하지 말 것

- 세율을 React 컴포넌트 안에 하드코딩하지 마라.
- 공공 API 키를 프론트엔드에 노출하지 마라.
- 실거래가 API를 클라이언트 컴포넌트에서 직접 호출하지 마라.
- AI에게 세금 계산을 맡기지 마라.
- 매수/매도/절세/투자 추천 표현을 쓰지 마라.
- 네이버부동산/직방/호갱노노 매물 데이터를 크롤링하지 마라.
- 처음부터 결제/전문가 매칭/전국 확장을 구현하지 마라.

