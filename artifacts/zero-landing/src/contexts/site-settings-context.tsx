import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import { apiGet, apiPut } from "@/lib/api";

export interface SiteSettings {
  accentColor: string;
  primaryFont: string;
  updatedAt?: string;
}

export const DEFAULT_SITE_SETTINGS: SiteSettings = {
  accentColor: "#00D9FF",
  primaryFont: "IBM Plex Sans Arabic",
};

interface SiteSettingsContextValue {
  settings: SiteSettings;
  loading: boolean;
  saveSettings: (next: Pick<SiteSettings, "accentColor" | "primaryFont">) => Promise<SiteSettings>;
  refreshSettings: () => Promise<void>;
}

const SiteSettingsContext = createContext<SiteSettingsContextValue | null>(null);

function hexToHslChannels(hex: string): string {
  const normalized = hex.replace("#", "");
  const r = parseInt(normalized.slice(0, 2), 16) / 255;
  const g = parseInt(normalized.slice(2, 4), 16) / 255;
  const b = parseInt(normalized.slice(4, 6), 16) / 255;
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  const lightness = (max + min) / 2;

  if (max === min) return `0 0% ${Math.round(lightness * 100)}%`;

  const delta = max - min;
  const saturation =
    lightness > 0.5 ? delta / (2 - max - min) : delta / (max + min);
  let hue = 0;

  if (max === r) hue = (g - b) / delta + (g < b ? 6 : 0);
  else if (max === g) hue = (b - r) / delta + 2;
  else hue = (r - g) / delta + 4;

  return `${Math.round(hue * 60)} ${Math.round(saturation * 100)}% ${Math.round(lightness * 100)}%`;
}

function fontStack(font: string): string {
  const safeFont = font.replace(/["']/g, "");
  return `'${safeFont}', 'IBM Plex Sans Arabic', sans-serif`;
}

function applySiteSettings(settings: SiteSettings) {
  if (typeof document === "undefined") return;
  const root = document.documentElement;
  const channels = hexToHslChannels(settings.accentColor);
  root.style.setProperty("--primary", channels);
  root.style.setProperty("--accent", channels);
  root.style.setProperty("--sidebar-primary", channels);
  root.style.setProperty("--sidebar-accent", channels);
  root.style.setProperty("--app-font-sans", fontStack(settings.primaryFont));
  root.dataset.zeroFont = settings.primaryFont;
}

export function SiteSettingsProvider({ children }: { children: ReactNode }) {
  const [settings, setSettings] = useState<SiteSettings>(DEFAULT_SITE_SETTINGS);
  const [loading, setLoading] = useState(true);

  const refreshSettings = useCallback(async () => {
    try {
      const next = await apiGet<SiteSettings>("/site-settings");
      setSettings({ ...DEFAULT_SITE_SETTINGS, ...next });
      applySiteSettings({ ...DEFAULT_SITE_SETTINGS, ...next });
    } catch {
      applySiteSettings(DEFAULT_SITE_SETTINGS);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void refreshSettings();
  }, [refreshSettings]);

  const saveSettings = useCallback(
    async (next: Pick<SiteSettings, "accentColor" | "primaryFont">) => {
      const saved = await apiPut<SiteSettings>("/site-settings", next);
      const merged = { ...DEFAULT_SITE_SETTINGS, ...saved };
      setSettings(merged);
      applySiteSettings(merged);
      return merged;
    },
    [],
  );

  const value = useMemo(
    () => ({ settings, loading, saveSettings, refreshSettings }),
    [settings, loading, saveSettings, refreshSettings],
  );

  return <SiteSettingsContext.Provider value={value}>{children}</SiteSettingsContext.Provider>;
}

export function useSiteSettings() {
  const context = useContext(SiteSettingsContext);
  if (!context) throw new Error("useSiteSettings must be used inside SiteSettingsProvider");
  return context;
}