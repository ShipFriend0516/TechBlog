# PersonalBlog

## 디자인 시스템

원본은 `/design-system` 페이지(`app/design-system/DesignSystemPreview.tsx`)다. 토큰 값은 `app/globals.css`, Tailwind 매핑은 `tailwind.config.ts`.
새 UI를 만들기 전에 원본 페이지에 있는 것부터 쓰고, 없는 게 필요하면 원본 페이지에 먼저 추가한다.

- 색은 토큰만 쓴다. Tailwind 기본 팔레트(`red-500` 등)는 설정에서 제거돼 있어 동작하지 않는다. `bg-[#...]` 같은 임의 색도 쓰지 않는다.
- 토큰이 테마를 따라가므로 색에 `dark:` 분기를 달지 않는다.
- `accent`는 링크, 버튼, 강조 같은 행동 요소에, `nebula`는 배경, 히어로, 썸네일 같은 장식에만 쓴다. 클릭 요소에 nebula를 쓰지 않는다.
- 레이어는 `base → surface → raised → overlay` 순서를 따른다. 모달, 드롭다운, 사이드바는 `bg-overlay`, 뒤 딤은 `.scrim`.
- 상태 표현은 `danger` / `warning` / `info`. 배지는 `bg-<token>/10 text-<token>`, 채운 버튼 위 글자는 `text-on-accent` / `text-on-danger`.
- 카드는 테두리 없이 `rounded-card`, 호버는 `.card-interactive`. 입력창은 `.input-field`.
- `white` / `black`은 이미지 위 텍스트나 scrim처럼 테마와 무관한 곳에만 쓴다.
- `effect-star` / `effect-petal`은 Atelier 메시지 이펙트 전용이다.
