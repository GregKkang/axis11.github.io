import index from "@/data/market-pulse.json";

export type PulsePost = {
  date: string;
  title: string;
  summary: string;
  publishedAt: string;
  actualReturn: number;
  modelReturn: number;
  gap: number;
  readingMinutes: number;
};
export const pulsePosts = index as PulsePost[];
export const pulseUrl = (date: string) => `${import.meta.env.BASE_URL}market-pulse/${date}/`;
export const pulsePercent = (value: number) => `${value >= 0 ? "+" : "−"}${Math.abs(value).toFixed(2)}%`;
export const pulseGap = (value: number) => `${value >= 0 ? "+" : "−"}${Math.abs(value).toFixed(2)} pp`;
export const pulseDate = (date: string) => new Intl.DateTimeFormat("en-US", { month: "long", day: "numeric", year: "numeric", timeZone: "UTC" }).format(new Date(`${date}T12:00:00Z`));
const bodies = import.meta.glob<{ html: string }>("../data/market-pulse/*.json");
export async function loadPulseBody(date: string) {
  const loader = bodies[`../data/market-pulse/${date}.json`];
  if (!loader) throw new Error("Briefing body unavailable");
  const data = await loader();
  return data.html.replace(/@@BASE@@/g, import.meta.env.BASE_URL);
}
