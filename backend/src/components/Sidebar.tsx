"use client";

import SidebarContent from "./SidebarContent";

export default function Sidebar() {
  return (
    <aside className="w-72 bg-[#111827] text-white flex flex-col h-full shrink-0 border-l border-slate-800 overflow-y-auto font-sans">
      <SidebarContent />
    </aside>
  );
}
