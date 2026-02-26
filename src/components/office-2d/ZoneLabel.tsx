import { useTranslation } from "react-i18next";
import { ZONES } from "@/lib/constants";
import { useOfficeStore } from "@/store/office-store";

interface ZoneLabelProps {
  zone: { x: number; y: number; width: number; height: number; label: string };
  zoneKey: keyof typeof ZONES;
}

export function ZoneLabel({ zone, zoneKey }: ZoneLabelProps) {
  const { t } = useTranslation("common");
  const theme = useOfficeStore((s) => s.theme);
  const isDark = theme === "dark";
  const textColor = isDark ? "#94a3b8" : "#475569";
  const bgColor = isDark ? "rgba(30, 41, 59, 0.6)" : "rgba(255, 255, 255, 0.6)";

  return (
    <foreignObject x={zone.x + 16} y={zone.y + 16} width={120} height={32}>
      <div
        style={{
          display: "inline-flex",
          alignItems: "center",
          padding: "4px 12px",
          borderRadius: "8px",
          backgroundColor: bgColor,
          backdropFilter: "blur(8px)",
          color: textColor,
          fontSize: "13px",
          fontWeight: 600,
          boxShadow: isDark ? "0 2px 4px rgba(0,0,0,0.2)" : "0 2px 4px rgba(0,0,0,0.05)",
          border: `1px solid ${isDark ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.05)"}`,
        }}
      >
        {t(`zones.${zoneKey}`)}
      </div>
    </foreignObject>
  );
}
