# shadcn InputGroup 선별 적용

- Source: https://github.com/shadcn-ui/ui/blob/c257f688cf4de7ec10cc1be84cad29cd4631182c/apps/v4/registry/new-york-v4/ui/input-group.tsx
- Immutable source SHA: `c257f688cf4de7ec10cc1be84cad29cd4631182c`.
- MIT copyright/license: `shadcn-LICENSE.txt` (원문 보존).
- 내부 `input-group.tsx/css`는 공식 InputGroup의 단일 border shell, min-width:0, flex control/addon, native input 유지, focus/error를 shell에 주는 구조를 기존 scoped CSS/token으로 선별 적용합니다. Tailwind/cva/cn 전체 dependency·CLI init/global reset/전역 theme 덮어쓰기는 도입하지 않습니다. InputGroupAddon의 범용 click-to-focus와 다른 block layouts는 이번 내부 Password 구성에서 추가하지 않습니다.
- Input/Button/NativeSelect의 같은 immutable SHA `apps/v4/registry/new-york-v4/ui/input.tsx`, `button.tsx`, `native-select.tsx`에서도 data-slot/variant/size 표시와 얇은 중립 경계·8px radius·compact 내부 여백을 선별 적용했다. native element/API는 보존하고 NativeSelect의 별도 wrapper/아이콘/새 size API는 도입하지 않았다. 공통 control은8px 12px,44px target이며 TextField addon padding과 DateRange의 반복 외곽박스를 줄였다. 이 선택 도입은 shadcn 전체 원본 컴포넌트를 설치했다는 의미가 아니다.
- 기존 public PasswordInput API 유지. native input의 React DOM identity는 유지하고 외부 텍스트 버튼 대신 group 안의 Radix Toggle/장식 eye 아이콘을 구성합니다. Radix dependency `@radix-ui/react-toggle`는 정확 `1.1.19` pin/lock이며 React19 peer를 확인했습니다.
- 공식 default 높이/작은 icon target을 그대로 복사하지 않고 이 DS의 Pretendard14/일반44px target·blue focus·기존 field/error semantic token을 유지합니다. 읽기 전용/required/form/name/value/onChange는 native 전달이며 composition 이벤트를 원래 callback에 그대로 전달합니다. 이 단계는 전체 입력류/AT/디자인 수락 완료가 아닙니다.
