export type SeverityLevel = "high" | "mid" | "low";
export type SeniorStatus = "normal" | "warning" | "danger" | "offline";
export type AlertStatus = "danger" | "success" | "warning" | "info";
export type LogType = "query" | "action" | "system" | "login";

/** ERD SENIOR.status */
export type SeniorStatusType = "정상" | "확인요망" | "확인완료" | "확인요망유지" | "응급호출";

/** ERD CONTACT_HISTORY.result_status */
export type ResultStatusType = "확인완료" | "확인요망유지" | "응급호출";

/** 백엔드 공통 응답 래퍼 */
export interface ApiResponse<T> {
  success: boolean;
  data: T;
}

/** 백엔드 GET /api/seniors 단건 형태 (ERD v3 — address → city/gu/dong 분리) */
export interface ApiSenior {
  id: number;
  deviceId: string;
  name: string;
  age: number;
  phone: string;
  city: string;    // 시/도 (예: 서울)
  gu: string;      // 구/군 (예: 노원구)
  dong: string;    // 동 (예: 상계동)
  status: SeniorStatusType;
  isDeleted: "Y" | "N";
  registeredAt: string;
  updatedAt: string;
}

/** ERD CONTACT_HISTORY */
export interface ContactHistory {
  id: number;
  seniorId: number;
  managerName: string;
  resultStatus: ResultStatusType;
  memo?: string;
  contactedAt: string;
  createdAt: string;
}

export interface SeniorDetail {
  id: number;
  name: string;
  age: number;
  phone: string;
  city: string;
  gu: string;
  dong: string;
  status: SeniorStatusType;
  registeredAt: string;
  contacts: ContactHistory[];
}

export interface AlertTarget {
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

export interface ConfirmForm {
  date: string;
  time: string;
  processStatus: ResultStatusType;
  memo: string;
}

export interface MonitoringSignal {
  id: string;
  seniorName: string;
  device: string;
  receivedAt: string;
  status: AlertStatus;
}

export interface LogEntry {
  id: string;
  timestamp: string;
  type: LogType;
  user: string;
  message: string;
}

export interface StatCard {
  label: string;
  value: string | number;
  sub: string;
  valueColor?: "default" | "red" | "blue" | "green";
  clickable?: boolean;
  href?: string;
}

/** ERD SIGNAL_LOG */
export interface SignalLog {
  id: number;
  seniorId: number;
  receivedAt: string;
  signalDate: string;
}
