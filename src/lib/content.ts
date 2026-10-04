import { supabase } from "./supabase";

export type Row = Record<string, any>;

export async function fetchRows(table: string, options: {
  published?: boolean;
  limit?: number;
  order?: string;
} = {}) {
  let query: any = supabase.from(table).select("*");
  if (options.published !== undefined) query = query.eq("published", options.published);
  query = query.order(options.order || "created_at", { ascending: false, nullsFirst: false });
  if (options.limit) query = query.limit(options.limit);
  return query;
}

export function cleanText(value: unknown) {
  return String(value ?? "").replace(/<[^>]*>/g, "").trim();
}

export function dateLabel(value: unknown) {
  if (!value) return "";
  return new Date(String(value)).toLocaleDateString("en-GH", {
    day: "numeric", month: "short", year: "numeric",
  });
}

export function mediaUrl(row: Row, ...keys: string[]) {
  for (const key of keys) {
    if (row?.[key]) return String(row[key]);
  }
  return "";
}
