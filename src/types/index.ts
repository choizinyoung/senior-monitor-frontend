export type SeverityLevel = "high" | "mid" | "low";
export type SeniorStatus = "normal" | "warning" | "danger" | "offline";
export type AlertStatus = "danger" | "success" | "warning" | "info";
export type LogType = "query" | "action" | "system" | "login";

export interface Senior {
  id: string;
  name: string;
  birthDate: string;
  phone: string;
  address: string;
  severity: SeverityLevel;
  communityCenter: string;
  registeredAt: string;
  wakeWindowStart?: string;
  wakeWindowEnd?: string;
  memo?: string;
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

export interface ContactHistory {
  id: string;
  date: string;
  type: string;
  memo?: string;
  note?: string;
}

export interface SeniorDetail extends AlertTarget {
  communityCenter: string;
  contacts: ContactHistory[];
}

export interface ConfirmForm {
  date: string;
  time: string;
  processStatus: "확인완료" | "확인요망 유지" | "응급 이관";
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
