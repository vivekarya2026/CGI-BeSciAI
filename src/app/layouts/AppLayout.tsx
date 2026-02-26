import React, { useState } from 'react';
import { Outlet } from 'react-router';
import { Sidebar } from '../components/Sidebar';
import { ByteBot } from '../components/ByteBot';
import { Menu } from 'lucide-react';

export default function AppLayout() {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#f8f9fb', fontFamily: "var(--font-primary)" }}>
      <Sidebar
        collapsed={collapsed}
        setCollapsed={setCollapsed}
        mobileOpen={mobileOpen}
        setMobileOpen={setMobileOpen}
      />

      {/* Mobile top bar — visible only below lg */}
      <div
        className="sticky top-0 z-40 flex lg:hidden items-center gap-3 bg-white border-b border-gray-100 px-4 py-3"
        style={{ boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}
      >
        <button
          onClick={() => setMobileOpen(true)}
          className="p-2 -ml-1 rounded-lg hover:bg-gray-50 cursor-pointer"
          aria-label="Open menu"
        >
          <Menu size={22} className="text-gray-700" />
        </button>
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 bg-[#5236ab] rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-sm">A</span>
          </div>
          <span className="font-bold text-gray-800 text-base">AI Adoption</span>
        </div>
      </div>

      {/* Main content */}
      <main className="transition-all duration-300 ease-in-out"
        style={{ paddingLeft: undefined }}
      >
        {/* On desktop (lg+), apply left padding to account for fixed sidebar */}
        <div
          className="p-4 sm:p-6 lg:p-8 max-w-[1280px] mx-auto"
          style={{}}
        >
          <style>{`
            @media (min-width: 1024px) {
              main { padding-left: ${collapsed ? 64 : 240}px !important; }
            }
          `}</style>
          <Outlet />
        </div>
      </main>

      <ByteBot />
    </div>
  );
}