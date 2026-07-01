export type DataSourceMode = "mock" | "supabase";

export function getRequestedDataSourceMode(): DataSourceMode {
  return process.env.MAESUCHECK_DATA_SOURCE === "supabase" ? "supabase" : "mock";
}

export function hasSupabaseServerConfig(): boolean {
  return Boolean(
    process.env.NEXT_PUBLIC_SUPABASE_URL &&
      (process.env.SUPABASE_SERVICE_ROLE_KEY ||
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY),
  );
}

export function shouldUseSupabaseDataSource(): boolean {
  return getRequestedDataSourceMode() === "supabase" && hasSupabaseServerConfig();
}

export function getActiveDataSourceMode(): DataSourceMode {
  return shouldUseSupabaseDataSource() ? "supabase" : "mock";
}
