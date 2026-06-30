# 매수체크 Codex 구현 패키지

이 패키지는 `매수체크` MVP를 Codex로 구현하기 위한 입력 자료입니다.

## 포함 파일

- `design_reference_매수체크_v3.zip`  
  최종 디자인 HTML 프로토타입. Codex는 이 파일을 열어 UI/UX/카피/인터랙션 레퍼런스로 사용해야 합니다. 단, 내부 계산식은 데모값일 수 있으므로 그대로 신뢰하지 말고 규칙 엔진으로 재구현해야 합니다.

- `00_CODEX_MASTER_PROMPT.md`  
  Codex 첫 요청에 그대로 붙여 넣을 마스터 프롬프트입니다.

- `01_PRODUCT_BUSINESS_PRD.md`  
  사업 기획서/PRD. 서비스가 무엇이고 왜 필요한지 설명합니다.

- `02_MVP_IMPLEMENTATION_SCOPE.md`  
  MVP 범위, 제외 범위, 구현 우선순위입니다.

- `03_DB_SCHEMA_AND_SEED_SPEC.md`  
  Supabase/Postgres 기준 DB 스키마와 seed 데이터 설계입니다.

- `04_RULE_ENGINE_AND_TEST_CASES.md`  
  비용 계산 엔진 원칙과 테스트 케이스입니다.

- `05_API_INTEGRATION_GUIDE.md`  
  국토부 실거래가 API, 법제처 API 연동 가이드입니다.

- `06_UI_IMPLEMENTATION_GUIDE.md`  
  디자인 HTML을 Next.js 컴포넌트로 옮길 때의 구현 기준입니다.

- `07_LEGAL_TRUST_GUARDRAILS.md`  
  법무/세무/AI 출력 가드레일 및 문구 원칙입니다.

- `08_PHASE_TASKS_FOR_CODEX.md`  
  Codex에 순차적으로 시킬 Phase별 작업 지시서입니다.

- `.env.local.example`  
  필요한 환경변수 템플릿입니다.

## 권장 사용법

1. Codex 작업 공간에 이 패키지 전체를 업로드합니다.
2. `00_CODEX_MASTER_PROMPT.md` 내용을 첫 프롬프트로 넣습니다.
3. 처음에는 전체 완성을 요구하지 말고, Phase 0~2까지만 구현하게 합니다.
4. Codex가 변경 파일 목록, 실행 방법, 테스트 방법, 남은 TODO를 보고하도록 합니다.
5. 계산 로직, 법령/세율, API 키, 면책 문구는 반드시 별도 검수합니다.

