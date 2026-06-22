"use client";

import { useState, useEffect } from "react";
import { useMonitorStore } from "@/store/useMonitorStore";

export default function MobileSidebarBackdrop() {
  const { sidebarOpen, closeSidebar } = useMonitorStore();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  if (!mounted || !sidebarOpen) return null;

  return (
    <div
      className="fixed inset-0 z-[99] bg-[rgba(26,29,59,0.48)] backdrop-blur-[2px] md:hidden"
      onClick={closeSidebar}
    />
  );
}
