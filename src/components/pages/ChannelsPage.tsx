import { useTranslation } from "react-i18next";
import { Radio } from "lucide-react";

export function ChannelsPage() {
  const { t } = useTranslation("console");
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">{t("channels.title")}</h1>
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">{t("channels.description")}</p>
      </div>
      <div className="flex flex-col items-center justify-center rounded-lg border-2 border-dashed border-gray-300 py-16 dark:border-gray-700">
        <Radio className="mb-3 h-10 w-10 text-gray-400 dark:text-gray-500" />
        <p className="text-sm text-gray-500 dark:text-gray-400">{t("channels.comingSoon")}</p>
        <p className="mt-1 text-xs text-gray-400 dark:text-gray-500">{t("channels.waitingPhase")}</p>
      </div>
    </div>
  );
}
