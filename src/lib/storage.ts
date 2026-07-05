import type { MatchItem, MatchRound, MatchResultRecord, TournamentStage } from '../data/mockData';
import type { SignupAuditItem } from '../data/mockData';
import { pendingReviewMatches } from '../data/mockData';

const K = {
  matches: 'gl:matches',
  rounds: (id: string) => `gl:rounds:${id}`,
  stages: (id: string) => `gl:stages:${id}`,
  signup: (id: string) => `gl:signup:${id}`,
  results: (id: string) => `gl:results:${id}`,
  advanced: (id: string) => `gl:advanced:${id}`,
  dataVersion: 'gl:data_version',
};

// 数据版本迁移：版本号升级时清除所有对阵轮次缓存，避免旧格式脏数据导致崩溃
const CURRENT_DATA_VERSION = '3';
try {
  if (localStorage.getItem(K.dataVersion) !== CURRENT_DATA_VERSION) {
    Object.keys(localStorage)
      .filter((k) => k.startsWith('gl:rounds:'))
      .forEach((k) => localStorage.removeItem(k));
    localStorage.setItem(K.dataVersion, CURRENT_DATA_VERSION);
  }
} catch { /* 忽略 */ }

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
    // 补全旧数据缺少的字段，并将 advancement 从旧的对象格式规范化为数组格式
    const normalized = stored.map((m) => ({
      ...m,
      source: m.source ?? ('admin' as const),
      stages: m.stages?.map((s: any) => {
        let advancement: any[];
        if (Array.isArray(s.advancement)) {
          advancement = s.advancement;
        } else if (s.advancement) {
          advancement = [s.advancement];
        } else {
          advancement = [];
        }
        // 过滤掉旧版 NONE 类型（表示"无晋级"，等价于空数组）
        advancement = advancement.filter((r: any) => r?.type !== 'NONE');
        return { ...s, advancement };
      }),
    })) as MatchItem[];
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

  // ── 赛段配置（含积分规则等） ────────────────────────────────────────────────
  getStages(matchId: string): TournamentStage[] | null {
    return load<TournamentStage[]>(K.stages(matchId));
  },
  saveStages(matchId: string, stages: TournamentStage[]): void {
    save(K.stages(matchId), stages);
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
