# 독거노인 안전 관리 시스템 — Frontend

독거노인의 기상 신호를 실시간으로 모니터링하고, 확인요망 대상자를 관리하는 웹 대시보드입니다.

---

## 기술 스택

| 항목 | 버전 | 설명 |
|---|---|---|
| **Next.js** | 16.2.9 | App Router, SSR/SSG 지원 |
| **React** | 19.2.4 | UI 라이브러리 |
| **TypeScript** | ^5 | 정적 타입 (strict mode) |
| **Tailwind CSS** | ^4 | 유틸리티 CSS (v4 — `@theme` 기반 설정) |
| **Zustand** | ^5.0.14 | 전역 상태 관리 |
| **clsx** | ^2.1.1 | 조건부 클래스 조합 |
| **tailwind-merge** | ^3.6.0 | Tailwind 클래스 충돌 해결 |
| **Node.js** | ≥ 18 | 런타임 |

---

## 시작하기

### 1. 의존성 설치

```bash
npm install
```

### 2. 개발 서버 실행

```bash
npm run dev
```

브라우저에서 [http://localhost:3000](http://localhost:3000) 열기.  
`/` 경로는 자동으로 `/dashboard`로 리다이렉트됩니다.

### 3. 프로덕션 빌드

```bash
npm run build
npm run start
```

### 4. 타입 체크

```bash
npx tsc --noEmit
```

### 5. 린트

```bash
npm run lint
```

---

## 페이지 구성

| 경로 | 페이지 | 설명 |
|---|---|---|
| `/dashboard` | 통합 대시보드 | 전체 통계 카드 + 확인요망 대상자 테이블 |
| `/alert-list` | 확인요망 리스트 | 기상 신호 미수신 대상자 목록, 확인 처리 |
| `/seniors` | 대상자 관리 | 전체 대상자 CRUD, 검색·필터 |
| `/history` | 처리 내역 조회 | 날짜·구역·횟수 기반 처리 내역 검색 |
| `/monitoring` | 모니터링 현황 | Railway 서버 연결 상태, 실시간 수신 신호 |
| `/logs` | 로그 시스템 | 조회·처리·시스템·로그인 활동 로그 |
| `/settings` | 설정 | 관리자·담당자 권한 목록 |

---

## 프로젝트 구조

```
src/
├── app/                          # Next.js App Router
│   ├── layout.tsx                # 루트 레이아웃 (폰트, 메타데이터)
│   ├── page.tsx                  # / → /dashboard 리다이렉트
│   ├── globals.css               # 전역 스타일 + Tailwind 디자인 토큰
│   ├── dashboard/page.tsx
│   ├── alert-list/page.tsx
│   ├── seniors/page.tsx
│   ├── history/page.tsx
│   ├── monitoring/page.tsx
│   ├── logs/page.tsx
│   └── settings/page.tsx
│
├── components/
│   ├── atoms/                    # 최소 단위 컴포넌트
│   │   ├── Button.tsx            # primary/danger/success/outline/ghost
│   │   ├── Input.tsx             # 텍스트 입력
│   │   ├── Select.tsx            # 셀렉트 박스
│   │   ├── Textarea.tsx          # 텍스트에어리어
│   │   ├── Label.tsx             # 폼 레이블
│   │   ├── SeverityBadge.tsx     # 중증도 뱃지 (상/중/하)
│   │   ├── StatusBadge.tsx       # 상태 뱃지 (정상/확인요망/주의)
│   │   ├── Avatar.tsx            # 원형 이니셜 아바타
│   │   ├── Modal.tsx             # 범용 모달
│   │   ├── Spinner.tsx           # 로딩 스피너
│   │   └── index.ts
│   │
│   ├── molecules/                # Atom 조합 컴포넌트
│   │   ├── StatCard.tsx          # 통계 카드
│   │   ├── SectionCard.tsx       # 섹션 래퍼 카드
│   │   ├── FormField.tsx         # Label + Input
│   │   ├── LogItem.tsx           # 로그 단일 행
│   │   └── index.ts
│   │
│   ├── organisms/                # 독립적 UI 블록
│   │   ├── SideNav.tsx           # 사이드바 내비게이션
│   │   ├── TopBar.tsx            # 페이지 상단 바
│   │   ├── SeniorDetailModal.tsx # 대상자 상세 모달
│   │   ├── ConfirmProcessModal.tsx
│   │   ├── RegisterSeniorModal.tsx
│   │   └── index.ts
│   │
│   └── templates/
│       ├── AppLayout.tsx         # SideNav + 콘텐츠 레이아웃
│       └── index.ts
│
├── store/
│   └── useMonitorStore.ts        # Zustand 전역 스토어
│
├── types/
│   └── index.ts                  # 공통 TypeScript 타입
│
├── constants/
│   └── index.ts                  # 라우트, 레이블, 옵션 상수
│
├── utils/
│   └── cn.ts                     # clsx + tailwind-merge 헬퍼
│
└── hooks/
    └── (커스텀 훅 추가 예정)
```

---

## 디자인 시스템

### Tailwind v4 커스텀 컬러

`src/app/globals.css`의 `@theme` 블록에서 정의합니다.  
`--color-*` 변수는 Tailwind 유틸리티 클래스(`bg-primary`, `text-danger` 등)로 자동 매핑됩니다.

> ⚠️ Tailwind v4는 `tailwind.config.js`를 사용하지 않습니다. 커스텀 색상은 반드시 `globals.css @theme`에 추가하세요.

| 변수 | 값 | 사용 예 |
|---|---|---|
| `--color-primary` | `#5B67F5` | `bg-primary`, `text-primary` |
| `--color-primary-light` | `#ECEFFE` | `bg-primary-light` |
| `--color-danger` | `#F5365C` | `bg-danger`, `text-danger` |
| `--color-success` | `#2DCE89` | `text-success` |
| `--color-warning` | `#FFB547` | `text-warning` |
| `--color-text-main` | `#1A1D3B` | `text-text-main` |
| `--color-text-sub` | `#8B8FA8` | `text-text-sub` |
| `--color-border` | `#E8EAF2` | `border-border` |
| `--color-bg-main` | `#F0F2F8` | `bg-bg-main` |
| `--color-bg-card` | `#FFFFFF` | `bg-bg-card` |

### cn() 유틸리티

```ts
import { cn } from "@/utils/cn";

<div className={cn("base-class", isActive && "active-class", className)} />
```

---

## 컴포넌트 사용 예시

### Button

```tsx
import { Button } from "@/components/atoms";

<Button variant="primary" size="md">저장</Button>
<Button variant="danger" size="sm">삭제</Button>
<Button variant="outline">취소</Button>
<Button isLoading>처리 중...</Button>
```

`variant`: `primary` | `danger` | `success` | `outline` | `ghost`  
`size`: `sm` | `md`

### SeverityBadge / StatusBadge

```tsx
import { SeverityBadge, StatusBadge } from "@/components/atoms";

<SeverityBadge level="high" />   {/* 상 — 빨강 */}
<SeverityBadge level="mid" />    {/* 중 — 노랑 */}
<SeverityBadge level="low" />    {/* 하 — 초록 */}

<StatusBadge status="danger" />  {/* ● 확인요망 */}
<StatusBadge status="success" /> {/* ● 정상 */}
```

### Modal

```tsx
import { Modal, Button } from "@/components/atoms";

<Modal
  isOpen={isOpen}
  onClose={() => setIsOpen(false)}
  title="제목"
  size="md"
  footer={
    <>
      <Button variant="outline" onClick={onClose}>취소</Button>
      <Button onClick={onSave}>저장</Button>
    </>
  }
>
  {/* 본문 */}
</Modal>
```

`size`: `sm` (520px) | `md` (660px) | `lg` (800px)  
ESC 키 또는 배경 클릭으로 닫힙니다.

### StatCard

```tsx
import { StatCard } from "@/components/molecules";

<StatCard
  label="확인요망"
  value={5}
  sub="기상 신호 미수신"
  valueColor="red"
  href="/alert-list"
/>
```

`valueColor`: `default` | `red` | `blue` | `green`  
`href` 지정 시 링크 카드로 렌더링됩니다.

### SectionCard

```tsx
import { SectionCard } from "@/components/molecules";

<SectionCard
  title="대상자 목록"
  subTitle="총 127명"
  actions={<Button size="sm">+ 등록</Button>}
>
  <table>...</table>
</SectionCard>
```

---

## 전역 상태 (Zustand)

```ts
import { useMonitorStore } from "@/store/useMonitorStore";

const { alertTargets, setAlertTargets, isLoading } = useMonitorStore();
```

| 필드 | 타입 | 설명 |
|---|---|---|
| `alertTargets` | `AlertTarget[]` | 확인요망 대상자 목록 |
| `logs` | `LogEntry[]` | 시스템 로그 |
| `monitoringSignals` | `MonitoringSignal[]` | 수신 신호 목록 |
| `isLoading` | `boolean` | 로딩 상태 |

---

## 주요 타입

```ts
// src/types/index.ts

type SeverityLevel = "high" | "mid" | "low";
type AlertStatus   = "danger" | "success" | "warning" | "info";
type LogType       = "query" | "action" | "system" | "login";

interface AlertTarget {
  id: string;
  name: string;
  age: number;
  phone: string;
  address: string;
  severity: SeverityLevel;
  registeredAt: string;
  status: AlertStatus;
  lastWakeSignal?: string;
}

interface Senior {
  id: string;
  name: string;
  birthDate: string;
  phone: string;
  address: string;
  severity: SeverityLevel;
  communityCenter: string;
  registeredAt: string;
}
```

---

## 환경 변수

현재 별도 `.env` 설정 없음.  
백엔드 API 연동 시 `.env.local`에 추가:

```env
NEXT_PUBLIC_API_BASE_URL=https://your-backend.railway.app
```

---

## 백엔드 연동 포인트

각 페이지 상단의 mock 데이터 배열을 실제 API 호출로 교체합니다.

| 파일 | 교체 대상 |
|---|---|
| `app/dashboard/page.tsx` | `ALERT_ROWS` 배열 → GET /alerts |
| `app/alert-list/page.tsx` | `ALERT_ROWS` 배열 → GET /alerts |
| `app/seniors/page.tsx` | `SENIORS` 배열 → GET /seniors |
| `app/monitoring/page.tsx` | `SIGNALS` 배열 → GET /signals |
| `app/logs/page.tsx` | `LOGS` 배열 → GET /logs |

---

## 브라우저 지원

Chrome, Edge, Firefox 최신 버전 권장 (IE 미지원)
