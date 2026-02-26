// Domain Mapping: Gateway payload → UI ViewModel 转换

import type { ChannelInfo, CronTask, SkillInfo } from "@/gateway/adapter-types";
import i18n from "@/i18n";

// --- ViewModel Types ---

export interface ChannelCardVM {
  id: string;
  name: string;
  type: string;
  statusLabel: string;
  statusColor: string;
  icon: string;
}

export interface SkillCardVM {
  id: string;
  name: string;
  description: string;
  enabled: boolean;
  icon: string;
  source: string;
}

export interface CronTaskCardVM {
  id: string;
  name: string;
  schedule: string;
  scheduleLabel: string;
  enabled: boolean;
  lastRunAt: number | null;
  nextRunAt: number | null;
  statusLabel: string;
}

// --- Channel icons ---

const CHANNEL_ICONS: Record<string, string> = {
  whatsapp: "📱",
  telegram: "✈️",
  discord: "🎮",
  signal: "🔒",
  feishu: "🐦",
  imessage: "💬",
  matrix: "🔗",
  line: "🟢",
  msteams: "👔",
  googlechat: "💭",
  mattermost: "💠",
};

function getChannelStatusLabel(status: string): string {
  return i18n.t(`console:viewModels.statusLabels.${status}`, { defaultValue: status });
}

const STATUS_COLORS: Record<string, string> = {
  connected: "#22c55e",
  disconnected: "#6b7280",
  connecting: "#eab308",
  error: "#ef4444",
};

// --- Conversion Functions ---

export function toChannelCardVM(channel: ChannelInfo): ChannelCardVM {
  return {
    id: channel.id,
    name: channel.name,
    type: channel.type,
    statusLabel: getChannelStatusLabel(channel.status),
    statusColor: STATUS_COLORS[channel.status] ?? "#6b7280",
    icon: CHANNEL_ICONS[channel.type] ?? "📡",
  };
}

export function toSkillCardVM(skill: SkillInfo): SkillCardVM {
  return {
    id: skill.id,
    name: skill.name,
    description: skill.description,
    enabled: skill.enabled,
    icon: skill.icon || "📦",
    source: skill.isBundled ? i18n.t("console:viewModels.skillSource.builtIn") : i18n.t("console:viewModels.skillSource.marketplace"),
  };
}

export function toCronTaskCardVM(task: CronTask): CronTaskCardVM {
  const schedule = typeof task.schedule === "string" ? task.schedule : formatCronSchedule(task.schedule);

  return {
    id: task.id,
    name: task.name,
    schedule,
    scheduleLabel: describeCronSchedule(schedule),
    enabled: task.enabled,
    lastRunAt: task.lastRun?.time ? new Date(task.lastRun.time).getTime() : null,
    nextRunAt: task.nextRun ? new Date(task.nextRun).getTime() : null,
    statusLabel: task.enabled ? i18n.t("console:viewModels.taskStatus.active") : i18n.t("console:viewModels.taskStatus.paused"),
  };
}

function formatCronSchedule(s: { kind: string; expr?: string; everyMs?: number; at?: string }): string {
  if (s.kind === "cron" && s.expr) return s.expr;
  if (s.kind === "every" && s.everyMs) return i18n.t("console:viewModels.schedule.every", { minutes: Math.round(s.everyMs / 60_000) });
  if (s.kind === "at" && s.at) return i18n.t("console:viewModels.schedule.at", { time: s.at });
  return i18n.t("console:viewModels.schedule.unknown");
}

function describeCronSchedule(expr: string): string {
  const parts = expr.split(" ");
  if (parts.length !== 5) return expr;

  const [min, hour, dom, _mon, dow] = parts;

  if (dom === "*" && dow === "*" && hour !== "*" && min !== "*") {
    return i18n.t("console:viewModels.schedule.daily", { time: `${hour}:${min.padStart(2, "0")}` });
  }
  if (dow !== "*" && dom === "*") {
    return i18n.t("console:viewModels.schedule.weekly", { day: dow, time: `${hour}:${min.padStart(2, "0")}` });
  }

  return expr;
}
