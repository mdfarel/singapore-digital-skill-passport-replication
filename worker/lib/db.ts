import type { Row } from './types';

export async function all<T = Row>(db: D1Database, sql: string, ...args: unknown[]): Promise<T[]> {
  const r = await db.prepare(sql).bind(...args).all<T>();
  return r.results ?? [];
}

export async function one<T = Row>(db: D1Database, sql: string, ...args: unknown[]): Promise<T | null> {
  const r = await db.prepare(sql).bind(...args).first<T>();
  return r ?? null;
}

export const json = (data: unknown, status = 200) =>
  new Response(JSON.stringify(data), { status, headers: { 'content-type': 'application/json; charset=utf-8' } });
