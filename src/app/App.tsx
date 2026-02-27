/**
 * ============================================
 * 🏠 APP COMPONENT — App.tsx
 * ============================================
 * 
 * This is the "root" component that wraps everything.
 * 
 * It does FOUR important things:
 * 1. PasswordGate → Protects the entire app with a password screen.
 * 2. ThemeProvider → Manages System/Light/Dark theme across the app.
 * 3. UserProvider → Shares user data (name, archetype, progress)
 *    across ALL pages without passing props manually.
 * 4. RouterProvider → Handles page navigation (which URL shows which page).
 */

import { RouterProvider } from 'react-router';
import { router } from './routes';
import { UserProvider } from './context/UserContext';
import { ThemeProvider } from './context/ThemeContext';
import PasswordGate from './components/PasswordGate';

export default function App() {
  return (
    // PasswordGate blocks access until the correct password is entered
    <PasswordGate>
      {/* ThemeProvider manages light/dark/system theme globally */}
      <ThemeProvider>
        {/* UserProvider makes user data available everywhere in the app */}
        <UserProvider>
          {/* RouterProvider handles all the page routing (see routes.tsx) */}
          <RouterProvider router={router} />
        </UserProvider>
      </ThemeProvider>
    </PasswordGate>
  );
}
