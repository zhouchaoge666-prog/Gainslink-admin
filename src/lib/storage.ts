import type { MatchItem, MatchRound, MatchResultRecord } from '../data/mockData';
import type { SignupAuditItem } from '../data/mockData';
import { pendingReviewMatches } from '../data/mockData';

const K = {
  matches: 'gl:matches',
  rounds: (id: string) => `gl:rounds:${id}`,
  signup: (id: string) => `gl:signup:${id}`,
  results: (id: string) => `gl:results:${id}`,
  advanced: (id: string) => `gl:advanced:${id}`,
};

function load<T>(key: string): T | null {
  try {
    const raw = localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : null;
  } catch {
    return null;
  }
}

function save<T>(key: string, value: T): void {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // storage full or unavailable — silently ignore
  }
}

export const storage = {
  // ── 赛事列表 ──────────────────────────────────────────────────────────────
  getMatches(): MatchItem[] {
    const stored = load<MatchItem[]>(K.matches) ?? [];
    // 补全旧数据缺少的 source 字段
    const normalized = stored.map((m) => ({ ...m, source: m.source ?? ('admin' as const) }));
    // 合并 mock 待审核赛事（按 id 去重，不覆盖已处理的审核状态）
    const storedIds = new Set(normalized.map((m) => m.id));
    const merged = [
      ...pendingReviewMatches.filter((m) => !storedIds.has(m.id)),
      ...normalized,
    ];
    return merged;
  },
  saveMatches(matches: MatchItem[]): void {
    save(K.matches, matches);
  },

  // ── 对阵轮次 ──────────────────────────────────────────────────────────────
  getRounds(matchId: string): MatchRound[] | null {
    return load<MatchRound[]>(K.rounds(matchId));
  },
  saveRounds(matchId: string, rounds: MatchRound[]): void {
    save(K.rounds(matchId), rounds);
  },

  // ── 报名审核 ──────────────────────────────────────────────────────────────
  getSignup(matchId: string): SignupAuditItem[] {
    return load<SignupAuditItem[]>(K.signup(matchId)) ?? [];
  },
  saveSignup(matchId: string, items: SignupAuditItem[]): void {
    save(K.signup(matchId), items);
  },

  // ── 晋级队伍 ──────────────────────────────────────────────────────────────
  getAdvancedTeams(matchId: string): Record<string, string[]> {
    return load<Record<string, string[]>>(K.advanced(matchId)) ?? {};
  },
  saveAdvancedTeams(matchId: string, data: Record<string, string[]>): void {
    save(K.advanced(matchId), data);
  },

  // ── 成绩录入 ──────────────────────────────────────────────────────────────
  getResults(matchId: string): MatchResultRecord[] {
    return load<MatchResultRecord[]>(K.results(matchId)) ?? [];
  },
  saveResults(matchId: string, results: MatchResultRecord[]): void {
    save(K.results(matchId), results);
  },
};
