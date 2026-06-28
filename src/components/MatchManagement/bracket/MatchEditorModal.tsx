import { useState, useRef } from 'react';
import { X, Video, Link, Upload, ExternalLink, Trash2 } from 'lucide-react';
import type { MatchGame, MatchRound } from '../../../data/mockData';
import type { TeamPoolItem } from '../TeamPool';
import NumericInput from '../NumericInput';

interface MatchEditorModalProps {
  round: MatchRound;
  game: MatchGame;
  availableTeams: TeamPoolItem[];
  /** When set, left side is always this team (row/纵坐标) */
  forcedTeamA?: string;
  /** When set, right side is always this team (col/横坐标) */
  forcedTeamB?: string;
  onClose: () => void;
  onSave: (roundId: string, gameId: string, updates: Partial<MatchGame>, winnerTeamName?: string) => void;
}

export default function MatchEditorModal({
  round,
  game,
  availableTeams,
  forcedTeamA,
  forcedTeamB,
  onClose,
  onSave,
}: MatchEditorModalProps) {
  // If forced order differs from how the game is stored, scores must be swapped
  const isFlipped =
    forcedTeamA !== undefined &&
    !game.teamAIsPlaceholder &&
    !game.teamBIsPlaceholder &&
    forcedTeamA !== game.teamA;

  const [teamA, setTeamA] = useState(forcedTeamA ?? (game.teamAIsPlaceholder ? '' : game.teamA));
  const [teamB, setTeamB] = useState(forcedTeamB ?? (game.teamBIsPlaceholder ? '' : game.teamB));
  const [scoreA, setScoreA] = useState<number | undefined>(
    isFlipped ? (game.scoreB ?? undefined) : (game.scoreA ?? undefined)
  );
  const [scoreB, setScoreB] = useState<number | undefined>(
    isFlipped ? (game.scoreA ?? undefined) : (game.scoreB ?? undefined)
  );
  const [status, setStatus] = useState(game.status);
  const [format, setFormat] = useState(game.format || 'BO1');
  // startTime stored as "YYYY-MM-DD HH:MM", datetime-local needs "YYYY-MM-DDTHH:MM"
  const toInput = (v: string) => v.replace(' ', 'T').slice(0, 16);
  const fromInput = (v: string) => v.replace('T', ' ');
  const [startTime, setStartTime] = useState(toInput(game.startTime || ''));
  const [replayUrl, setReplayUrl] = useState(game.replayUrl || '');
  const [replayInputMode, setReplayInputMode] = useState<'url' | 'file'>('url');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const displayName = (team: TeamPoolItem) => team.teamName || team.userNickname;

  const hasScores = scoreA !== undefined && scoreB !== undefined;
  const autoStatus: MatchGame['status'] = hasScores ? 'completed' : status;
  const autoWinner = hasScores
    ? scoreA > scoreB ? teamA : scoreB > scoreA ? teamB : ''
    : '';

  const handleSave = () => {
    // When isFlipped, the UI shows teams in reversed order.
    // We must save scores in the original game storage order (teamA/teamB unchanged)
    // to avoid swapping slot assignments and breaking the round-robin matrix.
    const savedScoreA = isFlipped ? scoreB : scoreA;
    const savedScoreB = isFlipped ? scoreA : scoreB;

    const updates: Partial<MatchGame> = {
      teamA: isFlipped ? game.teamA : teamA,
      teamB: isFlipped ? game.teamB : teamB,
      scoreA: savedScoreA,
      scoreB: savedScoreB,
      winner: autoWinner || undefined,
      status: autoStatus,
      format,
      startTime: startTime ? fromInput(startTime) : undefined,
      teamAIsPlaceholder: false,
      teamBIsPlaceholder: false,
      replayUrl: replayUrl.trim() || undefined,
    };
    onSave(round.roundId, game.gameId, updates, autoWinner || undefined);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[70] bg-black/40 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-lg w-full max-w-md overflow-hidden">
        <div className="flex items-center justify-between px-4 py-3 border-b border-slate-100">
          <div className="text-sm font-medium text-slate-800">编辑比赛</div>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600">
            <X size={16} />
          </button>
        </div>

        <div className="p-4 space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs text-slate-500 mb-1">
                左方队伍{forcedTeamA ? <span className="text-slate-400 ml-1">(纵坐标)</span> : ''}
              </label>
              <select
                value={teamA}
                onChange={(e) => setTeamA(e.target.value)}
                className="w-full text-sm px-2.5 py-1.5 border border-slate-200 rounded-lg outline-none focus:border-primary bg-transparent"
              >
                <option value="">— 选择队伍 —</option>
                {teamA && <option value={teamA}>{teamA}</option>}
                {availableTeams
                  .filter((t) => displayName(t) !== teamA)
                  .map((t) => (
                    <option key={t.userId} value={displayName(t)}>
                      {displayName(t)}
                    </option>
                  ))}
              </select>
            </div>
            <div>
              <label className="block text-xs text-slate-500 mb-1">
                右方队伍{forcedTeamB ? <span className="text-slate-400 ml-1">(横坐标)</span> : ''}
              </label>
              <select
                value={teamB}
                onChange={(e) => setTeamB(e.target.value)}
                className="w-full text-sm px-2.5 py-1.5 border border-slate-200 rounded-lg outline-none focus:border-primary bg-transparent"
              >
                <option value="">— 选择队伍 —</option>
                {teamB && <option value={teamB}>{teamB}</option>}
                {availableTeams
                  .filter((t) => displayName(t) !== teamB)
                  .map((t) => (
                    <option key={t.userId} value={displayName(t)}>
                      {displayName(t)}
                    </option>
                  ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs text-slate-500 mb-1">
                {teamA ? `${teamA} 比分` : '左方比分'}
              </label>
              <NumericInput
                value={scoreA}
                onChange={setScoreA}
                min={0}
                allowEmpty
                className="w-full text-sm px-2.5 py-1.5 border border-slate-200 rounded-lg outline-none focus:border-primary"
              />
            </div>
            <div>
              <label className="block text-xs text-slate-500 mb-1">
                {teamB ? `${teamB} 比分` : '右方比分'}
              </label>
              <NumericInput
                value={scoreB}
                onChange={setScoreB}
                min={0}
                allowEmpty
                className="w-full text-sm px-2.5 py-1.5 border border-slate-200 rounded-lg outline-none focus:border-primary"
              />
            </div>
          </div>

          {hasScores && (
            <div className="flex items-center gap-2 px-3 py-2 bg-slate-50 rounded-lg text-xs text-slate-600">
              <span>胜者：</span>
              <span className="font-semibold text-slate-800">
                {autoWinner || '平局'}
              </span>
              <span className="ml-auto text-emerald-600 font-medium">将自动标记为已结束</span>
            </div>
          )}

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs text-slate-500 mb-1">赛制</label>
              <select
                value={format}
                onChange={(e) => setFormat(e.target.value)}
                className="w-full text-sm px-2.5 py-1.5 border border-slate-200 rounded-lg outline-none focus:border-primary bg-transparent"
              >
                {['BO1', 'BO2', 'BO3', 'BO5'].map((f) => (
                  <option key={f} value={f}>{f}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs text-slate-500 mb-1">状态</label>
              <select
                value={autoStatus}
                onChange={(e) => setStatus(e.target.value as MatchGame['status'])}
                disabled={hasScores}
                className="w-full text-sm px-2.5 py-1.5 border border-slate-200 rounded-lg outline-none focus:border-primary bg-transparent disabled:opacity-50"
              >
                <option value="scheduled">未开始</option>
                <option value="live">进行中</option>
                <option value="completed">已结束</option>
                <option value="cancelled">已取消</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs text-slate-500 mb-1">开始时间</label>
            <input
              type="datetime-local"
              value={startTime}
              onChange={(e) => setStartTime(e.target.value)}
              className="w-full text-sm px-2.5 py-1.5 border border-slate-200 rounded-lg outline-none focus:border-primary bg-transparent"
            />
          </div>

          {/* 录像上传 */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="flex items-center gap-1.5 text-xs text-slate-500">
                <Video size={12} />
                比赛录像
              </label>
              <div className="flex items-center bg-slate-100 rounded-md p-0.5">
                <button
                  onClick={() => setReplayInputMode('url')}
                  className={`flex items-center gap-1 text-[10px] px-2 py-0.5 rounded transition-colors ${replayInputMode === 'url' ? 'bg-white text-slate-700 shadow-sm' : 'text-slate-500'}`}
                >
                  <Link size={9} />链接
                </button>
                <button
                  onClick={() => setReplayInputMode('file')}
                  className={`flex items-center gap-1 text-[10px] px-2 py-0.5 rounded transition-colors ${replayInputMode === 'file' ? 'bg-white text-slate-700 shadow-sm' : 'text-slate-500'}`}
                >
                  <Upload size={9} />文件
                </button>
              </div>
            </div>

            {replayUrl ? (
              <div className="flex items-center gap-2 px-3 py-2 bg-blue-50 border border-blue-200 rounded-lg">
                <Video size={13} className="text-blue-500 shrink-0" />
                <span className="flex-1 text-xs text-blue-700 truncate">{replayUrl}</span>
                <a
                  href={replayUrl}
                  target="_blank"
                  rel="noreferrer"
                  onClick={(e) => e.stopPropagation()}
                  className="text-blue-500 hover:text-blue-700 shrink-0"
                  title="在新标签页打开"
                >
                  <ExternalLink size={12} />
                </a>
                <button
                  onClick={() => setReplayUrl('')}
                  className="text-slate-400 hover:text-red-500 shrink-0"
                  title="移除录像"
                >
                  <Trash2 size={12} />
                </button>
              </div>
            ) : replayInputMode === 'url' ? (
              <input
                type="url"
                value={replayUrl}
                onChange={(e) => setReplayUrl(e.target.value)}
                placeholder="粘贴录像链接（YouTube、Bilibili 等）"
                className="w-full text-sm px-2.5 py-1.5 border border-slate-200 rounded-lg outline-none focus:border-primary bg-transparent placeholder:text-slate-300"
              />
            ) : (
              <>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="video/*"
                  className="hidden"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) {
                      // 实际项目中此处调用上传接口，这里用文件名作为占位
                      setReplayUrl(`[待上传] ${file.name}`);
                    }
                  }}
                />
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="w-full flex items-center justify-center gap-2 text-xs px-3 py-2.5 border border-dashed border-slate-300 rounded-lg text-slate-500 hover:border-primary hover:text-primary transition-colors"
                >
                  <Upload size={13} />
                  点击选择视频文件（MP4 / MOV / AVI）
                </button>
              </>
            )}
          </div>
        </div>

        <div className="flex items-center justify-end gap-2 px-4 py-3 border-t border-slate-100 bg-slate-50">
          <button
            onClick={onClose}
            className="text-xs px-3 py-1.5 text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
          >
            取消
          </button>
          <button
            onClick={handleSave}
            className="text-xs px-3 py-1.5 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
          >
            保存
          </button>
        </div>
      </div>
    </div>
  );
}
