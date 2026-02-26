import { useTranslation } from "react-i18next";
import { Puzzle } from "lucide-react";

export function SkillsPage() {
  const { t } = useTranslation("console");
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">{t("skills.title")}</h1>
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">{t("skills.description")}</p>
      </div>
      <div className="flex flex-col items-center justify-center rounded-lg border-2 border-dashed border-gray-300 py-16 dark:border-gray-700">
        <Puzzle className="mb-3 h-10 w-10 text-gray-400 dark:text-gray-500" />
        <p className="text-sm text-gray-500 dark:text-gray-400">{t("skills.comingSoon")}</p>
        <p className="mt-1 text-xs text-gray-400 dark:text-gray-500">{t("skills.waitingPhase")}</p>
      </div>
    </div>
  );
}
