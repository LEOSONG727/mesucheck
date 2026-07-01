# 매수체크 Design System Notes

Phase 1 UI 작업부터는 화면별 임의 Tailwind 조합보다 공통 primitive를 우선 사용한다.

## Core Tokens

- 색상, surface, shadow, focus ring은 `src/app/globals.css`의 CSS variables를 기준으로 한다.
- 새 색상을 직접 추가하기 전에 기존 `primary`, `accent`, `success`, `warning`, `info`, `surface` 계열로 표현 가능한지 먼저 확인한다.
- 음수 letter spacing은 사용하지 않는다. 작은 모바일 화면에서 한글 가독성이 떨어진다.

## Primitives

- `src/components/ui/Button.tsx`
  - 액션 버튼과 링크형 CTA는 `Button`, `ButtonLink`, `buttonClassName`을 사용한다.
  - variant: `primary`, `accent`, `secondary`, `ghost`, `soft`
  - size: `sm`, `md`, `lg`, `icon`

- `src/components/ui/Surface.tsx`
  - 카드, 패널, aside, 링크 카드의 표면은 `Surface`를 사용한다.
  - variant: `default`, `premium`, `glass`, `muted`, `dark`
  - radius: `md`, `lg`, `xl`
  - padding: `none`, `sm`, `md`, `lg`

- `src/components/ui/Badge.tsx`
  - 상태, 신뢰 라벨, 규제 라벨은 `Badge`를 사용한다.
  - variant: `primary`, `success`, `warning`, `info`, `neutral`, `inverted`

- `src/components/ui/TextInput.tsx`
  - 검색/폼 입력은 `TextInput`을 우선 사용한다.
  - 특수 숫자 입력처럼 레이아웃이 크게 다른 경우만 별도 구현한다.

## Application Rules

- `premium-panel`, `glass-panel`, `interactive-lift`는 직접 쓰지 말고 `Surface` 또는 `Button` variant를 통해 사용한다.
- CTA는 텍스트만 있는 rounded rectangle보다 아이콘과 명령이 같이 보이게 구성한다.
- 리포트/세금/규제 화면에서는 확정적으로 보이는 표현보다 기준일, 신뢰 라벨, 면책 문구가 같이 보이게 구성한다.
- 외부 매물 링크는 데이터 복제처럼 보이지 않도록 `ButtonLink` 또는 링크형 `Surface`로 명확히 표시한다.
