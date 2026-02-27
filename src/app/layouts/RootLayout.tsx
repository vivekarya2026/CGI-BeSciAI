/**
 * ============================================
 * 🧱 ROOT LAYOUT — RootLayout.tsx
 * ============================================
 *
 * The simplest layout — just a pass-through wrapper.
 * All routes are children of this layout (see routes.tsx).
 *
 * <Outlet /> is a special React Router component that
 * renders whatever child route matches the current URL.
 *
 * HINT: If you want to add something that appears on
 * EVERY page (like analytics or a global toast), add it here.
 */

import { Outlet } from 'react-router';

export default function RootLayout() {
  return <Outlet />;
}
