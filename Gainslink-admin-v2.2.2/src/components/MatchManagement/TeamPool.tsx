import { Users, GripVertical } from 'lucide-react';

export interface TeamPoolItem {
  userId: string;
  userNickname: string;
  teamName?: string;
}

interface TeamPoolProps {
  teams: TeamPoolItem[];
}

export default function TeamPool({ teams }: TeamPoolProps) {
  return (
    <div className="bg-white border border-slate-200 rounded-xl p-4 h-full">
      <div className="flex items-center gap-2 text-sm font-medium text-slate-800 mb-3">
        <Users size={14} className="text-primary" />
        已审核队伍池
        <span className="ml-auto text-xs text-slate-400">{teams.length} 支</span>
      </div>

      {teams.length === 0 ? (
        <div className="text-xs text-slate-400 py-4 text-center">暂无已通过的队伍\n请先处理报名审核</div>
      ) : (
        <div className="space-y-2">
          {teams.map((team) => (
            <div
              key={team.userId}
              draggable
              onDragStart={(e) => {
                e.dataTransfer.setData('application/json', JSON.stringify(team));
                e.dataTransfer.effectAllowed = 'move';
              }}
              className="flex items-center gap-2 px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg cursor-grab active:cursor-grabbing hover:border-primary transition-colors"
            >
              <GripVertical size={14} className="text-slate-300" />
              <div className="flex-1 min-w-0">
                <div className="text-sm font-medium text-slate-700 truncate">
                  {team.teamName || team.userNickname}
                </div>
                {team.teamName && (
                  <div className="text-xs text-slate-400 truncate">{team.userNickname}</div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
