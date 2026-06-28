import { Trophy, MapPin, Users, CalendarDays, Award, Coins, Building2, Check, X } from 'lucide-react';
import type { MatchItem } from '../../data/mockData';
import { matchRoundData, matchResultData } from '../../data/mockData';

interface MatchCardProps {
  match: MatchItem;
  onView: (match: MatchItem) => void;
  onApprove?: (matchId: string) => void;
  onReject?: (matchId: string, reason?: string) => void;
  onResetToReview?: (matchId: string) => void;
}

const statusMap: Record<MatchItem['status'], { label: string; color: string; bg: string; headerGrad: string }> = {
  draft:     { label: '未发布', color: 'text-slate-600',   bg: 'bg-slate-100',   headerGrad: 'from-slate-500 to-slate-700' },
  open:      { label: '报名中', color: 'text-emerald-600', bg: 'bg-emerald-50',  headerGrad: 'from-emerald-500 to-teal-600' },
  closing:   { label: '即将截止', color: 'text-amber-600', bg: 'bg-amber-50',    headerGrad: 'from-amber-500 to-orange-600' },
  live:      { label: '进行中', color: 'text-blue-600',    bg: 'bg-blue-50',     headerGrad: 'from-blue-500 to-blue-700' },
  ended:     { label: '已结束', color: 'text-slate-500',   bg: 'bg-slate-100',   headerGrad: 'from-slate-600 to-slate-800' },
  cancelled: { label: '已取消', color: 'text-red-600',     bg: 'bg-red-50',      headerGrad: 'from-red-400 to-red-600' },
};

// 小游戏色点，用于卡片内文字区域标识
const gameDot: Record<string, string> = {
  MLBB:      'bg-sky-400',
  'Dota 2':  'bg-purple-400',
  PUBG:      'bg-emerald-400',
  eFootball: 'bg-amber-400',
};

export default function MatchCard({ match, onView, onApprove, onReject, onResetToReview }: MatchCardProps) {
  const isPendingReview = match.source === 'user' && match.approvalStatus === 'pending_review';
  const status = statusMap[match.status];
  // 待审核赛事用特殊紫色头部
  const headerGrad = isPendingReview ? 'from-violet-500 to-violet-700' : status.headerGrad;
  const progress = Math.min(100, Math.round((match.signed / match.cap) * 100));

  const hasPendingResult =
    (match.status === 'ended' || match.status === 'live') &&
    matchRoundData
      .filter((round) => round.matchId === match.id)
      .some((round) => round.matches.some((game) => game.status !== 'completed'));

  const pendingPoints = matchResultData.filter(
    (record) => record.matchId === match.id && record.status === 'pending'
  ).length;

  const todoItems = [
    match.status === 'draft' && match.auditRequired
      ? { key: 'publish', text: '待发布审核', icon: null, color: 'text-blue-600', bg: 'bg-blue-50', dot: 'bg-blue-500' }
      : null,
    match.pendingAudit > 0
      ? { key: 'audit', text: `${match.pendingAudit} 条报名待审核`, icon: null, color: 'text-amber-600', bg: 'bg-amber-50', dot: 'bg-amber-500' }
      : null,
    hasPendingResult
      ? { key: 'result', text: '赛果待录入', icon: Award, color: 'text-rose-600', bg: 'bg-rose-50', dot: 'bg-rose-500' }
      : null,
    pendingPoints > 0
      ? { key: 'points', text: `${pendingPoints} 条积分待发放`, icon: Coins, color: 'text-violet-600', bg: 'bg-violet-50', dot: 'bg-violet-500' }
      : null,
  ].filter(Boolean) as { key: string; text: string; icon: typeof Award | null; color: string; bg: string; dot: string }[];

  return (
    <div
      onClick={() => onView(match)}
      className="bg-white border border-slate-200 rounded-xl overflow-hidden hover:shadow-md transition-shadow cursor-pointer group"
    >
      <div className={`h-24 bg-gradient-to-br ${headerGrad} relative p-4`}>
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
        <div className="absolute top-3 right-3 z-10 flex items-center gap-1.5">
          {match.source === 'user' && (
            <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-medium bg-white/20 text-white border border-white/30">
              授权方
            </span>
          )}
          <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-white/20 text-white border border-white/30`}>
            {isPendingReview ? '待审核' : status.label}
          </span>
        </div>
        <div className="absolute bottom-3 left-4 right-16 z-10">
          <div className="text-white font-bold text-lg leading-tight truncate drop-shadow">{match.name}</div>
          <div className="flex items-center gap-2 mt-1">
            <span className={`w-2 h-2 rounded-full shrink-0 ${gameDot[match.game] || 'bg-white/50'}`} />
            <span className="text-white/80 text-xs">{match.game}</span>
            <span className="text-white/40 text-xs">·</span>
            <span className="text-white/80 text-xs">{match.bracket}</span>
            {match.prizeAmount && (
              <>
                <span className="text-white/40 text-xs">·</span>
                <span className="text-yellow-200 text-xs font-medium flex items-center gap-0.5">
                  <Trophy size={10} />
                  {match.prizeAmount}
                </span>
              </>
            )}
          </div>
        </div>
      </div>

      <div className="p-4 space-y-3">
        <div className="flex items-center gap-3 text-xs text-slate-500">
          <span className="flex items-center gap-1 min-w-0">
            <Building2 size={12} className="text-slate-400 shrink-0" />
            <span className="truncate">{match.organizerName}</span>
          </span>
          <span className="flex items-center gap-1 shrink-0">
            <MapPin size={12} className="text-slate-400" />
            <span className="truncate max-w-[80px]">{match.location}</span>
          </span>
        </div>

        <div className="flex items-center gap-1.5 text-xs text-slate-500">
          <CalendarDays size={12} className="text-slate-400 shrink-0" />
          <span>{match.matchStart}</span>
          <span className="text-slate-300">→</span>
          <span>{match.matchEnd}</span>
        </div>

        <div className="space-y-1.5">
          <div className="flex items-center justify-between text-xs text-slate-500">
            <div className="flex items-center gap-1">
              <Users size={12} />
              <span>报名 {match.signed} / {match.cap}</span>
            </div>
            <span className={progress >= 100 ? 'text-emerald-600 font-medium' : ''}>{progress}%</span>
          </div>
          <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
            <div
              className={`h-full rounded-full transition-all ${progress >= 100 ? 'bg-emerald-500' : 'bg-primary'}`}
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        {todoItems.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {todoItems.map((item) => {
              const Icon = item.icon;
              return (
                <div
                  key={item.key}
                  className={`inline-flex items-center gap-1.5 text-xs ${item.color} ${item.bg} px-2 py-1.5 rounded-lg`}
                >
                  <span className={`w-1.5 h-1.5 rounded-full ${item.dot} animate-pulse`} />
                  {Icon && <Icon size={12} />}
                  {item.text}
                </div>
              );
            })}
          </div>
        )}

        {match.source === 'user' && (onApprove || onReject || onResetToReview) && (
          <div className="pt-1 border-t border-slate-100" onClick={(e) => e.stopPropagation()}>
            {match.approvalStatus === 'pending_review' && onApprove && onReject && (
              <div className="flex items-center gap-2">
                <span className="text-xs text-violet-600 bg-violet-50 px-2 py-1 rounded flex-1">待审核</span>
                <button
                  onClick={() => onReject(match.id, '')}
                  className="flex items-center gap-1 text-xs px-2.5 py-1 border border-red-200 text-red-500 rounded-lg hover:bg-red-50 transition-colors"
                >
                  <X size={11} />驳回
                </button>
                <button
                  onClick={() => onApprove(match.id)}
                  className="flex items-center gap-1 text-xs px-2.5 py-1 bg-emerald-500 text-white rounded-lg hover:bg-emerald-600 transition-colors"
                >
                  <Check size={11} />通过
                </button>
              </div>
            )}
            {match.approvalStatus === 'rejected' && onResetToReview && (
              <div className="flex items-center gap-2">
                <span className="flex items-center gap-1 text-xs text-red-500 bg-red-50 px-2 py-1 rounded flex-1">
                  <X size={11} />已驳回
                </span>
                <button
                  onClick={() => onResetToReview(match.id)}
                  className="text-xs px-2.5 py-1 border border-slate-200 text-slate-600 rounded-lg hover:bg-slate-50 transition-colors"
                >
                  重新审核
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
