insert into law_refs (
  id, law_name, article, clause, title, summary, source_url, enforcement_date, basis_date, verification_status, memo
) values
  ('11111111-1111-4111-8111-111111111111', '지방세법', '제11조', null, '부동산 취득의 세율', '주택 취득가액, 주택 수, 지역에 따라 취득세율이 달라질 수 있습니다.', 'https://www.law.go.kr', '2026-01-01', '2026-06-30', 'needs_review', 'MVP seed. 세무 전문가 검증 필요.'),
  ('22222222-2222-4222-8222-222222222222', '지방세법', '제151조', null, '지방교육세', '취득세와 함께 부과될 수 있는 지방교육세 근거입니다.', 'https://www.law.go.kr', '2026-01-01', '2026-06-30', 'needs_review', 'MVP seed. 세무 전문가 검증 필요.'),
  ('33333333-3333-4333-8333-333333333333', '농어촌특별세법', '제5조', null, '과세표준과 세율', '전용면적과 취득 유형에 따라 농어촌특별세가 적용될 수 있습니다.', 'https://www.law.go.kr', '2026-01-01', '2026-06-30', 'needs_review', 'MVP seed. 세무 전문가 검증 필요.'),
  ('44444444-4444-4444-8444-444444444444', '공인중개사법 시행규칙', '제20조', null, '중개보수 및 실비의 한도 등', '거래금액 구간별 중개보수 상한 안내를 위한 근거입니다.', 'https://www.law.go.kr', '2026-01-01', '2026-06-30', 'needs_review', 'MVP seed. 공인중개사/법무 검증 필요.'),
  ('55555555-5555-4555-8555-555555555555', '주택법 및 관계 고시', null, null, '규제지역 지정 관련 고시', '투기과열지구, 조정대상지역 등 규제지역 확인을 위한 참고 근거입니다.', 'https://www.molit.go.kr', '2026-01-01', '2026-06-30', 'needs_review', 'MVP seed. 최신 고시와 대조 필요.')
on conflict (id) do nothing;

insert into complexes (
  id, name, sido, sigungu, dong, lawd_cd, address, built_year, household_count, default_area_m2,
  naver_land_url, hogangnono_url, zigbang_url, basis_date, verification_status, memo
) values
  ('aaaaaaaa-0001-4000-8000-000000000001', '테라팰리스 건대2차', '서울특별시', '광진구', '자양동', '11215', '서울 광진구 자양동', 2003, 590, 84.9, 'https://m.land.naver.com', 'https://hogangnono.com', 'https://www.zigbang.com', '2026-06-30', 'needs_review', '디자인 프로토타입 기준 demo 단지. 실제 세대수/주소 검증 필요.'),
  ('aaaaaaaa-0002-4000-8000-000000000002', '더샵스타시티', '서울특별시', '광진구', '자양동', '11215', '서울 광진구 자양동', 2007, 1177, 84.9, 'https://m.land.naver.com', 'https://hogangnono.com', 'https://www.zigbang.com', '2026-06-30', 'needs_review', '자양동 주요 단지 seed. 실제 정보 검증 필요.'),
  ('aaaaaaaa-0003-4000-8000-000000000003', '래미안프리미어팰리스', '서울특별시', '광진구', '자양동', '11215', '서울 광진구 자양동', 2018, 264, 84.7, 'https://m.land.naver.com', 'https://hogangnono.com', 'https://www.zigbang.com', '2026-06-30', 'needs_review', '자양동 주요 단지 seed. 실제 정보 검증 필요.'),
  ('aaaaaaaa-0004-4000-8000-000000000004', '이튼타워리버 1차', '서울특별시', '광진구', '자양동', '11215', '서울 광진구 자양동', 2006, 300, 84.8, 'https://m.land.naver.com', 'https://hogangnono.com', 'https://www.zigbang.com', '2026-06-30', 'needs_review', '자양동 주요 단지 seed. 실제 정보 검증 필요.'),
  ('aaaaaaaa-0005-4000-8000-000000000005', '이튼타워리버 2차', '서울특별시', '광진구', '자양동', '11215', '서울 광진구 자양동', 2007, 250, 84.8, 'https://m.land.naver.com', 'https://hogangnono.com', 'https://www.zigbang.com', '2026-06-30', 'needs_review', '자양동 주요 단지 seed. 실제 정보 검증 필요.'),
  ('aaaaaaaa-0006-4000-8000-000000000006', '자양현대', '서울특별시', '광진구', '자양동', '11215', '서울 광진구 자양동', 1995, 560, 84.9, 'https://m.land.naver.com', 'https://hogangnono.com', 'https://www.zigbang.com', '2026-06-30', 'needs_review', '자양동 주요 단지 seed. 실제 정보 검증 필요.'),
  ('aaaaaaaa-0007-4000-8000-000000000007', '자양우성1차', '서울특별시', '광진구', '자양동', '11215', '서울 광진구 자양동', 1988, 656, 79.5, 'https://m.land.naver.com', 'https://hogangnono.com', 'https://www.zigbang.com', '2026-06-30', 'needs_review', '자양동 주요 단지 seed. 실제 정보 검증 필요.'),
  ('aaaaaaaa-0008-4000-8000-000000000008', '자양우성2차', '서울특별시', '광진구', '자양동', '11215', '서울 광진구 자양동', 1989, 705, 79.5, 'https://m.land.naver.com', 'https://hogangnono.com', 'https://www.zigbang.com', '2026-06-30', 'needs_review', '자양동 주요 단지 seed. 실제 정보 검증 필요.'),
  ('aaaaaaaa-0009-4000-8000-000000000009', '자양한양', '서울특별시', '광진구', '자양동', '11215', '서울 광진구 자양동', 1983, 444, 82.6, 'https://m.land.naver.com', 'https://hogangnono.com', 'https://www.zigbang.com', '2026-06-30', 'needs_review', '자양동 주요 단지 seed. 실제 정보 검증 필요.'),
  ('aaaaaaaa-0010-4000-8000-000000000010', '자양동아', '서울특별시', '광진구', '자양동', '11215', '서울 광진구 자양동', 1999, 499, 84.9, 'https://m.land.naver.com', 'https://hogangnono.com', 'https://www.zigbang.com', '2026-06-30', 'needs_review', '자양동 주요 단지 seed. 실제 정보 검증 필요.'),
  ('aaaaaaaa-0011-4000-8000-000000000011', '구의역 롯데캐슬 이스트폴', '서울특별시', '광진구', '자양동', '11215', '서울 광진구 자양동', 2025, 1063, 84.9, 'https://m.land.naver.com', 'https://hogangnono.com', 'https://www.zigbang.com', '2026-06-30', 'needs_review', '자양동 주요 단지 seed. 실제 정보 검증 필요.'),
  ('aaaaaaaa-0012-4000-8000-000000000012', '자양7차현대홈타운', '서울특별시', '광진구', '자양동', '11215', '서울 광진구 자양동', 2006, 802, 84.9, 'https://m.land.naver.com', 'https://hogangnono.com', 'https://www.zigbang.com', '2026-06-30', 'needs_review', '자양동 주요 단지 seed. 실제 정보 검증 필요.')
on conflict (id) do nothing;

insert into transactions (
  complex_id, lawd_cd, deal_ym, deal_date, deal_amount_krw, area_m2, floor, transaction_type, source, basis_date, verification_status, memo
) values
  ('aaaaaaaa-0001-4000-8000-000000000001', '11215', '202601', '2026-01-18', 895000000, 84.9, 9, 'trade', 'MOLIT_MOCK', '2026-06-30', 'needs_review', 'MVP mock transaction. 공공 API 검증 필요.'),
  ('aaaaaaaa-0001-4000-8000-000000000001', '11215', '202602', '2026-02-11', 902000000, 84.9, 14, 'trade', 'MOLIT_MOCK', '2026-06-30', 'needs_review', 'MVP mock transaction. 공공 API 검증 필요.'),
  ('aaaaaaaa-0001-4000-8000-000000000001', '11215', '202603', '2026-03-24', 910000000, 84.9, 7, 'trade', 'MOLIT_MOCK', '2026-06-30', 'needs_review', 'MVP mock transaction. 공공 API 검증 필요.'),
  ('aaaaaaaa-0001-4000-8000-000000000001', '11215', '202604', '2026-04-15', 915000000, 84.9, 12, 'trade', 'MOLIT_MOCK', '2026-06-30', 'needs_review', 'MVP mock transaction. 공공 API 검증 필요.'),
  ('aaaaaaaa-0001-4000-8000-000000000001', '11215', '202605', '2026-05-21', 923000000, 84.9, 10, 'trade', 'MOLIT_MOCK', '2026-06-30', 'needs_review', 'MVP mock transaction. 공공 API 검증 필요.'),
  ('aaaaaaaa-0001-4000-8000-000000000001', '11215', '202606', '2026-06-12', 920000000, 84.9, 12, 'trade', 'MOLIT_MOCK', '2026-06-30', 'needs_review', 'MVP mock transaction. 공공 API 검증 필요.'),
  ('aaaaaaaa-0002-4000-8000-000000000002', '11215', '202606', '2026-06-09', 1420000000, 84.9, 28, 'trade', 'MOLIT_MOCK', '2026-06-30', 'needs_review', 'MVP mock transaction. 공공 API 검증 필요.'),
  ('aaaaaaaa-0003-4000-8000-000000000003', '11215', '202606', '2026-06-18', 1280000000, 84.7, 18, 'trade', 'MOLIT_MOCK', '2026-06-30', 'needs_review', 'MVP mock transaction. 공공 API 검증 필요.');

insert into regulated_zones (
  lawd_cd, sido, sigungu, dong, zone_type, is_active, effective_from, source_title, source_url, basis_date, verification_status, memo
) values
  ('11215', '서울특별시', '광진구', '자양동', '투기과열지구', true, '2026-01-01', 'MVP 규제지역 수동 seed', 'https://www.molit.go.kr', '2026-06-30', 'needs_review', '프로토타입 표시용 seed. 실제 최신 지정 여부는 런칭 전 반드시 검증 필요.'),
  ('11215', '서울특별시', '광진구', '자양동', '조정대상지역', true, '2026-01-01', 'MVP 규제지역 수동 seed', 'https://www.molit.go.kr', '2026-06-30', 'needs_review', '프로토타입 표시용 seed. 실제 최신 지정 여부는 런칭 전 반드시 검증 필요.');

insert into acquisition_tax_rules (
  home_count_min, home_count_max, zone_type, price_min_krw, price_max_krw, area_threshold_m2,
  acquisition_tax_rate, acquisition_tax_formula, local_education_tax_rate, special_rural_tax_rate,
  label, description, law_ref_id, effective_from, basis_date, verification_status, memo
) values
  (1, 1, 'common', 0, 600000000, 85, 0.01, null, 0.002, 0, '1주택 6억 이하', '1주택 일반지역 6억 이하 주택 취득세 참고 규칙입니다.', '11111111-1111-4111-8111-111111111111', '2026-01-01', '2026-06-30', 'needs_review', 'MVP seed. 실제 적용 전 세무 검증 필요.'),
  (1, 1, 'common', 600000001, 900000000, 85, null, '6억 초과 9억 이하 구간은 점진 세율 적용 가능성이 있어 별도 계산식 검증 필요', 0.002, 0, '1주택 6~9억', '점진세율 구간은 규칙 엔진 Phase에서 테스트 케이스로 검증합니다.', '11111111-1111-4111-8111-111111111111', '2026-01-01', '2026-06-30', 'needs_review', 'MVP seed. 실제 적용 전 세무 검증 필요.'),
  (1, 1, 'common', 900000001, null, 85, 0.03, null, 0.002, 0, '1주택 9억 초과', '1주택 일반지역 9억 초과 주택 취득세 참고 규칙입니다.', '11111111-1111-4111-8111-111111111111', '2026-01-01', '2026-06-30', 'needs_review', 'MVP seed. 실제 적용 전 세무 검증 필요.'),
  (2, 2, 'regulated', 0, null, 85, null, '조정대상지역/투기과열지구 2주택 중과 가능성은 일시적 2주택 등 예외 확인 필요', 0.004, 0, '2주택 규제지역', '사용자 세부 조건에 따라 중과 또는 예외가 달라질 수 있습니다.', '11111111-1111-4111-8111-111111111111', '2026-01-01', '2026-06-30', 'needs_review', 'MVP seed. 실제 적용 전 세무 검증 필요.'),
  (1, null, 'any', 0, null, 85.0001, null, '85㎡ 초과 주택은 농어촌특별세 적용 가능성 검토', null, 0.002, '85㎡ 초과 농어촌특별세', '전용면적 85㎡ 초과 여부에 따라 항목이 표시될 수 있습니다.', '33333333-3333-4333-8333-333333333333', '2026-01-01', '2026-06-30', 'needs_review', 'MVP seed. 실제 적용 전 세무 검증 필요.');

insert into incidental_fees (
  fee_key, label, calculation_type, price_min_krw, price_max_krw, rate, fixed_amount_krw, min_amount_krw, max_amount_krw,
  confidence_label, description, law_ref_id, effective_from, basis_date, verification_status, memo
) values
  ('brokerage_fee', '부동산 중개보수', 'rate', 900000000, 1200000000, 0.006, null, null, null, 'variable', '거래금액 구간별 상한이 있으며 실제 보수는 협의와 부가세 여부에 따라 달라질 수 있습니다.', '44444444-4444-4444-8444-444444444444', '2026-01-01', '2026-06-30', 'needs_review', 'MVP seed. 공인중개사 검증 필요.'),
  ('registration_related', '등기 관련 비용', 'range', null, null, null, null, 1200000, 2600000, 'variable', '등록면허세, 등기 신청 방식, 법무사 이용 여부, 국민주택채권 부담에 따라 달라질 수 있습니다.', null, '2026-01-01', '2026-06-30', 'needs_review', 'MVP seed. 법무사 검증 필요.'),
  ('stamp_and_legal', '인지세 + 법무사 수수료', 'range', null, null, null, null, 700000, 1800000, 'variable', '계약서 인지세와 등기 대리 수수료는 거래 조건과 위임 범위에 따라 달라질 수 있습니다.', null, '2026-01-01', '2026-06-30', 'needs_review', 'MVP seed. 법무사 검증 필요.'),
  ('national_housing_bond', '국민주택채권', 'manual_note', null, null, null, null, null, null, 'needs_expert_check', '등기 시 매입과 할인 매각 방식에 따라 실제 부담액이 달라질 수 있어 별도 확인이 필요합니다.', null, '2026-01-01', '2026-06-30', 'needs_review', 'MVP seed. 법무사 검증 필요.'),
  ('ltv_dsr', 'LTV·DSR', 'manual_note', null, null, null, null, null, null, 'concept_only', '정밀 대출 한도 계산은 하지 않고 금융기관 심사 확인이 필요한 개념으로 안내합니다.', null, '2026-01-01', '2026-06-30', 'needs_review', 'MVP seed. 대출 전문가 검증 필요.');

insert into concept_notes (
  note_key, title, summary, body, confidence_label, basis_date, verification_status, memo
) values
  ('capital_gains_tax', '양도소득세', '나중에 집을 팔 때 검토하는 세금입니다.', '보유 기간, 거주 기간, 주택 수, 조정대상지역 여부 등에 따라 달라질 수 있어 Phase 0~2에서는 정밀 계산하지 않습니다.', 'concept_only', '2026-06-30', 'needs_review', '세무 전문가 검증 필요.'),
  ('comprehensive_real_estate_tax', '종합부동산세', '보유 주택 공시가격 합계에 따라 검토하는 세금입니다.', '공시가격, 공제, 세대/개인 조건 등에 따라 달라질 수 있어 Phase 0~2에서는 정밀 계산하지 않습니다.', 'concept_only', '2026-06-30', 'needs_review', '세무 전문가 검증 필요.');
