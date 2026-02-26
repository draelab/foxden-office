import { useTranslation } from "react-i18next";
import { Settings } from "lucide-react";

export function SettingsPage() {
  const { t } = useTranslation("console");
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">{t("settings.title")}</h1>
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">{t("settings.description")}</p>
      </div>
      <div className="flex flex-col items-center justify-center rounded-lg border-2 border-dashed border-gray-300 py-16 dark:border-gray-700">
        <Settings className="mb-3 h-10 w-10 text-gray-400 dark:text-gray-500" />
        <p className="text-sm text-gray-500 dark:text-gray-400">{t("settings.comingSoon")}</p>
        <p className="mt-1 text-xs text-gray-400 dark:text-gray-500">{t("settings.waitingPhase")}</p>
      </div>
    </div>
  );
}
