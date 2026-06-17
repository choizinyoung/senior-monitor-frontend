# CLAUDE.md — 독거노인 안전 관리 시스템 Frontend

Claude Code가 이 프로젝트에서 작업할 때 참고하는 컨텍스트 문서입니다.

---

## 프로젝트 개요

독거노인의 기상 신호(안드로이드 APK → Railway 백엔드)를 모니터링하는 관리자용 웹 대시보드.  
HTML 프로토타입을 Next.js + Tailwind CSS + Atomic Design으로 마이그레이션한 프로젝트.

---

## 기술 스택 & 버전

```
Next.js        16.2.9   (App Router)
React          19.2.4
TypeScript     ^5       (strict mode)
Tailwind CSS   ^4       (v4 — @theme 기반, tailwind.config.js 없음)
Zustand        ^5.0.14
clsx           ^2.1.1
tailwind-merge ^3.6.0
Node.js        ≥ 18
```

---

## 실행 명령

```bash
npm install          # 의존성 설치
npm run dev          # 개발 서버 (localhost:3000)
npm run build        # 프로덕션 빌드
npm run start        # 프로덕션 서버
npx tsc --noEmit     # 타입 체크
npm run lint         # ESLint
```

---

## 경로 구조 (App Router)

```
/           → /dashboard 리다이렉트
/dashboard  → 통합 대시보드 (통계 + 확인요망 목록)
/alert-list → 확인요망 리스트 (필터 + 확인 처리 모달)
/seniors    → 대상자 관리 (CRUD + 페이지네이션)
/history    → 처리 내역 조회 (날짜·구역 필터)
/monitoring → 모니터링 현황 (서버 상태 + 수신 신호)
/logs       → 로그 시스템 (탭 필터)
/settings   → 설정 (권한 목록)
```

---

## Atomic Design 레이어

### 규칙

- 컴포넌트는 **atoms → molecules → organisms → templates** 순서로 조합
- 각 레이어는 `index.ts`로 barrel export
- `import { Button } from "@/components/atoms"` 형태로 사용
- Tailwind 클래스 조합은 반드시 `cn()` 사용 (`@/utils/cn`)

### atoms (최소 단위, no state)

| 파일 | 역할 |
|---|---|
| `Button.tsx` | variant: primary/danger/success/outline/ghost, size: sm/md |
| `Input.tsx` | 텍스트 입력 |
| `Select.tsx` | 셀렉트 박스 |
| `Textarea.tsx` | 멀티라인 입력 |
| `Label.tsx` | 폼 레이블 (required 표시 지원) |
| `SeverityBadge.tsx` | 중증도 (high=상/mid=중/low=하) |
| `StatusBadge.tsx` | 상태 (danger=확인요망/success=정상/warning=주의/info=정보) |
| `Avatar.tsx` | 원형 이니셜 아바타 (그라디언트) |
| `Modal.tsx` | 범용 모달 (ESC·배경클릭 닫기, isOpen/onClose/title/footer/size props) |
| `Spinner.tsx` | 로딩 스피너 |

### molecules (atom 조합, 최소한의 로컬 state)

| 파일 | 역할 |
|---|---|
| `StatCard.tsx` | 통계 카드 (label/value/sub/valueColor/href) |
| `SectionCard.tsx` | 섹션 래퍼 (title/titleIcon/subTitle/actions/children) |
| `FormField.tsx` | Label + Input 조합 |
| `LogItem.tsx` | 로그 단일 행 (LogEntry 타입) |

### organisms (독립 블록, 복잡한 state 허용)

| 파일 | 역할 |
|---|---|
| `SideNav.tsx` | 사이드바 (usePathname으로 active 감지, 240px 고정) |
| `TopBar.tsx` | 페이지 상단 (title + right slot + 사용자 칩) |
| `SeniorDetailModal.tsx` | 대상자 상세 (연락 이력 탭 선택, 메모 표시) |
| `ConfirmProcessModal.tsx` | 확인 처리 폼 모달 |
| `RegisterSeniorModal.tsx` | 대상자 등록/수정 모달 (mode: register/edit) |

### templates

| 파일 | 역할 |
|---|---|
| `AppLayout.tsx` | SideNav(240px) + 콘텐츠 영역 (ml-60) |

---

## 디자인 토큰 (Tailwind v4)

`src/app/globals.css` `@theme` 블록에서 정의. `--color-*` → 유틸리티 자동 매핑.

```
bg-primary / text-primary         #5B67F5
bg-primary-light                  #ECEFFE
bg-primary-dark                   #4A56E0
bg-danger / text-danger           #F5365C
bg-danger-light                   #FFE0E6
bg-success / text-success         #2DCE89
bg-success-light                  #D6F5E9
bg-warning / text-warning         #FFB547
bg-warning-light                  #FFF4DC
text-text-main                    #1A1D3B
text-text-sub                     #8B8FA8
border-border                     #E8EAF2
bg-bg-main                        #F0F2F8
bg-bg-card                        #FFFFFF
```

> Tailwind v4에는 `tailwind.config.js`가 없습니다. 커스텀 색상은 반드시 `globals.css @theme`에 추가하세요.

---

## TypeScript 타입 핵심

`src/types/index.ts`에 모든 공유 타입 정의.

```ts
type SeverityLevel = "high" | "mid" | "low"
type AlertStatus   = "danger" | "success" | "warning" | "info"
type LogType       = "query" | "action" | "system" | "login"

interface AlertTarget { id, name, age, phone, address, severity, registeredAt, status, lastWakeSignal? }
interface Senior      { id, name, birthDate, phone, address, severity, communityCenter, registeredAt, ... }
interface LogEntry    { id, timestamp, type, user, message }
interface MonitoringSignal { id, seniorName, device, receivedAt, status }
```

---

## 상수 (`src/constants/index.ts`)

```ts
ROUTES.DASHBOARD / ALERT_LIST / SENIORS / HISTORY / MONITORING / LOGS / SETTINGS
DISTRICT_OPTIONS        // ["전체", "종로구", "중구", ...]
SEVERITY_OPTIONS        // ["중증정도: 전체", "상", "중", "하"]
PROCESS_STATUS_OPTIONS  // ["확인완료", "확인요망 유지", "응급 이관"]
WAKE_WINDOW_OPTIONS     // 기상 확인 시간대 선택지
```

---

## 전역 상태 (Zustand)

`src/store/useMonitorStore.ts`

```ts
const store = useMonitorStore()
store.alertTargets       // AlertTarget[]
store.logs               // LogEntry[]
store.monitoringSignals  // MonitoringSignal[]
store.isLoading          // boolean
store.setAlertTargets()
store.setLogs()
store.setMonitoringSignals()
store.setLoading()
```

---

## 코딩 규칙

### 필수 패턴

```ts
// 1. Tailwind 클래스 조합은 항상 cn() 사용
className={cn("base", condition && "extra", props.className)}

// 2. 인터랙티브 컴포넌트는 "use client" 선언
"use client";

// 3. 새 atom은 atoms/index.ts에 export 추가
export { default as NewAtom } from "./NewAtom";

// 4. 페이지 mock 데이터는 TODO 주석으로 표시
// TODO: 실제 API 호출로 교체
const DATA = [ ... ]
```

### 금지 패턴

```ts
// X — cn() 없이 직접 클래스 충돌
className={`bg-red-500 ${customClass}`}

// X — tailwind.config.js 수정 (v4에서 동작 안 함)
// 대신 globals.css @theme 블록 사용

// X — organisms에서 직접 fetch (hooks 또는 store 경유)
```

---

## 모달 사용 패턴

```tsx
"use client";
const [open, setOpen] = useState(false);

<Button onClick={() => setOpen(true)}>열기</Button>

<SeniorDetailModal
  isOpen={open}
  onClose={() => setOpen(false)}
  senior={selectedSenior}
  onConfirm={() => { setOpen(false); setConfirmOpen(true); }}
/>
```

---

## 백엔드 연동 시 주의사항

- 현재 모든 데이터는 각 페이지 파일 상단의 mock 배열
- API 연동 시 mock 배열을 `useEffect` + fetch 또는 React Query로 교체
- `useMonitorStore`의 `set*` 액션으로 전역 상태에 저장
- 환경 변수: `NEXT_PUBLIC_API_BASE_URL` (`.env.local`)

---

## 디렉토리 별 역할 요약

```
src/app/           Next.js 라우팅 (페이지 파일만, UI 로직 최소화)
src/components/    Atomic Design 컴포넌트 (재사용 단위)
src/store/         Zustand 전역 상태
src/types/         공유 TypeScript 타입
src/constants/     앱 전체 상수 (라우트, 레이블, 옵션)
src/utils/         cn() 등 유틸 함수
src/hooks/         커스텀 훅 (API 연동 후 추가 예정)
```
