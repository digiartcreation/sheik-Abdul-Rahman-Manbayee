"use client";
import { createContext, useContext, useCallback, useSyncExternalStore } from "react";

const STORAGE_KEY = "manbayee-theme";

/**
 * The <html data-theme> attribute is the single source of truth — the inline
 * script in layout.js sets it before the first paint, so React must read from
 * it rather than hold a competing copy. useSyncExternalStore is the primitive
 * built for exactly this: an external value that differs between server and
 * client, without a setState-in-effect round trip.
 */
const themeStore = {
  listeners: new Set(),

  subscribe(callback) {
    themeStore.listeners.add(callback);
    return () => themeStore.listeners.delete(callback);
  },

  getSnapshot() {
    return document.documentElement.getAttribute("data-theme") || "light";
  },

  // The server has no DOM and no localStorage; it always renders the light
  // markup, and the inline script has already corrected the attribute by the
  // time the client reads it.
  getServerSnapshot() {
    return "light";
  },

  set(next) {
    document.documentElement.setAttribute("data-theme", next);
    try {
      localStorage.setItem(STORAGE_KEY, next);
    } catch {
      // Private browsing can refuse writes; the theme still holds for the visit.
    }
    themeStore.listeners.forEach((fn) => fn());
  },
};

const ThemeContext = createContext({ theme: "light", toggleTheme: () => {} });

export function useTheme() {
  return useContext(ThemeContext);
}

export default function ThemeProvider({ children }) {
  const theme = useSyncExternalStore(
    themeStore.subscribe,
    themeStore.getSnapshot,
    themeStore.getServerSnapshot
  );

  const toggleTheme = useCallback(() => {
    themeStore.set(themeStore.getSnapshot() === "light" ? "dark" : "light");
  }, []);

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}
