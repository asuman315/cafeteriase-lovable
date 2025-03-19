
import * as React from "react"

const MOBILE_BREAKPOINT = 768

interface ThemeContextType {
  isMobile: boolean;
}

const ThemeContext = React.createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [isMobile, setIsMobile] = React.useState<boolean>(false);

  React.useEffect(() => {
    const mql = window.matchMedia(`(max-width: ${MOBILE_BREAKPOINT - 1}px)`)
    const onChange = () => {
      setIsMobile(window.innerWidth < MOBILE_BREAKPOINT)
    }
    mql.addEventListener("change", onChange)
    setIsMobile(window.innerWidth < MOBILE_BREAKPOINT)
    return () => mql.removeEventListener("change", onChange)
  }, [])

  return (
    <ThemeContext.Provider value={{ isMobile }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useIsMobile() {
  const context = React.useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useIsMobile must be used within a ThemeProvider');
  }
  return context.isMobile;
}
