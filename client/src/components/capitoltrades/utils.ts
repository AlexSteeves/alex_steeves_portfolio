export function formatDate(raw: string | null, friendly: boolean): string {
  if (!raw) return "—";
  if (!friendly) return raw;
  const d = new Date(raw + "T00:00:00");
  return d.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}
