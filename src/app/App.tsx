/**
 * ============================================
 * 🏠 APP COMPONENT — App.tsx
 * ============================================
 *
 * This is the "root" component that wraps everything.
 *
 * It does THREE important things:
 * 1. ThemeProvider → Manages System/Light/Dark theme across the app.
 * 2. UserProvider → Shares user data (name, archetype, progress)
 *    across ALL pages without passing props manually.
 * 3. RouterProvider → Handles page navigation (which URL shows which page).
 */

import { RouterProvider } from 'react-router';
import { router } from './routes';
import { UserProvider } from './context/UserContext';
import { ThemeProvider } from './context/ThemeContext';

export default function App() {
  return (
    <ThemeProvider>
      <UserProvider>
        <RouterProvider router={router} />
      </UserProvider>
    </ThemeProvider>
  );
}
