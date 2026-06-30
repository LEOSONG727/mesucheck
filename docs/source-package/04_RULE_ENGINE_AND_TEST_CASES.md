# Rule Engine and Test Cases

## 1. 원칙

비용 계산은 AI가 아니라 deterministic rule engine이 담당한다.

입력값:

- complex_id
- price_krw
- area_m2
- home_count_after_purchase
- is_actual_residence
- is_first_home_buyer
- will_use_loan
- is_temporary_two_home_unknown / yes / no
- existing_home_disposal_plan_unknown / yes / no

처리 흐름:

1. 단지 정보 조회
2. lawd_cd 기준 regulated_zones 조회
3. 주택 수/지역/가격/면적 기준 acquisition_tax_rules 조회
4. 취득세/지방교육세/농특세 계산
5. incidental_fees 조회 및 계산
6. concept_notes 조회
7. risk_badges 생성
8. confidence_label 부여
9. law_refs 연결
10. disclaimer 포함
11. report JSON 반환

---

## 2. Confidence Label

UI 라벨과 API 값은 다음을 사용한다.

```ts
type ConfidenceLabel =
  | 'rule_based'
  | 'variable'
  | 'needs_expert_check'
  | 'concept_only';
```

라벨 매핑:

- `rule_based`: 규칙 기반
- `variable`: 변동 가능
- `needs_expert_check`: 별도 확인
- `concept_only`: 참고 개념

---

## 3. Cost Item JSON

```ts
type CostItem = {
  key: string;
  label: string;
  amountKRW?: number;
  minAmountKRW?: number;
  maxAmountKRW?: number;
  confidenceLabel: ConfidenceLabel;
  basis: string;
  explanation: string;
  lawRefId?: string;
  sourceUrl?: string;
  basisDate: string;
  isIncludedInTotal: boolean;
};
```

---

## 4. Report JSON

```ts
type CostEstimateReport = {
  summary: {
    complexName: string;
    purchasePriceKRW: number;
    estimatedAdditionalCostKRW: number;
    estimatedTotalAcquisitionCostKRW: number;
    basisDate: string;
  };
  input: {
    priceKRW: number;
    areaM2: number;
    homeCountAfterPurchase: number | 'unknown';
    isActualResidence: boolean | 'unknown';
    isFirstHomeBuyer: boolean | 'unknown';
    willUseLoan: boolean | 'unknown';
  };
  costItems: CostItem[];
  riskBadges: string[];
  expertCheckQuestions: string[];
  externalLinks: {
    naverLand?: string;
    hogangnono?: string;
    zigbang?: string;
  };
  disclaimer: string;
};
```

---

## 5. 단위 처리

- 내부 계산은 KRW 원 단위 integer
- 국토부 API 금액은 만원 단위 문자열일 수 있음
- 콤마 제거 후 × 10,000 처리
- 면적은 m² 기준 저장
- 평 변환은 `area_m2 / 3.3058`
- UI 표시에서만 억/만원 단위 포맷 적용

필수 유틸:

```ts
parseMolitAmountToKRW('100,000') // 1,000,000,000
formatKRW(54300000) // 54,300,000원
formatKRWShort(54300000) // 5,430만 원
formatPyeong(84.9) // 25.7평
```

---

## 6. 테스트 케이스

### Case 1 — 1주택 / 공통 / 6억 이하 / 84m²

입력:

```json
{
  "priceKRW": 600000000,
  "areaM2": 84.0,
  "homeCountAfterPurchase": 1,
  "zoneType": "common"
}
```

기대:

- 취득세: 규칙 기반
- 농특세: 85m² 이하이므로 미적용
- 결과에 기준일/면책 포함

### Case 2 — 1주택 / 공통 / 9억 초과 / 84m²

입력:

```json
{
  "priceKRW": 1000000000,
  "areaM2": 84.9,
  "homeCountAfterPurchase": 1,
  "zoneType": "common"
}
```

기대:

- 취득세: 규칙 기반
- 지방교육세 포함
- 농특세는 85m² 이하라면 미적용
- 중개보수/등기/법무사 비용은 변동 가능

### Case 3 — 1주택 / 85m² 초과

입력:

```json
{
  "priceKRW": 1000000000,
  "areaM2": 102.0,
  "homeCountAfterPurchase": 1,
  "zoneType": "common"
}
```

기대:

- 농특세 항목이 표시됨
- 농특세 confidenceLabel은 rule_based 또는 needs_review 상태

### Case 4 — 2주택 / 조정대상지역

입력:

```json
{
  "priceKRW": 1000000000,
  "areaM2": 84.9,
  "homeCountAfterPurchase": 2,
  "zoneType": "regulated"
}
```

기대:

- 취득세 중과 가능성 표시
- riskBadges에 `취득세 중과 가능성`, `규제지역` 표시
- 일시적 2주택 여부가 unknown이면 전문가 확인 필요 카드 표시

### Case 5 — 생애최초 unknown

입력:

```json
{
  "priceKRW": 900000000,
  "areaM2": 84.9,
  "homeCountAfterPurchase": 1,
  "isFirstHomeBuyer": "unknown"
}
```

기대:

- 감면을 계산에 확정 반영하지 않음
- `생애최초 감면 확인 필요` 카드 표시
- confidenceLabel = `needs_expert_check`

### Case 6 — 대출 예정 yes

기대:

- LTV/DSR 정밀 한도 계산 금지
- `대출 규제 확인 필요` 카드 표시
- confidenceLabel = `concept_only` 또는 `needs_expert_check`

---

## 7. 금지 사항

- AI 호출로 세금 계산 금지
- 하드코딩된 세율로 결과 생성 금지
- “확정 세금”, “반드시 적용” 문구 금지
- 양도세/종부세 정밀 계산 금지
- 대출 가능액 확정 표시 금지

