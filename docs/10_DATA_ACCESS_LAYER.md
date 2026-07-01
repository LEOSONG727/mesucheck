# Data Access Layer

Phase 0~2에서는 화면이 mock 데이터 파일을 직접 import하지 않도록 repository 계층을 둔다.

## Data Source

기본값은 mock이다.

```env
MAESUCHECK_DATA_SOURCE=mock
```

Supabase SQL 적용 후 아래처럼 바꾸면 서버 repository가 Supabase 조회를 먼저 시도한다.

```env
MAESUCHECK_DATA_SOURCE=supabase
NEXT_PUBLIC_SUPABASE_URL=...
NEXT_PUBLIC_SUPABASE_ANON_KEY=...
SUPABASE_SERVICE_ROLE_KEY=...
```

`SUPABASE_SERVICE_ROLE_KEY`가 없으면 anon key로 서버 조회를 시도한다. Supabase 설정이 없거나 쿼리 결과가 비어 있으면 mock 데이터로 fallback한다.

## Current Repositories

- `src/lib/repositories/complexes.ts`
  - `getComplexes()`
  - `findComplexById(id)`
  - `getComplexById(id)`
  - `searchComplexes(query)`
- `src/lib/repositories/reports.ts`
  - `buildEstimateReport(conditions)`

## Current Boundaries

- Client component는 Supabase를 직접 호출하지 않는다.
- 검색 필터는 `src/lib/complex-search.ts`의 순수 함수로 분리한다.
- Phase 2 리포트 계산은 여전히 mock이다.
- Supabase adapter는 `complexes`, `transactions`, `regulated_zones`를 읽어 단지 요약을 구성한다.
- 리포트 저장, 공유 링크, 로그인, 결제, 공공 API 호출은 아직 구현하지 않는다.

## Next Phase Notes

Phase 3에서는 `buildEstimateReport` 내부를 DB 규칙 테이블 기반 계산 엔진으로 교체한다. 그때 `acquisition_tax_rules`, `incidental_fees`, `law_refs`, `regulated_zones`를 함께 조회하고 테스트 케이스를 추가한다.
