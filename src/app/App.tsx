/**
 * ============================================
 * 🏠 APP COMPONENT — App.tsx
 * ============================================
 * 
 * This is the "root" component that wraps everything.
 * 
 * It does TWO important things:
 * 1. UserProvider → Shares user data (name, archetype, progress)
 *    across ALL pages without passing props manually.
 * 2. RouterProvider → Handles page navigation (which URL shows which page).
 * 
 * HINT: If you need to add a new "global" provider (like a Theme),
 * wrap it around <RouterProvider> here.
 */

import { RouterProvider } from 'react-router';
import { router } from './routes';
import { UserProvider } from './context/UserContext';

export default function App() {
  return (
    // UserProvider makes user data available everywhere in the app
    <UserProvider>
      {/* RouterProvider handles all the page routing (see routes.tsx) */}
      <RouterProvider router={router} />
    </UserProvider>
  );
}
