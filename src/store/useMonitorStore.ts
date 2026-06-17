import { create } from "zustand";
import { AlertTarget, LogEntry, MonitoringSignal } from "@/types";

interface MonitorState {
  alertTargets: AlertTarget[];
  logs: LogEntry[];
  monitoringSignals: MonitoringSignal[];
  isLoading: boolean;
  sidebarOpen: boolean;
  setAlertTargets: (targets: AlertTarget[]) => void;
  setLogs: (logs: LogEntry[]) => void;
  setMonitoringSignals: (signals: MonitoringSignal[]) => void;
  setLoading: (v: boolean) => void;
  toggleSidebar: () => void;
  closeSidebar: () => void;
}

export const useMonitorStore = create<MonitorState>((set) => ({
  alertTargets: [],
  logs: [],
  monitoringSignals: [],
  isLoading: false,
  sidebarOpen: false,
  setAlertTargets: (alertTargets) => set({ alertTargets }),
  setLogs: (logs) => set({ logs }),
  setMonitoringSignals: (monitoringSignals) => set({ monitoringSignals }),
  setLoading: (isLoading) => set({ isLoading }),
  toggleSidebar: () => set((s) => ({ sidebarOpen: !s.sidebarOpen })),
  closeSidebar: () => set({ sidebarOpen: false }),
}));
