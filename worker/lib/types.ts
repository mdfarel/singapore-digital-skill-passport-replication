export interface Env {
  DB: D1Database;
  ASSETS: Fetcher;
  SESSION_SECRET?: string;
}

export type Row = Record<string, unknown>;
