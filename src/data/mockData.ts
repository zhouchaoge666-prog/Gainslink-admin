export interface KpiSubValue {
  label: string;
  value: string;
  change?: string;
}

export interface KpiItem {
  label: string;
  value: string;
  subValues?: KpiSubValue[];
  change: string;
  changeValue: string;
  status: 'normal' | 'danger' | 'warning';
}

export const kpiData: KpiItem[] = [
  { label: '实时在线', value: '1,247', change: '+12%', changeValue: '+132', status: 'normal' as const },
  { label: '今日投注笔数', value: '3,856', change: '-5%', changeValue: '-203', status: 'normal' as const },
  {
    label: '今日投注流水',
    value: '128,450',
    subValues: [
      { label: 'Gainslink', value: '85,600', change: '+6%' },
      { label: 'Salvo', value: '42,850', change: '+12%' },
    ],
    change: '+8%',
    changeValue: '+9,200',
    status: 'normal' as const,
  },
  {
    label: '今日结算盈亏',
    value: '-5,230',
    subValues: [
      { label: 'Gainslink', value: '-3,100', change: '-15%' },
      { label: 'Salvo', value: '-2,130', change: '-24%' },
    ],
    change: '-18%',
    changeValue: '-1,200',
    status: 'danger' as const,
  },
  { label: '新增投注用户', value: '87', change: '+23%', changeValue: '+16', status: 'normal' as const },
  {
    label: '进行中赛事',
    value: '12',
    subValues: [
      { label: '开放竞猜', value: '8' },
      { label: '正在比赛', value: '4' },
    ],
    change: '-',
    changeValue: '',
    status: 'normal' as const,
  },
  {
    label: '竞猜胜利/失败人次',
    value: '',
    subValues: [
      { label: '胜利', value: '1,120' },
      { label: '失败', value: '400' },
    ],
    change: '+15%',
    changeValue: '+200',
    status: 'normal' as const,
  },
  {
    label: '今日投放积分',
    value: '8,500',
    subValues: [
      { label: 'Gainslink', value: '5,500' },
      { label: 'Salvo', value: '3,000' },
    ],
    change: '+35%',
    changeValue: '+2,200',
    status: 'normal' as const,
  },
];

export const hourlyTrend = [
  { hour: '00', online: 320, bets: 150 },
  { hour: '02', online: 210, bets: 80 },
  { hour: '04', online: 180, bets: 60 },
  { hour: '06', online: 250, bets: 110 },
  { hour: '08', online: 450, bets: 280 },
  { hour: '10', online: 680, bets: 420 },
  { hour: '12', online: 890, bets: 560 },
  { hour: '14', online: 1020, bets: 650 },
  { hour: '16', online: 1150, bets: 720 },
  { hour: '18', online: 1247, bets: 850 },
  { hour: '20', online: 1180, bets: 780 },
  { hour: '22', online: 950, bets: 620 },
];

export const heatmapData = [
  { time: '0-6点', intensity: 25 },
  { time: '6-12点', intensity: 45 },
  { time: '12-18点', intensity: 78 },
  { time: '18-24点', intensity: 92 },
];

export const userSegment = [
  { name: '鲸鱼用户', value: 25, color: '#3b82f6' },
  { name: '普通用户', value: 45, color: '#10b981' },
  { name: '低频用户', value: 20, color: '#f59e0b' },
  { name: '新用户', value: 10, color: '#8b5cf6' },
];

export const retentionTrend = [
  { day: 'D1', newUser: 45, oldUser: 62 },
  { day: 'D2', newUser: 38, oldUser: 58 },
  { day: 'D3', newUser: 32, oldUser: 55 },
  { day: 'D4', newUser: 28, oldUser: 53 },
  { day: 'D5', newUser: 25, oldUser: 51 },
  { day: 'D6', newUser: 22, oldUser: 50 },
  { day: 'D7', newUser: 18, oldUser: 48 },
];

export const gameCategory = [
  { game: 'MLBB', events: 45, bets: 68000 },
  { game: 'PUBG', events: 32, bets: 42000 },
  { game: 'eFootball', events: 28, bets: 18450 },
];

export const profitTrend = [
  { date: '周一', profit: 5200 },
  { date: '周二', profit: -1200 },
  { date: '周三', profit: 3500 },
  { date: '周四', profit: 4800 },
  { date: '周五', profit: -2300 },
  { date: '周六', profit: -5100 },
  { date: '周日', profit: 1800 },
];

export const betDistribution = [
  { result: 'A胜', pct: 58, color: '#3b82f6' },
  { result: '平局', pct: 15, color: '#f59e0b' },
  { result: 'B胜', pct: 27, color: '#ef4444' },
];

export const careFunnel = [
  { stage: '连输3场', count: 120 },
  { stage: '触发关怀', count: 118 },
  { stage: '领取奖励', count: 95 },
  { stage: '7日复投', count: 42 },
];

export const shareConversion = [
  { stage: '分享次数', count: 320 },
  { stage: '访问人数', count: 890 },
  { stage: '注册/登录', count: 56 },
  { stage: '完成投注', count: 23 },
];

export const riskAlerts = [
  { id: '#7712', type: '多账号关联', match: 'MLBB总决赛', amount: 50000, status: 'pending' as const },
  { id: '#9034', type: '短时间大额', match: 'PUBG小组赛', amount: 30000, status: 'pending' as const },
  { id: '#4451', type: '反向对冲', match: 'eFootball杯赛', amount: 20000, status: 'resolved' as const },
];

export const matchConcentration = [
  { match: 'MLBB半决赛', optionA: 92, optionB: 5, draw: 3, risk: 'high' as const },
  { match: 'PUBG决赛', optionA: 45, optionB: 40, draw: 15, risk: 'normal' as const },
  { match: 'eFootball小组赛', optionA: 60, optionB: 25, draw: 15, risk: 'normal' as const },
];

export const churnUsers = [
  { days: 7, count: 156, highValue: 23 },
  { days: 14, count: 89, highValue: 12 },
  { days: 30, count: 234, highValue: 45 },
];

export const recentMatches = [
  { name: 'MLBB总决赛·第3场', result: 'A胜', totalBets: 1250, totalAmount: 45600, profit: -8200, tag: '高盈亏' },
  { name: 'PUBG小组赛·B组', result: 'B胜', totalBets: 680, totalAmount: 23400, profit: 5600, tag: '热门' },
  { name: 'eFootball杯赛·8强', result: '平局', totalBets: 320, totalAmount: 12800, profit: 3200, tag: '冷门' },
];

// 实时趋势分析数据（24小时）
export const hourlyTrendNew = [
  { hour: '00', betUsers: 85, betCount: 210, betPointsGL: 8200, betPointsSV: 4100 },
  { hour: '02', betUsers: 42, betCount: 95, betPointsGL: 3600, betPointsSV: 1800 },
  { hour: '04', betUsers: 28, betCount: 62, betPointsGL: 2100, betPointsSV: 900 },
  { hour: '06', betUsers: 55, betCount: 130, betPointsGL: 4800, betPointsSV: 2400 },
  { hour: '08', betUsers: 180, betCount: 520, betPointsGL: 21000, betPointsSV: 9800 },
  { hour: '10', betUsers: 320, betCount: 890, betPointsGL: 38500, betPointsSV: 18200 },
  { hour: '12', betUsers: 480, betCount: 1250, betPointsGL: 52000, betPointsSV: 26800 },
  { hour: '14', betUsers: 620, betCount: 1680, betPointsGL: 72000, betPointsSV: 35800 },
  { hour: '16', betUsers: 750, betCount: 2100, betPointsGL: 92000, betPointsSV: 45200 },
  { hour: '18', betUsers: 890, betCount: 2450, betPointsGL: 110000, betPointsSV: 54800 },
  { hour: '20', betUsers: 820, betCount: 2280, betPointsGL: 102000, betPointsSV: 51000 },
  { hour: '22', betUsers: 560, betCount: 1580, betPointsGL: 68000, betPointsSV: 34200 },
];

// 赛事投注分布
export const gameBets = [
  { game: 'MLBB', betCount: 2150 },
  { game: 'PUBG', betCount: 980 },
  { game: 'eFootball', betCount: 420 },
];

// 核心数据看板 - 日数据（最近14天）
export const coreDailyData = [
  { date: '05-21', activeUsers: 980, betUsers: 620, betCount: 2100, betPointsGL: 85000, betPointsSV: 42000, settlePoints: 5200 },
  { date: '05-22', activeUsers: 1050, betUsers: 680, betCount: 2350, betPointsGL: 92000, betPointsSV: 45800, settlePoints: 3800 },
  { date: '05-23', activeUsers: 1120, betUsers: 750, betCount: 2680, betPointsGL: 105000, betPointsSV: 52000, settlePoints: -1200 },
  { date: '05-24', activeUsers: 1080, betUsers: 710, betCount: 2450, betPointsGL: 98000, betPointsSV: 48500, settlePoints: 2100 },
  { date: '05-25', activeUsers: 1250, betUsers: 890, betCount: 3200, betPointsGL: 128000, betPointsSV: 63500, settlePoints: -3500 },
  { date: '05-26', activeUsers: 1380, betUsers: 980, betCount: 3650, betPointsGL: 145000, betPointsSV: 72000, settlePoints: 4800 },
  { date: '05-27', activeUsers: 1150, betUsers: 780, betCount: 2780, betPointsGL: 108000, betPointsSV: 53500, settlePoints: -2100 },
  { date: '05-28', activeUsers: 1020, betUsers: 650, betCount: 2280, betPointsGL: 88000, betPointsSV: 43800, settlePoints: 3200 },
  { date: '05-29', activeUsers: 1180, betUsers: 820, betCount: 2950, betPointsGL: 115000, betPointsSV: 57000, settlePoints: 1500 },
  { date: '05-30', activeUsers: 1320, betUsers: 920, betCount: 3380, betPointsGL: 132000, betPointsSV: 65500, settlePoints: -2800 },
  { date: '05-31', activeUsers: 1280, betUsers: 880, betCount: 3180, betPointsGL: 125000, betPointsSV: 62000, settlePoints: 4200 },
  { date: '06-01', activeUsers: 1200, betUsers: 850, betCount: 3050, betPointsGL: 118000, betPointsSV: 58500, settlePoints: 1800 },
  { date: '06-02', activeUsers: 1350, betUsers: 960, betCount: 3520, betPointsGL: 138000, betPointsSV: 68500, settlePoints: -1500 },
  { date: '06-03', activeUsers: 1420, betUsers: 1020, betCount: 3850, betPointsGL: 152000, betPointsSV: 75500, settlePoints: 2600 },
];

// 核心数据看板 - 周数据（最近12周）
export const coreWeeklyData = [
  { date: 'W10', activeUsers: 6800, betUsers: 4200, betCount: 15800, betPointsGL: 520000, betPointsSV: 258000, settlePoints: 12000 },
  { date: 'W11', activeUsers: 7200, betUsers: 4600, betCount: 17200, betPointsGL: 580000, betPointsSV: 288000, settlePoints: 8500 },
  { date: 'W12', activeUsers: 6900, betUsers: 4300, betCount: 16100, betPointsGL: 540000, betPointsSV: 268000, settlePoints: -5200 },
  { date: 'W13', activeUsers: 7500, betUsers: 4900, betCount: 18500, betPointsGL: 620000, betPointsSV: 308000, settlePoints: 15200 },
  { date: 'W14', activeUsers: 7800, betUsers: 5200, betCount: 19800, betPointsGL: 680000, betPointsSV: 338000, settlePoints: 9800 },
  { date: 'W15', activeUsers: 8100, betUsers: 5500, betCount: 21200, betPointsGL: 720000, betPointsSV: 358000, settlePoints: -8200 },
  { date: 'W16', activeUsers: 7600, betUsers: 5000, betCount: 19200, betPointsGL: 660000, betPointsSV: 328000, settlePoints: 13500 },
  { date: 'W17', activeUsers: 8200, betUsers: 5600, betCount: 21800, betPointsGL: 750000, betPointsSV: 372000, settlePoints: 6200 },
  { date: 'W18', activeUsers: 8500, betUsers: 5900, betCount: 23200, betPointsGL: 800000, betPointsSV: 397000, settlePoints: -10500 },
  { date: 'W19', activeUsers: 8800, betUsers: 6200, betCount: 24800, betPointsGL: 850000, betPointsSV: 422000, settlePoints: 18200 },
  { date: 'W20', activeUsers: 9200, betUsers: 6600, betCount: 26800, betPointsGL: 920000, betPointsSV: 457000, settlePoints: 11200 },
  { date: 'W21', activeUsers: 9800, betUsers: 7200, betCount: 29800, betPointsGL: 1050000, betPointsSV: 521000, settlePoints: 8500 },
];

// 核心数据看板 - 月数据（最近12个月）
export const coreMonthlyData = [
  { date: '2025-07', activeUsers: 28000, betUsers: 18000, betCount: 68000, betPointsGL: 2200000, betPointsSV: 1090000, settlePoints: 45000 },
  { date: '2025-08', activeUsers: 30000, betUsers: 19500, betCount: 74000, betPointsGL: 2450000, betPointsSV: 1215000, settlePoints: -28000 },
  { date: '2025-09', activeUsers: 29000, betUsers: 18800, betCount: 71000, betPointsGL: 2350000, betPointsSV: 1165000, settlePoints: 38000 },
  { date: '2025-10', activeUsers: 32000, betUsers: 21000, betCount: 82000, betPointsGL: 2700000, betPointsSV: 1340000, settlePoints: 52000 },
  { date: '2025-11', activeUsers: 34000, betUsers: 22800, betCount: 89000, betPointsGL: 2950000, betPointsSV: 1465000, settlePoints: -35000 },
  { date: '2025-12', activeUsers: 36000, betUsers: 24500, betCount: 96000, betPointsGL: 3200000, betPointsSV: 1588000, settlePoints: 68000 },
  { date: '2026-01', activeUsers: 33000, betUsers: 22000, betCount: 85000, betPointsGL: 2800000, betPointsSV: 1390000, settlePoints: -42000 },
  { date: '2026-02', activeUsers: 35000, betUsers: 23500, betCount: 92000, betPointsGL: 3050000, betPointsSV: 1512000, settlePoints: 55000 },
  { date: '2026-03', activeUsers: 38000, betUsers: 26000, betCount: 102000, betPointsGL: 3400000, betPointsSV: 1685000, settlePoints: 72000 },
  { date: '2026-04', activeUsers: 40000, betUsers: 27800, betCount: 110000, betPointsGL: 3700000, betPointsSV: 1835000, settlePoints: -28000 },
  { date: '2026-05', activeUsers: 42000, betUsers: 29500, betCount: 118000, betPointsGL: 3980000, betPointsSV: 1972000, settlePoints: 85000 },
  { date: '2026-06', activeUsers: 45000, betUsers: 32000, betCount: 128000, betPointsGL: 4350000, betPointsSV: 2158000, settlePoints: 62000 },
];

// ============ 平台总览数据 ============

export const overviewKpiData = [
  { label: '本月赛事数', value: '128', change: '+15', changeType: 'up' as const, icon: 'trophy' },
  { label: '进行中赛事', value: '12', change: '+3', changeType: 'up' as const, icon: 'timer' },
  { label: '本月报名人数', value: '8,560', change: '+12%', changeType: 'up' as const, icon: 'users' },
  { label: '本月观看人次', value: '45,230', change: '+8%', changeType: 'up' as const, icon: 'eye' },
];

export const matchStatusData = [
  { name: '报名中', value: 42, color: '#10b981' },
  { name: '进行中', value: 12, color: '#3b82f6' },
  { name: '已结束', value: 68, color: '#64748b' },
  { name: '待发布', value: 15, color: '#f59e0b' },
  { name: '已取消', value: 3, color: '#ef4444' },
];

export const gameTypeData = [
  { game: 'MLBB', count: 45 },
  { game: 'Dota 2', count: 32 },
  { game: 'PUBG', count: 28 },
  { game: 'eFootball', count: 18 },
  { game: '其他', count: 5 },
];

export const signupTrendData = [
  { date: '05-21', signups: 320, views: 1800 },
  { date: '05-22', signups: 350, views: 2100 },
  { date: '05-23', signups: 410, views: 2500 },
  { date: '05-24', signups: 380, views: 2200 },
  { date: '05-25', signups: 520, views: 3100 },
  { date: '05-26', signups: 680, views: 4200 },
  { date: '05-27', signups: 590, views: 3500 },
  { date: '05-28', signups: 450, views: 2800 },
  { date: '05-29', signups: 610, views: 3800 },
  { date: '05-30', signups: 720, views: 4500 },
  { date: '05-31', signups: 650, views: 4100 },
  { date: '06-01', signups: 580, views: 3600 },
  { date: '06-02', signups: 780, views: 4900 },
  { date: '06-03', signups: 850, views: 5230 },
];

export const bracketTypeData = [
  { name: '小组赛+淘汰赛', value: 45, color: '#3b82f6' },
  { name: '单败淘汰', value: 25, color: '#10b981' },
  { name: '双败淘汰', value: 15, color: '#8b5cf6' },
  { name: '瑞士轮', value: 10, color: '#f59e0b' },
  { name: '循环赛', value: 5, color: '#ef4444' },
];

export interface RecentMatchOverview {
  id: number;
  name: string;
  game: string;
  bracket: string;
  deadline: string;
  signed: number;
  cap: number;
  status: 'open' | 'closing' | 'live' | 'full';
}

export const recentMatchesOverview: RecentMatchOverview[] = [
  { id: 1, name: 'MLBB 夏季赛 · 小组赛', game: 'MLBB', bracket: '小组+淘汰', deadline: '06-10', signed: 1250, cap: 2000, status: 'open' },
  { id: 2, name: 'Dota 2 精英杯', game: 'Dota 2', bracket: '双败淘汰', deadline: '06-08', signed: 680, cap: 800, status: 'closing' },
  { id: 3, name: 'PUBG 周末挑战赛', game: 'PUBG', bracket: '单败淘汰', deadline: '—', signed: 320, cap: 500, status: 'live' },
  { id: 4, name: 'eFootball 杯赛 · 8强', game: 'eFootball', bracket: '单败淘汰', deadline: '06-05', signed: 128, cap: 128, status: 'full' },
  { id: 5, name: 'MLBB 新秀赛', game: 'MLBB', bracket: '循环赛', deadline: '06-12', signed: 45, cap: 80, status: 'open' },
];

export const topMatches = [
  { name: 'MLBB 夏季赛 · 小组赛', game: 'MLBB', signed: 1250, trend: 'up' as const },
  { name: 'Dota 2 精英杯', game: 'Dota 2', signed: 680, trend: 'up' as const },
  { name: 'PUBG 周末挑战赛', game: 'PUBG', signed: 320, trend: 'down' as const },
  { name: 'eFootball 杯赛 · 8强', game: 'eFootball', signed: 128, trend: 'up' as const },
  { name: 'MLBB 新秀赛', game: 'MLBB', signed: 45, trend: 'up' as const },
];

export const pendingSignups = [
  { id: 'U-9921', user: 'PlayerOne', match: 'MLBB 夏季赛', time: '10分钟前' },
  { id: 'U-8823', user: 'ProGamer_X', match: 'Dota 2 精英杯', time: '25分钟前' },
  { id: 'U-7715', user: 'TeamAlpha', match: 'MLBB 夏季赛', time: '1小时前' },
];

// ============ 平台总览 v2 ============

export const overviewKpiDataV2 = [
  // 第一行：用户维度
  { label: '今日活跃用户', value: '1,247', change: '+5%', compareLabel: '较昨日', changeType: 'up' as const, status: 'normal' as const },
  { label: '总注册用户', value: '45,230', change: '+320', compareLabel: '较昨日', changeType: 'up' as const, status: 'normal' as const },
  { label: '今日新增用户', value: '87', change: '+12%', compareLabel: '较昨日', changeType: 'up' as const, status: 'normal' as const },
  { label: '七日用户回流数', value: '156', change: '+8%', compareLabel: '较上周', changeType: 'up' as const, status: 'normal' as const },
  // 第二行：业务维度
  { label: '报名用户/待审核', value: '320', pending: '20', pendingLabel: '待审核', pendingColor: 'danger' as const, change: '-8%', compareLabel: '较昨日', changeType: 'down' as const, status: 'warning' as const },
  { label: '总进行中的赛事/开放报名赛事', value: '12', pending: '8', pendingLabel: '开放报名', pendingColor: 'primary' as const, change: '+2', compareLabel: '较昨日', changeType: 'up' as const, status: 'normal' as const },
  { label: '积分签到人次', value: '1,850', change: '+15%', compareLabel: '较昨日', changeType: 'up' as const, status: 'normal' as const },
  { label: '被邀请注册成功人数', value: '42', change: '+8%', compareLabel: '较昨日', changeType: 'up' as const, status: 'normal' as const },
];

// 核心数据 - 日（最近14天）
export const coreDailyDataNew = [
  { date: '05-21', totalUsers: 42000, newUsers: 120, dau: 980, matchSignupUsers: 320, pointActivityUsers: 450, retention7d: 28, newMatches: 2, signups: 280, pointFlow: 5200, pointChangeUsers: 380, avgBetsPerUser: 1.8, activeRate: 42 },
  { date: '05-22', totalUsers: 42150, newUsers: 150, dau: 1050, matchSignupUsers: 350, pointActivityUsers: 480, retention7d: 29, newMatches: 3, signups: 320, pointFlow: 5800, pointChangeUsers: 420, avgBetsPerUser: 1.9, activeRate: 43 },
  { date: '05-23', totalUsers: 42300, newUsers: 180, dau: 1120, matchSignupUsers: 380, pointActivityUsers: 510, retention7d: 27, newMatches: 2, signups: 350, pointFlow: 6100, pointChangeUsers: 450, avgBetsPerUser: 2.0, activeRate: 44 },
  { date: '05-24', totalUsers: 42450, newUsers: 140, dau: 1080, matchSignupUsers: 340, pointActivityUsers: 470, retention7d: 28, newMatches: 4, signups: 310, pointFlow: 5400, pointChangeUsers: 400, avgBetsPerUser: 1.8, activeRate: 43 },
  { date: '05-25', totalUsers: 42650, newUsers: 220, dau: 1250, matchSignupUsers: 450, pointActivityUsers: 620, retention7d: 30, newMatches: 5, signups: 420, pointFlow: 7200, pointChangeUsers: 530, avgBetsPerUser: 2.1, activeRate: 45 },
  { date: '05-26', totalUsers: 42900, newUsers: 280, dau: 1380, matchSignupUsers: 520, pointActivityUsers: 720, retention7d: 31, newMatches: 3, signups: 480, pointFlow: 8600, pointChangeUsers: 610, avgBetsPerUser: 2.2, activeRate: 46 },
  { date: '05-27', totalUsers: 43100, newUsers: 190, dau: 1150, matchSignupUsers: 390, pointActivityUsers: 540, retention7d: 29, newMatches: 2, signups: 360, pointFlow: 6300, pointChangeUsers: 460, avgBetsPerUser: 2.0, activeRate: 44 },
  { date: '05-28', totalUsers: 43250, newUsers: 130, dau: 1020, matchSignupUsers: 310, pointActivityUsers: 440, retention7d: 28, newMatches: 3, signups: 290, pointFlow: 5100, pointChangeUsers: 370, avgBetsPerUser: 1.9, activeRate: 43 },
  { date: '05-29', totalUsers: 43450, newUsers: 210, dau: 1180, matchSignupUsers: 420, pointActivityUsers: 590, retention7d: 30, newMatches: 4, signups: 380, pointFlow: 6800, pointChangeUsers: 500, avgBetsPerUser: 2.0, activeRate: 45 },
  { date: '05-30', totalUsers: 43700, newUsers: 260, dau: 1320, matchSignupUsers: 500, pointActivityUsers: 710, retention7d: 31, newMatches: 5, signups: 450, pointFlow: 8200, pointChangeUsers: 590, avgBetsPerUser: 2.1, activeRate: 46 },
  { date: '05-31', totalUsers: 43900, newUsers: 200, dau: 1280, matchSignupUsers: 460, pointActivityUsers: 650, retention7d: 30, newMatches: 3, signups: 410, pointFlow: 7500, pointChangeUsers: 550, avgBetsPerUser: 2.0, activeRate: 45 },
  { date: '06-01', totalUsers: 44100, newUsers: 180, dau: 1200, matchSignupUsers: 380, pointActivityUsers: 560, retention7d: 29, newMatches: 4, signups: 350, pointFlow: 6400, pointChangeUsers: 470, avgBetsPerUser: 1.9, activeRate: 44 },
  { date: '06-02', totalUsers: 44350, newUsers: 240, dau: 1350, matchSignupUsers: 560, pointActivityUsers: 780, retention7d: 30, newMatches: 5, signups: 520, pointFlow: 9100, pointChangeUsers: 660, avgBetsPerUser: 2.2, activeRate: 46 },
  { date: '06-03', totalUsers: 44600, newUsers: 270, dau: 1420, matchSignupUsers: 620, pointActivityUsers: 850, retention7d: 32, newMatches: 3, signups: 580, pointFlow: 10200, pointChangeUsers: 720, avgBetsPerUser: 2.3, activeRate: 47 },
];

// 核心数据 - 周（最近12周）
export const coreWeeklyDataNew = [
  { date: 'W10', totalUsers: 32000, newUsers: 650, dau: 6800, matchSignupUsers: 2400, pointActivityUsers: 3200, retention7d: 26, newMatches: 12, signups: 2100, pointFlow: 38000, pointChangeUsers: 2800, avgBetsPerUser: 1.7, activeRate: 40 },
  { date: 'W11', totalUsers: 32800, newUsers: 780, dau: 7200, matchSignupUsers: 2800, pointActivityUsers: 3600, retention7d: 27, newMatches: 14, signups: 2450, pointFlow: 42000, pointChangeUsers: 3100, avgBetsPerUser: 1.8, activeRate: 41 },
  { date: 'W12', totalUsers: 33500, newUsers: 720, dau: 6900, matchSignupUsers: 2500, pointActivityUsers: 3300, retention7d: 26, newMatches: 11, signups: 2280, pointFlow: 39000, pointChangeUsers: 2900, avgBetsPerUser: 1.7, activeRate: 40 },
  { date: 'W13', totalUsers: 34400, newUsers: 900, dau: 7500, matchSignupUsers: 3100, pointActivityUsers: 4100, retention7d: 28, newMatches: 16, signups: 2800, pointFlow: 48000, pointChangeUsers: 3500, avgBetsPerUser: 1.9, activeRate: 42 },
  { date: 'W14', totalUsers: 35300, newUsers: 950, dau: 7800, matchSignupUsers: 3400, pointActivityUsers: 4500, retention7d: 29, newMatches: 18, signups: 3100, pointFlow: 52000, pointChangeUsers: 3800, avgBetsPerUser: 2.0, activeRate: 43 },
  { date: 'W15', totalUsers: 36200, newUsers: 920, dau: 8100, matchSignupUsers: 3200, pointActivityUsers: 4300, retention7d: 28, newMatches: 15, signups: 2950, pointFlow: 50000, pointChangeUsers: 3600, avgBetsPerUser: 1.9, activeRate: 42 },
  { date: 'W16', totalUsers: 37000, newUsers: 880, dau: 7600, matchSignupUsers: 2900, pointActivityUsers: 3900, retention7d: 27, newMatches: 13, signups: 2680, pointFlow: 45000, pointChangeUsers: 3300, avgBetsPerUser: 1.8, activeRate: 41 },
  { date: 'W17', totalUsers: 38000, newUsers: 1050, dau: 8200, matchSignupUsers: 3500, pointActivityUsers: 4700, retention7d: 29, newMatches: 17, signups: 3200, pointFlow: 55000, pointChangeUsers: 4000, avgBetsPerUser: 2.0, activeRate: 43 },
  { date: 'W18', totalUsers: 39100, newUsers: 1100, dau: 8500, matchSignupUsers: 3800, pointActivityUsers: 5100, retention7d: 30, newMatches: 19, signups: 3500, pointFlow: 60000, pointChangeUsers: 4300, avgBetsPerUser: 2.1, activeRate: 44 },
  { date: 'W19', totalUsers: 40200, newUsers: 1150, dau: 8800, matchSignupUsers: 4100, pointActivityUsers: 5400, retention7d: 30, newMatches: 20, signups: 3800, pointFlow: 64000, pointChangeUsers: 4600, avgBetsPerUser: 2.1, activeRate: 44 },
  { date: 'W20', totalUsers: 41400, newUsers: 1250, dau: 9200, matchSignupUsers: 4500, pointActivityUsers: 5900, retention7d: 31, newMatches: 22, signups: 4200, pointFlow: 72000, pointChangeUsers: 5100, avgBetsPerUser: 2.2, activeRate: 45 },
  { date: 'W21', totalUsers: 42800, newUsers: 1400, dau: 9800, matchSignupUsers: 5100, pointActivityUsers: 6800, retention7d: 32, newMatches: 25, signups: 4800, pointFlow: 82000, pointChangeUsers: 5900, avgBetsPerUser: 2.3, activeRate: 46 },
];

// 核心数据 - 月（最近12个月）
export const coreMonthlyDataNew = [
  { date: '2025-07', totalUsers: 15000, newUsers: 3200, dau: 28000, matchSignupUsers: 9800, pointActivityUsers: 12500, retention7d: 25, newMatches: 45, signups: 68000, pointFlow: 1200000, pointChangeUsers: 9000, avgBetsPerUser: 1.5, activeRate: 38 },
  { date: '2025-08', totalUsers: 18500, newUsers: 3500, dau: 30000, matchSignupUsers: 11200, pointActivityUsers: 14800, retention7d: 26, newMatches: 52, signups: 74000, pointFlow: 1450000, pointChangeUsers: 10800, avgBetsPerUser: 1.6, activeRate: 39 },
  { date: '2025-09', totalUsers: 21500, newUsers: 3300, dau: 29000, matchSignupUsers: 10500, pointActivityUsers: 13800, retention7d: 25, newMatches: 48, signups: 71000, pointFlow: 1320000, pointChangeUsers: 10000, avgBetsPerUser: 1.5, activeRate: 38 },
  { date: '2025-10', totalUsers: 25000, newUsers: 3800, dau: 32000, matchSignupUsers: 12800, pointActivityUsers: 17200, retention7d: 27, newMatches: 58, signups: 82000, pointFlow: 1680000, pointChangeUsers: 12400, avgBetsPerUser: 1.7, activeRate: 40 },
  { date: '2025-11', totalUsers: 28500, newUsers: 4100, dau: 34000, matchSignupUsers: 14500, pointActivityUsers: 19800, retention7d: 28, newMatches: 62, signups: 89000, pointFlow: 1920000, pointChangeUsers: 14200, avgBetsPerUser: 1.8, activeRate: 41 },
  { date: '2025-12', totalUsers: 32000, newUsers: 4500, dau: 36000, matchSignupUsers: 16200, pointActivityUsers: 22500, retention7d: 29, newMatches: 70, signups: 96000, pointFlow: 2200000, pointChangeUsers: 16200, avgBetsPerUser: 1.9, activeRate: 42 },
  { date: '2026-01', totalUsers: 34800, newUsers: 3800, dau: 33000, matchSignupUsers: 13800, pointActivityUsers: 18800, retention7d: 27, newMatches: 55, signups: 85000, pointFlow: 1780000, pointChangeUsers: 13200, avgBetsPerUser: 1.7, activeRate: 40 },
  { date: '2026-02', totalUsers: 37500, newUsers: 4200, dau: 35000, matchSignupUsers: 15800, pointActivityUsers: 21200, retention7d: 28, newMatches: 60, signups: 92000, pointFlow: 2050000, pointChangeUsers: 15100, avgBetsPerUser: 1.8, activeRate: 41 },
  { date: '2026-03', totalUsers: 40600, newUsers: 4600, dau: 38000, matchSignupUsers: 18200, pointActivityUsers: 24800, retention7d: 30, newMatches: 68, signups: 102000, pointFlow: 2420000, pointChangeUsers: 17800, avgBetsPerUser: 1.9, activeRate: 43 },
  { date: '2026-04', totalUsers: 43500, newUsers: 4900, dau: 40000, matchSignupUsers: 20500, pointActivityUsers: 27800, retention7d: 31, newMatches: 75, signups: 110000, pointFlow: 2750000, pointChangeUsers: 20100, avgBetsPerUser: 2.0, activeRate: 44 },
  { date: '2026-05', totalUsers: 46800, newUsers: 5200, dau: 42000, matchSignupUsers: 22800, pointActivityUsers: 31200, retention7d: 31, newMatches: 80, signups: 118000, pointFlow: 3100000, pointChangeUsers: 22600, avgBetsPerUser: 2.1, activeRate: 45 },
  { date: '2026-06', totalUsers: 50200, newUsers: 5600, dau: 45000, matchSignupUsers: 25800, pointActivityUsers: 35200, retention7d: 32, newMatches: 88, signups: 128000, pointFlow: 3520000, pointChangeUsers: 25600, avgBetsPerUser: 2.2, activeRate: 46 },
];

// 周留存数据
export const weeklyRetentionData = [
  { week: 'W10', d1: 45, d3: 38, d7: 28, d14: 22, d30: 15 },
  { week: 'W11', d1: 46, d3: 39, d7: 29, d14: 23, d30: 16 },
  { week: 'W12', d1: 44, d3: 37, d7: 27, d14: 21, d30: 14 },
  { week: 'W13', d1: 47, d3: 40, d7: 30, d14: 24, d30: 17 },
  { week: 'W14', d1: 48, d3: 41, d7: 31, d14: 25, d30: 18 },
  { week: 'W15', d1: 47, d3: 40, d7: 29, d14: 23, d30: 16 },
  { week: 'W16', d1: 46, d3: 39, d7: 28, d14: 22, d30: 15 },
  { week: 'W17', d1: 49, d3: 42, d7: 31, d14: 25, d30: 18 },
  { week: 'W18', d1: 49, d3: 42, d7: 31, d14: 25, d30: 18 },
  { week: 'W19', d1: 48, d3: 41, d7: 30, d14: 24, d30: 17 },
  { week: 'W20', d1: 50, d3: 43, d7: 32, d14: 26, d30: 19 },
  { week: 'W21', d1: 50, d3: 43, d7: 32, d14: 26, d30: 19 },
];

// 用户积分分布
export const userPointDistribution = [
  { range: '0-100', count: 12500, pct: 28 },
  { range: '100-500', count: 9800, pct: 22 },
  { range: '500-1000', count: 7200, pct: 16 },
  { range: '1000-5000', count: 8900, pct: 20 },
  { range: '5000+', count: 6200, pct: 14 },
];

// 参与不同赛事的用户分布
export const matchUserDistribution = [
  { game: 'MLBB', users: 18500, pct: 41 },
  { game: 'Dota 2', users: 10200, pct: 23 },
  { game: 'PUBG', users: 7800, pct: 17 },
  { game: 'eFootball', users: 5200, pct: 12 },
  { game: '其他', users: 3100, pct: 7 },
];

// 用户国家分布
export const userCountryDistribution = [
  { country: '中国', users: 15800, pct: 35 },
  { country: '菲律宾', users: 11200, pct: 25 },
  { country: '印尼', users: 8900, pct: 20 },
  { country: '越南', users: 5400, pct: 12 },
  { country: '马来西亚', users: 2300, pct: 5 },
  { country: '其他', users: 1600, pct: 3 },
];

// 用户游戏偏好
export const userGamePref = [
  { name: 'MLBB', value: 42, color: '#3b82f6' },
  { name: 'Dota 2', value: 23, color: '#8b5cf6' },
  { name: 'PUBG', value: 18, color: '#10b981' },
  { name: 'eFootball', value: 12, color: '#f59e0b' },
  { name: '多游戏', value: 5, color: '#64748b' },
];

// 用户来源
export const userSourceData = [
  { name: '自然流量', value: 72, color: '#3b82f6' },
  { name: '邀请注册', value: 28, color: '#10b981' },
];

// ============ 赛事列表 ============
export interface MatchItem {
  id: string;
  name: string;
  game: string;
  bracket: string;
  signupStart: string;
  signupEnd: string;
  matchStart: string;
  matchEnd: string;
  signed: number;
  cap: number;
  status: 'draft' | 'open' | 'closing' | 'live' | 'ended' | 'cancelled';
  // 来源与审核（机构授权用户提交的赛事需要审核）
  source: 'admin' | 'user';
  approvalStatus?: 'pending_review' | 'approved' | 'rejected';
  rejectionReason?: string;
  // 扩展字段
  organizerId: string;
  organizerName: string;
  organizerLogo?: string;
  description: string;
  rules: string;
  prize: string;
  coverImage?: string;
  auditRequired: boolean;
  pendingAudit: number;
  approved: number;
  rejected: number;
  pointsPool: number;
  prizeAmount?: string;
  entryFee: number;
  location: string;
  tags: string[];
  createdAt: string;
  maxTeams: number;
  stageCount?: number;
  stages?: TournamentStage[];
}

export type StageType = 'ROUND_ROBIN' | 'SINGLE_ELIMINATION' | 'DOUBLE_ELIMINATION' | 'SWISS' | 'FREE';
export type StageFormat = StageType;

export type EntrantSourceType = 'MANUAL' | 'REGISTRATION' | 'FROM_PREVIOUS_STAGE';
export type SeedingPolicyType = 'MANUAL' | 'RANDOM' | 'REGISTRATION_ORDER' | 'RATING_DESC' | 'PREVIOUS_STAGE_RANK';
export type AssignmentMode = 'MANUAL' | 'RANDOM' | 'BY_SEED_SNAKE' | 'BY_SEED_BALANCED';
export type TieBreakerPolicy = 'NONE' | 'EXTRA_GAME' | 'MANUAL_DECISION' | 'SEED_ADVANTAGE';
export type RankingRule =
  | 'MATCH_POINTS'
  | 'MATCH_WINS'
  | 'MATCH_DRAWS'
  | 'MATCH_WIN_RATE'
  | 'GAME_DIFFERENCE'
  | 'GAME_WINS'
  | 'GAME_WIN_RATE'
  | 'HEAD_TO_HEAD'
  | 'STRENGTH_OF_SCHEDULE'
  | 'BUCHHOLZ'
  | 'SEED'
  | 'TIEBREAKER_MATCH'
  | 'MANUAL_DECISION';
export type UnresolvedTiePolicy = 'USE_SEED' | 'TIEBREAKER_MATCH' | 'MANUAL_DECISION';
export type AdvancementType = 'NONE' | 'TOP_N_PER_GROUP' | 'GLOBAL_TOP_N' | 'GROUP_RANK_MAPPING';
export type NextStageSeedingPolicy = 'PREVIOUS_STAGE_RANK' | 'GROUP_CROSS' | 'SNAKE_BY_RANK' | 'MANUAL';
export type RoundRobinMode = 'SINGLE' | 'DOUBLE';
export type SwissRound1Pairing = 'RANDOM' | 'SEED_HIGH_LOW' | 'SEED_ADJACENT';
export type SwissByePolicy = 'LOWEST_SCORE_NO_PREVIOUS_BYE' | 'RANDOM_NO_PREVIOUS_BYE';
export type EliminationPlacementSortBy =
  | 'ELIMINATION_ROUND_THEN_SEED'
  | 'ELIMINATION_ROUND_THEN_GAME_DIFF'
  | 'THIRD_PLACE_MATCH'
  | 'MANUAL_DECISION';

export interface EntrantConfig {
  entrantCount: number;
  source: { type: Extract<EntrantSourceType, 'MANUAL'> }
    | { type: Extract<EntrantSourceType, 'REGISTRATION'> }
    | { type: Extract<EntrantSourceType, 'FROM_PREVIOUS_STAGE'>; previousStageId: string };
  seedingPolicy: {
    type: SeedingPolicyType;
    allowManualOverride: boolean;
  };
}

export interface GroupConfig {
  enabled: boolean;
  groupCount: number;
  teamsPerGroup: number;
  allowUnevenGroups: boolean;
  assignmentMode: AssignmentMode;
  avoidSameOrg?: boolean;
  allowManualAdjust: boolean;
}

export interface MatchConfig {
  defaultBestOf: 1 | 2 | 3 | 5 | 7;
  allowDraw: boolean;
  tieBreakerPolicy?: TieBreakerPolicy;
  mapScoreEnabled: boolean;
  forfeitEnabled: boolean;
}

export interface ScoringConfig {
  winPoints: number;
  drawPoints: number;
  lossPoints: number;
  forfeitWinPoints: number;
  forfeitLossPoints: number;
}

export interface RankingConfig {
  rules: RankingRule[];
  unresolvedTiePolicy: UnresolvedTiePolicy;
}

export interface AdvancementConfig {
  type: AdvancementType;
  nextStageId?: string;
  countPerGroup?: number;
  totalCount?: number;
  mappings?: Array<{ fromGroupCode: string; fromRank: number; toSeed: number }>;
  nextStageSeedingPolicy: NextStageSeedingPolicy;
}

export interface FormatRules {
  roundRobin?: {
    format: 'ROUND_ROBIN';
    mode: RoundRobinMode;
  };
  swiss?: {
    format: 'SWISS';
    rounds: number;
    round1Pairing: SwissRound1Pairing;
    avoidRepeatOpponent: boolean;
    byePolicy: SwissByePolicy;
  };
  singleElimination?: {
    format: 'SINGLE_ELIMINATION';
    bracketSizePolicy: 'NEXT_POWER_OF_TWO';
    thirdPlaceMatch: boolean;
    placementRankingPolicy: {
      sortBy: EliminationPlacementSortBy;
    };
  };
  doubleElimination?: {
    format: 'DOUBLE_ELIMINATION';
    bracketSizePolicy: 'NEXT_POWER_OF_TWO';
    grandFinalBestOf: 3 | 5 | 7;
    grandFinalReset: boolean;
    placementRankingPolicy: {
      sortBy: EliminationPlacementSortBy;
    };
  };
}

export interface ManualAdjustConfig {
  allowTeamMoveBeforeStart: boolean;
  allowReseedBeforeStart: boolean;
  allowScoreEditAfterSubmit: boolean;
}

export interface TournamentStage {
  stageId: string;
  name: string;
  order: number;
  type: StageFormat;

  // 规则说明书统一结构
  entrant: EntrantConfig;
  group: GroupConfig;
  match: MatchConfig;
  scoring?: ScoringConfig;
  ranking: RankingConfig;
  advancement?: AdvancementConfig[];
  formatRules: FormatRules;
  manualAdjust: ManualAdjustConfig;

  // 兼容旧生成器使用的字段（由新结构自动同步）
  teamsIn: number;
  teamsOut: number;
  defaultFormat: 'BO1' | 'BO2' | 'BO3' | 'BO5';
  config: {
    groupCount?: number;
    teamsPerGroup?: number;
    rounds?: number;
    cycleMode?: 'single' | 'double';
    qualifierPerGroup?: number;
    bracketSize?: number;
    thirdPlaceMatch?: boolean;
    swissRounds?: number;
    winThreshold?: number;
    winPoints?: number;
    drawPoints?: number;
    lossPoints?: number;
  };
}

export const MAX_TEAMS_PER_GROUP = 32;

export const MAX_TEAMS_LIMIT = 256;

const DEFAULT_SCORING: ScoringConfig = {
  winPoints: 1,
  drawPoints: 0,
  lossPoints: 0,
  forfeitWinPoints: 1,
  forfeitLossPoints: 0,
};

const DEFAULT_MANUAL_ADJUST: ManualAdjustConfig = {
  allowTeamMoveBeforeStart: true,
  allowReseedBeforeStart: true,
  allowScoreEditAfterSubmit: true,
};

function defaultRankingForFormat(format: StageFormat): RankingConfig {
  if (format === 'ROUND_ROBIN') {
    return { rules: ['MATCH_POINTS', 'MATCH_WINS', 'GAME_DIFFERENCE', 'GAME_WINS', 'HEAD_TO_HEAD', 'SEED'], unresolvedTiePolicy: 'USE_SEED' };
  }
  if (format === 'SWISS') {
    return { rules: ['MATCH_POINTS', 'MATCH_WINS', 'BUCHHOLZ', 'GAME_DIFFERENCE', 'GAME_WINS', 'HEAD_TO_HEAD', 'SEED'], unresolvedTiePolicy: 'USE_SEED' };
  }
  if (format === 'FREE') {
    return { rules: ['SEED'], unresolvedTiePolicy: 'USE_SEED' };
  }
  return { rules: ['SEED'], unresolvedTiePolicy: 'USE_SEED' };
}

export function createDefaultStage(
  order: number,
  maxTeams: number,
  previousStageId?: string
): TournamentStage {
  const clampedMaxTeams = Math.min(Math.max(1, maxTeams), MAX_TEAMS_LIMIT);
  const stageId = `ST-${Math.random().toString(36).slice(2, 8)}`;
  const isFirst = order === 1;
  const type: StageFormat = 'SINGLE_ELIMINATION';
  const groupCount = 1;
  const teamsPerGroup = clampedMaxTeams;
  const bracketSize = Math.max(2, Math.pow(2, Math.ceil(Math.log2(Math.min(MAX_TEAMS_PER_GROUP, teamsPerGroup)))));

  const stage: TournamentStage = {
    stageId,
    name: `第${order}赛段`,
    order,
    type,
    entrant: {
      entrantCount: clampedMaxTeams,
      source: isFirst
        ? { type: 'REGISTRATION' }
        : { type: 'FROM_PREVIOUS_STAGE', previousStageId: previousStageId || '' },
      seedingPolicy: { type: isFirst ? 'REGISTRATION_ORDER' : 'PREVIOUS_STAGE_RANK', allowManualOverride: true },
    },
    group: {
      enabled: false,
      groupCount,
      teamsPerGroup,
      allowUnevenGroups: false,
      assignmentMode: 'BY_SEED_SNAKE',
      allowManualAdjust: true,
    },
    match: {
      defaultBestOf: 3,
      allowDraw: false,
      tieBreakerPolicy: 'NONE',
      mapScoreEnabled: true,
      forfeitEnabled: true,
    },
    scoring: type === 'SINGLE_ELIMINATION' || type === 'DOUBLE_ELIMINATION' ? undefined : { ...DEFAULT_SCORING },
    ranking: defaultRankingForFormat(type),
    advancement: undefined,
    formatRules: {
      singleElimination: {
        format: 'SINGLE_ELIMINATION',
        bracketSizePolicy: 'NEXT_POWER_OF_TWO',
        thirdPlaceMatch: false,
        placementRankingPolicy: { sortBy: 'ELIMINATION_ROUND_THEN_SEED' },
      },
    },
    manualAdjust: { ...DEFAULT_MANUAL_ADJUST },
    teamsIn: clampedMaxTeams,
    teamsOut: 1,
    defaultFormat: 'BO3',
    config: {
      groupCount,
      teamsPerGroup,
      bracketSize,
      thirdPlaceMatch: false,
      winPoints: 1,
      drawPoints: 0,
      lossPoints: 0,
    },
  };

  return syncLegacyStageFields(stage);
}

export function syncLegacyStageFields(stage: TournamentStage): TournamentStage {
  const entrantCount = stage.entrant.entrantCount;
  const groupCount = stage.group.enabled ? stage.group.groupCount : 1;
  const teamsPerGroup = stage.group.enabled
    ? stage.group.teamsPerGroup
    : entrantCount;
  const primaryRoute = stage.advancement?.[0];
  const qualifierPerGroup = primaryRoute?.type === 'TOP_N_PER_GROUP'
    ? primaryRoute.countPerGroup
    : primaryRoute?.type === 'GLOBAL_TOP_N'
    ? Math.ceil((primaryRoute.totalCount || 0) / groupCount)
    : 1;
  const totalAdvance = (stage.advancement || []).reduce((sum, route) => {
    if (route.type === 'TOP_N_PER_GROUP') return sum + groupCount * (route.countPerGroup || 0);
    if (route.type === 'GLOBAL_TOP_N') return sum + (route.totalCount || 0);
    return sum;
  }, 0) || 1;

  let bracketSize = teamsPerGroup;
  if (stage.type === 'SINGLE_ELIMINATION' || stage.type === 'DOUBLE_ELIMINATION') {
    bracketSize = Math.max(2, Math.pow(2, Math.ceil(Math.log2(Math.min(MAX_TEAMS_PER_GROUP, teamsPerGroup)))));
  }

  const formatNum = stage.match.defaultBestOf;
  const defaultFormat: TournamentStage['defaultFormat'] =
    formatNum === 1 ? 'BO1' : formatNum === 2 ? 'BO2' : formatNum === 3 ? 'BO3' : formatNum === 5 ? 'BO5' : 'BO3';

  const legacyConfig: TournamentStage['config'] = {
    groupCount,
    teamsPerGroup,
    qualifierPerGroup,
    bracketSize,
    thirdPlaceMatch: stage.formatRules.singleElimination?.thirdPlaceMatch ?? false,
    swissRounds: stage.formatRules.swiss?.rounds,
    winThreshold: stage.formatRules.swiss?.rounds,
    cycleMode: stage.formatRules.roundRobin?.mode?.toLowerCase() as 'single' | 'double',
    winPoints: stage.scoring?.winPoints ?? 3,
    drawPoints: stage.scoring?.drawPoints ?? 1,
    lossPoints: stage.scoring?.lossPoints ?? 0,
  };

  return {
    ...stage,
    teamsIn: entrantCount,
    teamsOut: totalAdvance || 1,
    defaultFormat,
    config: legacyConfig,
  };
}

export function defaultAdvancementForStage(
  stage: TournamentStage,
  isLast: boolean,
  nextStageId?: string,
  nextStageEntrantCount?: number
): AdvancementConfig[] {
  if (isLast) return [];
  const target = nextStageEntrantCount && nextStageEntrantCount > 0 ? nextStageEntrantCount : undefined;
  const groupCount = stage.group.enabled ? stage.group.groupCount : 1;

  if (stage.type === 'ROUND_ROBIN') {
    const countPerGroup = target
      ? Math.min(stage.group.teamsPerGroup, Math.max(1, Math.ceil(target / groupCount)))
      : Math.min(2, stage.group.teamsPerGroup);
    return [{ type: 'TOP_N_PER_GROUP', nextStageId, countPerGroup, nextStageSeedingPolicy: 'PREVIOUS_STAGE_RANK' }];
  }
  if (stage.type === 'SWISS') {
    return [{
      type: 'GLOBAL_TOP_N',
      nextStageId,
      totalCount: target || Math.max(2, Math.floor(stage.entrant.entrantCount / 2)),
      nextStageSeedingPolicy: 'PREVIOUS_STAGE_RANK',
    }];
  }
  const countPerGroup = target
    ? Math.max(1, Math.ceil(target / groupCount))
    : stage.group.enabled ? 1 : Math.max(1, stage.entrant.entrantCount);
  return [{ type: 'TOP_N_PER_GROUP', nextStageId, countPerGroup, nextStageSeedingPolicy: 'PREVIOUS_STAGE_RANK' }];
}

export function formatRulesForType(type: StageFormat, partial?: Partial<FormatRules>): FormatRules {
  if (type === 'FREE') {
    return {};
  }
  if (type === 'ROUND_ROBIN') {
    return {
      roundRobin: {
        format: 'ROUND_ROBIN',
        mode: partial?.roundRobin?.mode ?? 'SINGLE',
      },
    };
  }
  if (type === 'SWISS') {
    return {
      swiss: {
        format: 'SWISS',
        rounds: partial?.swiss?.rounds ?? 3,
        round1Pairing: partial?.swiss?.round1Pairing ?? 'SEED_HIGH_LOW',
        avoidRepeatOpponent: partial?.swiss?.avoidRepeatOpponent ?? true,
        byePolicy: partial?.swiss?.byePolicy ?? 'LOWEST_SCORE_NO_PREVIOUS_BYE',
      },
    };
  }
  if (type === 'SINGLE_ELIMINATION') {
    return {
      singleElimination: {
        format: 'SINGLE_ELIMINATION',
        bracketSizePolicy: 'NEXT_POWER_OF_TWO',
        thirdPlaceMatch: partial?.singleElimination?.thirdPlaceMatch ?? false,
        placementRankingPolicy: {
          sortBy: partial?.singleElimination?.placementRankingPolicy?.sortBy ?? 'ELIMINATION_ROUND_THEN_SEED',
        },
      },
    };
  }
  return {
    doubleElimination: {
      format: 'DOUBLE_ELIMINATION',
      bracketSizePolicy: 'NEXT_POWER_OF_TWO',
      grandFinalBestOf: partial?.doubleElimination?.grandFinalBestOf ?? 5,
      grandFinalReset: partial?.doubleElimination?.grandFinalReset ?? false,
      placementRankingPolicy: {
        sortBy: partial?.doubleElimination?.placementRankingPolicy?.sortBy ?? 'ELIMINATION_ROUND_THEN_SEED',
      },
    },
  };
}

// 机构用户提交的待审核赛事（模拟数据）
export const pendingReviewMatches: MatchItem[] = [
  {
    id: '#UR001',
    name: 'Manila Gaming 周末杯',
    game: 'MLBB',
    bracket: '单败淘汰',
    signupStart: '2026-07-01',
    signupEnd: '2026-07-05',
    matchStart: '2026-07-06',
    matchEnd: '2026-07-07',
    signed: 0,
    cap: 16,
    status: 'draft',
    source: 'user',
    approvalStatus: 'pending_review',
    organizerId: 'O-006',
    organizerName: 'Manila Gaming',
    description: 'Manila Gaming 主办的周末 MLBB 社区邀请赛',
    rules: 'BO3 单败淘汰，共 16 队',
    prize: '奖金池 PHP 5,000',
    prizeAmount: 'PHP 5,000',
    auditRequired: false,
    pendingAudit: 0,
    approved: 0,
    rejected: 0,
    pointsPool: 500,
    entryFee: 0,
    location: '线上',
    tags: ['MLBB', '社区赛'],
    createdAt: '2026-06-27',
    maxTeams: 16,
  },
  {
    id: '#UR002',
    name: '高校电竞联盟 Dota 2 秋季赛',
    game: 'Dota 2',
    bracket: '循环赛+淘汰',
    signupStart: '2026-07-10',
    signupEnd: '2026-07-15',
    matchStart: '2026-07-20',
    matchEnd: '2026-07-28',
    signed: 0,
    cap: 8,
    status: 'draft',
    source: 'user',
    approvalStatus: 'pending_review',
    organizerId: 'O-005',
    organizerName: '高校电竞联盟',
    description: '面向高校战队的 Dota 2 秋季联赛',
    rules: '小组循环赛+单败淘汰，8 队参赛',
    prize: '奖杯 + 积分',
    auditRequired: false,
    pendingAudit: 0,
    approved: 0,
    rejected: 0,
    pointsPool: 1000,
    entryFee: 0,
    location: '线上',
    tags: ['Dota2', '高校'],
    createdAt: '2026-06-28',
    maxTeams: 8,
  },
  {
    id: '#UR003',
    name: 'Mars Esports PUBG 月赛',
    game: 'PUBG',
    bracket: '单败淘汰',
    signupStart: '2026-07-08',
    signupEnd: '2026-07-12',
    matchStart: '2026-07-13',
    matchEnd: '2026-07-14',
    signed: 0,
    cap: 32,
    status: 'draft',
    source: 'user',
    approvalStatus: 'pending_review',
    organizerId: 'O-002',
    organizerName: 'Mars Esports',
    description: 'Mars Esports 月度 PUBG 精英挑战赛',
    rules: 'BO1 单败淘汰，32 队',
    prize: 'USD 2,000',
    prizeAmount: 'USD 2,000',
    auditRequired: false,
    pendingAudit: 0,
    approved: 0,
    rejected: 0,
    pointsPool: 2000,
    entryFee: 0,
    location: '线上',
    tags: ['PUBG', '月赛'],
    createdAt: '2026-06-28',
    maxTeams: 32,
  },
  {
    id: '#UR004',
    name: 'Sunrise Cup eFootball 邀请赛',
    game: 'eFootball',
    bracket: '双循环',
    signupStart: '2026-07-05',
    signupEnd: '2026-07-08',
    matchStart: '2026-07-10',
    matchEnd: '2026-07-12',
    signed: 0,
    cap: 12,
    status: 'draft',
    source: 'user',
    approvalStatus: 'pending_review',
    organizerId: 'O-007',
    organizerName: 'Sunrise Gaming',
    description: 'Sunrise Gaming 主办的 eFootball 邀请制社区赛，面向东南亚职业及半职业战队',
    rules: '双循环小组赛，前 4 晋级淘汰，共 12 队',
    prize: 'MYR 3,000',
    prizeAmount: 'MYR 3,000',
    auditRequired: false,
    pendingAudit: 0,
    approved: 0,
    rejected: 0,
    pointsPool: 1200,
    entryFee: 0,
    location: '吉隆坡（线下）',
    tags: ['eFootball', '邀请赛'],
    createdAt: '2026-06-27',
    maxTeams: 12,
  },
  {
    id: '#UR005',
    name: 'SEA Championship Qualifier — MLBB',
    game: 'MLBB',
    bracket: '双败淘汰',
    signupStart: '2026-07-15',
    signupEnd: '2026-07-20',
    matchStart: '2026-07-22',
    matchEnd: '2026-07-27',
    signed: 3,
    cap: 16,
    status: 'draft',
    source: 'user',
    approvalStatus: 'pending_review',
    organizerId: 'O-008',
    organizerName: 'SEA Esports Federation',
    description: 'SEA 电竞联合会举办的 MLBB 锦标赛资格赛，胜者直通 SEA Championship 正赛',
    rules: 'BO3 双败淘汰，总决赛 BO5，共 16 支战队',
    prize: 'USD 5,000 + SEA Championship 席位',
    prizeAmount: 'USD 5,000',
    auditRequired: true,
    pendingAudit: 3,
    approved: 0,
    rejected: 0,
    pointsPool: 5000,
    entryFee: 50,
    location: '新加坡（线下+线上）',
    tags: ['MLBB', '资格赛', '国际赛'],
    createdAt: '2026-06-26',
    maxTeams: 16,
  },
  {
    id: '#UR006',
    name: 'Dota 2 学生联赛 第三赛季',
    game: 'Dota 2',
    bracket: '循环赛',
    signupStart: '2026-08-01',
    signupEnd: '2026-08-05',
    matchStart: '2026-08-10',
    matchEnd: '2026-08-31',
    signed: 0,
    cap: 10,
    status: 'draft',
    source: 'user',
    approvalStatus: 'pending_review',
    organizerId: 'O-005',
    organizerName: '高校电竞联盟',
    description: '高校电竞联盟第三赛季 Dota 2 学生联赛，面向在校大学生战队',
    rules: '单循环积分赛，最终积分前 2 获冠亚军，共 10 队',
    prize: '证书 + 奖杯 + 积分奖励',
    auditRequired: false,
    pendingAudit: 0,
    approved: 0,
    rejected: 0,
    pointsPool: 800,
    entryFee: 0,
    location: '线上',
    tags: ['Dota2', '高校', '联赛'],
    createdAt: '2026-06-28',
    maxTeams: 10,
  },
];

export const matchListData: MatchItem[] = [];

// ============ 战队数据 ============
export interface TeamMember {
  userId: string;
  nickname: string;
  role: 'captain' | 'member' | 'substitute';
  joinedAt: string;
}

export interface TeamChangeLog {
  id: string;
  date: string;
  action: '加入战队' | '离开战队' | '变更队长' | '战队名称变更' | '参赛报名' | '资格取消';
  target: string;   // 操作对象（昵称或旧名称）
  operator: string; // 操作人
  remark?: string;
}

export interface TeamItem {
  teamName: string;
  captainId: string;
  captainNickname: string;
  country: string;
  createdAt: string;
  members: TeamMember[];
  changeLog: TeamChangeLog[];
  matchHistory: { matchName: string; result: '晋级' | '淘汰' | '进行中'; stage: string }[];
}

// 根据队伍名查战队（mock 数据，真实场景应由 API 返回）
const teamDatabase: TeamItem[] = [
  {
    teamName: 'Team Alpha',
    captainId: 'U-7715',
    captainNickname: 'TeamAlpha',
    country: '中国',
    createdAt: '2026-03-10',
    members: [
      { userId: 'U-7715', nickname: 'TeamAlpha', role: 'captain', joinedAt: '2026-03-10' },
      { userId: 'U-9921', nickname: 'PlayerOne', role: 'member', joinedAt: '2026-03-10' },
      { userId: 'U-8823', nickname: 'ProGamer_X', role: 'member', joinedAt: '2026-03-15' },
      { userId: 'U-5043', nickname: 'IceQueen', role: 'member', joinedAt: '2026-04-01' },
      { userId: 'U-2210', nickname: 'DragonSlayer', role: 'substitute', joinedAt: '2026-04-20' },
    ],
    changeLog: [
      { id: 'CL-001', date: '2026-04-20', action: '加入战队', target: 'DragonSlayer', operator: 'TeamAlpha', remark: '替补成员' },
      { id: 'CL-002', date: '2026-04-01', action: '加入战队', target: 'IceQueen', operator: 'TeamAlpha' },
      { id: 'CL-003', date: '2026-03-28', action: '离开战队', target: 'OldPlayer99', operator: 'TeamAlpha', remark: '个人原因退出' },
      { id: 'CL-004', date: '2026-03-15', action: '加入战队', target: 'ProGamer_X', operator: 'TeamAlpha' },
      { id: 'CL-005', date: '2026-03-10', action: '加入战队', target: 'PlayerOne', operator: 'TeamAlpha', remark: '创始成员' },
    ],
    matchHistory: [
      { matchName: 'Dota 2 精英杯', result: '进行中', stage: '小组赛' },
      { matchName: 'MLBB 春季赛', result: '晋级', stage: '季军赛' },
    ],
  },
  {
    teamName: 'Pro Squad',
    captainId: 'U-8823',
    captainNickname: 'ProGamer_X',
    country: '印尼',
    createdAt: '2026-02-20',
    members: [
      { userId: 'U-8823', nickname: 'ProGamer_X', role: 'captain', joinedAt: '2026-02-20' },
      { userId: 'U-9087', nickname: 'CyberNinja', role: 'member', joinedAt: '2026-02-20' },
      { userId: 'U-8076', nickname: 'NeonFlash', role: 'member', joinedAt: '2026-03-01' },
      { userId: 'U-6054', nickname: 'PhoenixRise', role: 'member', joinedAt: '2026-03-05' },
    ],
    changeLog: [
      { id: 'CL-101', date: '2026-03-05', action: '加入战队', target: 'PhoenixRise', operator: 'ProGamer_X' },
      { id: 'CL-102', date: '2026-03-01', action: '加入战队', target: 'NeonFlash', operator: 'ProGamer_X' },
      { id: 'CL-103', date: '2026-02-20', action: '加入战队', target: 'CyberNinja', operator: 'ProGamer_X', remark: '创始成员' },
    ],
    matchHistory: [
      { matchName: 'Dota 2 精英杯', result: '进行中', stage: '小组赛' },
    ],
  },
];

export function getTeamByName(teamName: string): TeamItem | null {
  // 精确匹配
  const found = teamDatabase.find((t) => t.teamName === teamName);
  if (found) return found;
  // 无记录时返回 null，由 TeamDrawer 显示占位信息
  return null;
}

// ============ 用户列表 ============
export type UserRole = 'player' | 'organizer' | 'admin';
export type UserStatus = 'active' | 'banned';
export type PointsEventType =
  | 'checkin'
  | 'match_win'
  | 'match_participate'
  | 'admin_adjust'
  | 'referral'
  | 'signup_reward'
  | 'other';

export interface PointsLogItem {
  id: string;
  type: 'earn' | 'deduct';
  amount: number;
  event: PointsEventType;
  eventLabel: string;
  reason: string;
  time: string;
  balance: number;
}

export interface UserMatchHistoryItem {
  matchId: string;
  matchName: string;
  game: string;
  joinTime: string;
  result: 'champion' | 'runner_up' | 'top4' | 'top8' | 'eliminated' | 'ongoing';
  pointsEarned: number;
}

export interface UserAdminLogItem {
  id: string;
  action: 'ban' | 'unban' | 'adjust_points' | 'change_role';
  operator: string;
  reason: string;
  time: string;
}

export interface UserItem {
  id: string;
  nickname: string;
  username: string;
  email: string;
  phone?: string;
  birthday?: string;
  gender?: 'male' | 'female' | 'other';
  country: string;
  school?: string;
  teamId?: string;
  teamName?: string;
  createdTeamId?: string;
  createdTeamName?: string;
  regTime: string;
  points: number;
  matchCount: number;
  source: 'organic' | 'invite';
  role: UserRole;
  status: UserStatus;
  banReason?: string;
  banTime?: string;
  pointsLog: PointsLogItem[];
  matchHistory: UserMatchHistoryItem[];
  adminLog: UserAdminLogItem[];
}

export const userListData: UserItem[] = [
  {
    id: 'U-9921', nickname: 'PlayerOne', username: 'playerone_ph', email: 'playerone@gmail.com',
    phone: '+63 912 345 6789', birthday: '2000-03-15', gender: 'male',
    country: '菲律宾', school: 'University of the Philippines',
    teamId: 'T-001', teamName: 'Alpha Squad', createdTeamId: undefined, createdTeamName: undefined,
    regTime: '2026-05-20', points: 3250, matchCount: 12, source: 'invite', role: 'player', status: 'active',
    pointsLog: [
      { id: 'PL-001', type: 'earn', amount: 500, event: 'match_win', eventLabel: '赛事冠军', reason: '王者荣耀春季联赛 冠军奖励', time: '2026-05-20 14:30', balance: 3250 },
      { id: 'PL-002', type: 'earn', amount: 10, event: 'checkin', eventLabel: '每日签到', reason: '连续签到第7天', time: '2026-05-19 09:01', balance: 2750 },
      { id: 'PL-003', type: 'earn', amount: 50, event: 'match_participate', eventLabel: '赛事参与', reason: '完成赛事参与奖励', time: '2026-05-18 18:00', balance: 2740 },
      { id: 'PL-004', type: 'deduct', amount: 100, event: 'admin_adjust', eventLabel: '管理员扣除', reason: '违规行为处理', time: '2026-05-10 10:00', balance: 2690 },
      { id: 'PL-005', type: 'earn', amount: 200, event: 'referral', eventLabel: '邀请奖励', reason: '成功邀请新用户注册', time: '2026-04-28 12:00', balance: 2790 },
      { id: 'PL-006', type: 'earn', amount: 100, event: 'signup_reward', eventLabel: '注册奖励', reason: '新用户注册赠送积分', time: '2026-05-20 08:00', balance: 2590 },
    ],
    matchHistory: [
      { matchId: '#M1001', matchName: '王者荣耀春季联赛', game: '王者荣耀', joinTime: '2026-05-15', result: 'champion', pointsEarned: 500 },
      { matchId: '#M1002', matchName: '英雄联盟城市赛', game: '英雄联盟', joinTime: '2026-04-20', result: 'top4', pointsEarned: 100 },
      { matchId: '#M1003', matchName: 'MLBB 周末杯', game: 'Mobile Legends', joinTime: '2026-03-10', result: 'eliminated', pointsEarned: 50 },
    ],
    adminLog: [],
  },
  {
    id: 'U-8823', nickname: 'ProGamer_X', username: 'progamer_x', email: 'progamer@outlook.com',
    phone: '+62 812 3456 789', birthday: '1998-07-22', gender: 'male',
    country: '印尼', school: undefined,
    teamId: 'T-002', teamName: 'Pro Warriors', createdTeamId: 'T-002', createdTeamName: 'Pro Warriors',
    regTime: '2026-05-18', points: 1800, matchCount: 8, source: 'organic', role: 'player', status: 'active',
    pointsLog: [
      { id: 'PL-010', type: 'earn', amount: 200, event: 'match_win', eventLabel: '赛事亚军', reason: 'MLBB 月度杯 亚军奖励', time: '2026-05-17 20:00', balance: 1800 },
      { id: 'PL-011', type: 'earn', amount: 10, event: 'checkin', eventLabel: '每日签到', reason: '签到奖励', time: '2026-05-16 08:30', balance: 1600 },
      { id: 'PL-012', type: 'earn', amount: 100, event: 'signup_reward', eventLabel: '注册奖励', reason: '新用户注册赠送积分', time: '2026-05-18 09:00', balance: 1590 },
    ],
    matchHistory: [
      { matchId: '#M1004', matchName: 'MLBB 月度杯', game: 'Mobile Legends', joinTime: '2026-05-10', result: 'runner_up', pointsEarned: 200 },
      { matchId: '#M1005', matchName: '英雄联盟周末赛', game: '英雄联盟', joinTime: '2026-04-05', result: 'top8', pointsEarned: 50 },
    ],
    adminLog: [],
  },
  {
    id: 'U-7715', nickname: 'TeamAlpha', username: 'teamalpha_cn', email: 'teamalpha@163.com',
    phone: '+86 138 0013 8000', birthday: '1995-11-30', gender: 'male',
    country: '中国', school: undefined,
    teamId: 'T-003', teamName: 'Alpha Gaming', createdTeamId: 'T-003', createdTeamName: 'Alpha Gaming',
    regTime: '2026-04-12', points: 8500, matchCount: 25, source: 'invite', role: 'organizer', status: 'active',
    pointsLog: [
      { id: 'PL-020', type: 'earn', amount: 1000, event: 'match_win', eventLabel: '赛事冠军', reason: '王者荣耀全国赛 冠军', time: '2026-04-10 18:00', balance: 8500 },
      { id: 'PL-021', type: 'earn', amount: 500, event: 'match_win', eventLabel: '赛事冠军', reason: '英雄联盟城市联赛 冠军', time: '2026-03-20 17:00', balance: 7500 },
      { id: 'PL-022', type: 'earn', amount: 200, event: 'referral', eventLabel: '邀请奖励', reason: '邀请5名新用户注册', time: '2026-03-01 12:00', balance: 7000 },
      { id: 'PL-023', type: 'earn', amount: 10, event: 'checkin', eventLabel: '每日签到', reason: '连续签到第30天', time: '2026-04-11 08:00', balance: 6800 },
    ],
    matchHistory: [
      { matchId: '#M1006', matchName: '王者荣耀全国赛', game: '王者荣耀', joinTime: '2026-04-01', result: 'champion', pointsEarned: 1000 },
      { matchId: '#M1007', matchName: '英雄联盟城市联赛', game: '英雄联盟', joinTime: '2026-03-15', result: 'champion', pointsEarned: 500 },
      { matchId: '#M1008', matchName: 'MLBB 春季赛', game: 'Mobile Legends', joinTime: '2026-02-20', result: 'top4', pointsEarned: 100 },
    ],
    adminLog: [],
  },
  {
    id: 'U-6654', nickname: 'GamerGirl99', username: 'gamergirl99', email: 'gamergirl@gmail.com',
    phone: undefined, birthday: '2002-06-18', gender: 'female',
    country: '菲律宾', school: 'Ateneo de Manila University',
    teamId: undefined, teamName: undefined, createdTeamId: undefined, createdTeamName: undefined,
    regTime: '2026-05-22', points: 1200, matchCount: 5, source: 'organic', role: 'player', status: 'active',
    pointsLog: [
      { id: 'PL-030', type: 'earn', amount: 100, event: 'signup_reward', eventLabel: '注册奖励', reason: '新用户注册赠送积分', time: '2026-05-22 10:00', balance: 1200 },
      { id: 'PL-031', type: 'earn', amount: 50, event: 'match_participate', eventLabel: '赛事参与', reason: '完成赛事参与奖励', time: '2026-05-25 20:00', balance: 1100 },
      { id: 'PL-032', type: 'earn', amount: 10, event: 'checkin', eventLabel: '每日签到', reason: '签到奖励', time: '2026-05-23 09:00', balance: 1050 },
    ],
    matchHistory: [
      { matchId: '#M1009', matchName: '女子组电竞联赛', game: '王者荣耀', joinTime: '2026-05-25', result: 'top4', pointsEarned: 100 },
      { matchId: '#M1010', matchName: 'MLBB 新手杯', game: 'Mobile Legends', joinTime: '2026-05-28', result: 'eliminated', pointsEarned: 50 },
    ],
    adminLog: [],
  },
  {
    id: 'U-5543', nickname: 'NoobMaster', username: 'noobmaster_vn', email: 'noobmaster@gmail.com',
    phone: '+84 90 123 4567', birthday: '1999-02-14', gender: 'male',
    country: '越南', school: 'Hanoi University',
    teamId: 'T-004', teamName: 'VN Esports', createdTeamId: undefined, createdTeamName: undefined,
    regTime: '2026-03-28', points: 5600, matchCount: 18, source: 'invite', role: 'player', status: 'active',
    pointsLog: [
      { id: 'PL-040', type: 'earn', amount: 300, event: 'match_win', eventLabel: '赛事季军', reason: '越南区域赛 季军奖励', time: '2026-05-05 19:00', balance: 5600 },
      { id: 'PL-041', type: 'earn', amount: 200, event: 'referral', eventLabel: '邀请奖励', reason: '邀请新用户注册', time: '2026-04-15 14:00', balance: 5300 },
      { id: 'PL-042', type: 'earn', amount: 10, event: 'checkin', eventLabel: '每日签到', reason: '签到奖励', time: '2026-05-06 08:00', balance: 5100 },
    ],
    matchHistory: [
      { matchId: '#M1011', matchName: '越南区域赛', game: '英雄联盟', joinTime: '2026-04-28', result: 'top4', pointsEarned: 300 },
      { matchId: '#M1012', matchName: 'MLBB 月度杯', game: 'Mobile Legends', joinTime: '2026-04-01', result: 'runner_up', pointsEarned: 200 },
    ],
    adminLog: [],
  },
  {
    id: 'U-4432', nickname: 'EsportsKing', username: 'esportsking_my', email: 'esportsking@hotmail.com',
    phone: '+60 12 345 6789', birthday: '2001-09-05', gender: 'male',
    country: '马来西亚', school: 'University of Malaya',
    teamId: undefined, teamName: undefined, createdTeamId: undefined, createdTeamName: undefined,
    regTime: '2026-05-25', points: 800, matchCount: 3, source: 'organic', role: 'player', status: 'active',
    pointsLog: [
      { id: 'PL-050', type: 'earn', amount: 100, event: 'signup_reward', eventLabel: '注册奖励', reason: '新用户注册赠送积分', time: '2026-05-25 15:00', balance: 800 },
      { id: 'PL-051', type: 'earn', amount: 50, event: 'match_participate', eventLabel: '赛事参与', reason: '完成赛事参与奖励', time: '2026-05-27 18:00', balance: 700 },
    ],
    matchHistory: [
      { matchId: '#M1013', matchName: '马来西亚新手杯', game: 'Mobile Legends', joinTime: '2026-05-27', result: 'eliminated', pointsEarned: 50 },
    ],
    adminLog: [],
  },
  {
    id: 'U-3321', nickname: 'LunaStar', username: 'lunastar_id', email: 'lunastar@gmail.com',
    phone: '+62 811 2233 445', birthday: '1997-12-01', gender: 'female',
    country: '印尼', school: undefined,
    teamId: 'T-005', teamName: 'Star Wolves', createdTeamId: 'T-005', createdTeamName: 'Star Wolves',
    regTime: '2026-02-15', points: 9200, matchCount: 30, source: 'invite', role: 'player', status: 'banned',
    banReason: '使用外挂程序，违反平台规定', banTime: '2026-05-01',
    pointsLog: [
      { id: 'PL-060', type: 'deduct', amount: 500, event: 'admin_adjust', eventLabel: '管理员扣除', reason: '违规使用外挂', time: '2026-05-01 10:00', balance: 9200 },
      { id: 'PL-061', type: 'earn', amount: 800, event: 'match_win', eventLabel: '赛事冠军', reason: '印尼区域赛 冠军奖励', time: '2026-04-20 18:00', balance: 9700 },
      { id: 'PL-062', type: 'earn', amount: 10, event: 'checkin', eventLabel: '每日签到', reason: '签到奖励', time: '2026-04-21 09:00', balance: 8900 },
    ],
    matchHistory: [
      { matchId: '#M1014', matchName: '印尼区域赛', game: '王者荣耀', joinTime: '2026-04-15', result: 'champion', pointsEarned: 800 },
      { matchId: '#M1015', matchName: 'MLBB 精英赛', game: 'Mobile Legends', joinTime: '2026-03-20', result: 'runner_up', pointsEarned: 300 },
    ],
    adminLog: [
      { id: 'AL-001', action: 'ban', operator: 'Admin', reason: '使用外挂程序，违反平台规定', time: '2026-05-01 10:05' },
    ],
  },
  {
    id: 'U-2210', nickname: 'DragonSlayer', username: 'dragonslayer_cn', email: 'dragonslayer@qq.com',
    phone: '+86 139 0039 0000', birthday: '1996-08-20', gender: 'male',
    country: '中国', school: undefined,
    teamId: 'T-006', teamName: 'Dragon Fire', createdTeamId: undefined, createdTeamName: undefined,
    regTime: '2026-05-10', points: 2400, matchCount: 9, source: 'organic', role: 'player', status: 'active',
    pointsLog: [
      { id: 'PL-070', type: 'earn', amount: 200, event: 'match_win', eventLabel: '赛事冠军', reason: '英雄联盟周末杯 冠军', time: '2026-05-08 20:00', balance: 2400 },
      { id: 'PL-071', type: 'earn', amount: 10, event: 'checkin', eventLabel: '每日签到', reason: '签到奖励', time: '2026-05-09 08:00', balance: 2200 },
    ],
    matchHistory: [
      { matchId: '#M1016', matchName: '英雄联盟周末杯', game: '英雄联盟', joinTime: '2026-05-05', result: 'champion', pointsEarned: 200 },
    ],
    adminLog: [],
  },
  {
    id: 'U-1109', nickname: 'PixelHero', username: 'pixelhero_ph', email: 'pixelhero@gmail.com',
    phone: '+63 917 888 9999', birthday: '1993-04-10', gender: 'male',
    country: '菲律宾', school: undefined,
    teamId: 'T-001', teamName: 'Alpha Squad', createdTeamId: 'T-001', createdTeamName: 'Alpha Squad',
    regTime: '2026-01-20', points: 11500, matchCount: 42, source: 'invite', role: 'organizer', status: 'active',
    pointsLog: [
      { id: 'PL-080', type: 'earn', amount: 1000, event: 'match_win', eventLabel: '赛事冠军', reason: '菲律宾全国赛 冠军', time: '2026-05-12 18:00', balance: 11500 },
      { id: 'PL-081', type: 'earn', amount: 500, event: 'match_win', eventLabel: '赛事冠军', reason: '东南亚联赛分区赛 冠军', time: '2026-04-25 17:00', balance: 10500 },
      { id: 'PL-082', type: 'earn', amount: 200, event: 'referral', eventLabel: '邀请奖励', reason: '邀请10名用户注册', time: '2026-03-10 12:00', balance: 10000 },
      { id: 'PL-083', type: 'earn', amount: 100, event: 'signup_reward', eventLabel: '注册奖励', reason: '老用户感恩奖励', time: '2026-01-20 09:00', balance: 9800 },
    ],
    matchHistory: [
      { matchId: '#M1017', matchName: '菲律宾全国赛', game: '王者荣耀', joinTime: '2026-05-05', result: 'champion', pointsEarned: 1000 },
      { matchId: '#M1018', matchName: '东南亚联赛分区赛', game: '英雄联盟', joinTime: '2026-04-18', result: 'champion', pointsEarned: 500 },
      { matchId: '#M1019', matchName: 'MLBB 精英赛', game: 'Mobile Legends', joinTime: '2026-03-20', result: 'runner_up', pointsEarned: 200 },
    ],
    adminLog: [],
  },
  {
    id: 'U-0098', nickname: 'StormRider', username: 'stormrider_vn', email: 'stormrider@gmail.com',
    phone: undefined, birthday: '2003-01-25', gender: 'male',
    country: '越南', school: 'Ho Chi Minh City University',
    teamId: undefined, teamName: undefined, createdTeamId: undefined, createdTeamName: undefined,
    regTime: '2026-05-28', points: 600, matchCount: 2, source: 'organic', role: 'player', status: 'active',
    pointsLog: [
      { id: 'PL-090', type: 'earn', amount: 100, event: 'signup_reward', eventLabel: '注册奖励', reason: '新用户注册赠送积分', time: '2026-05-28 11:00', balance: 600 },
      { id: 'PL-091', type: 'earn', amount: 50, event: 'match_participate', eventLabel: '赛事参与', reason: '完成赛事参与奖励', time: '2026-05-30 18:00', balance: 500 },
    ],
    matchHistory: [
      { matchId: '#M1020', matchName: '越南新手杯', game: 'Mobile Legends', joinTime: '2026-05-30', result: 'eliminated', pointsEarned: 50 },
    ],
    adminLog: [],
  },
  {
    id: 'U-9087', nickname: 'CyberNinja', username: 'cyberninja_my', email: 'cyberninja@gmail.com',
    phone: '+60 16 777 8888', birthday: '1998-05-17', gender: 'male',
    country: '马来西亚', school: undefined,
    teamId: 'T-007', teamName: 'Cyber Force', createdTeamId: undefined, createdTeamName: undefined,
    regTime: '2026-04-05', points: 4300, matchCount: 15, source: 'invite', role: 'player', status: 'active',
    pointsLog: [
      { id: 'PL-100', type: 'earn', amount: 300, event: 'match_win', eventLabel: '赛事季军', reason: '马来西亚精英赛 季军', time: '2026-05-01 19:00', balance: 4300 },
      { id: 'PL-101', type: 'earn', amount: 200, event: 'referral', eventLabel: '邀请奖励', reason: '邀请新用户', time: '2026-04-20 14:00', balance: 4000 },
      { id: 'PL-102', type: 'earn', amount: 10, event: 'checkin', eventLabel: '每日签到', reason: '签到奖励', time: '2026-04-06 09:00', balance: 3800 },
    ],
    matchHistory: [
      { matchId: '#M1021', matchName: '马来西亚精英赛', game: '英雄联盟', joinTime: '2026-04-25', result: 'top4', pointsEarned: 300 },
    ],
    adminLog: [],
  },
  {
    id: 'U-8076', nickname: 'NeonFlash', username: 'neonflash_ph', email: 'neonflash@yahoo.com',
    phone: '+63 920 111 2222', birthday: '2001-11-08', gender: 'female',
    country: '菲律宾', school: 'De La Salle University',
    teamId: undefined, teamName: undefined, createdTeamId: undefined, createdTeamName: undefined,
    regTime: '2026-05-15', points: 1900, matchCount: 7, source: 'organic', role: 'player', status: 'active',
    pointsLog: [
      { id: 'PL-110', type: 'earn', amount: 100, event: 'signup_reward', eventLabel: '注册奖励', reason: '新用户注册赠送积分', time: '2026-05-15 10:00', balance: 1900 },
      { id: 'PL-111', type: 'earn', amount: 200, event: 'match_win', eventLabel: '赛事亚军', reason: '女子组联赛 亚军奖励', time: '2026-05-20 18:00', balance: 1800 },
      { id: 'PL-112', type: 'earn', amount: 10, event: 'checkin', eventLabel: '每日签到', reason: '签到奖励', time: '2026-05-16 08:00', balance: 1600 },
    ],
    matchHistory: [
      { matchId: '#M1022', matchName: '女子组电竞联赛', game: '王者荣耀', joinTime: '2026-05-18', result: 'runner_up', pointsEarned: 200 },
    ],
    adminLog: [],
  },
  {
    id: 'U-7065', nickname: 'ShadowHunter', username: 'shadowhunter_cn', email: 'shadow@163.com',
    phone: '+86 135 0001 0001', birthday: '1994-07-07', gender: 'male',
    country: '中国', school: undefined,
    teamId: undefined, teamName: undefined, createdTeamId: undefined, createdTeamName: undefined,
    regTime: '2026-03-10', points: 7800, matchCount: 22, source: 'invite', role: 'player', status: 'banned',
    banReason: '多次恶意报名后不参赛，影响赛事秩序', banTime: '2026-05-15',
    pointsLog: [
      { id: 'PL-120', type: 'deduct', amount: 200, event: 'admin_adjust', eventLabel: '管理员扣除', reason: '违规处罚', time: '2026-05-15 09:00', balance: 7800 },
      { id: 'PL-121', type: 'earn', amount: 500, event: 'match_win', eventLabel: '赛事冠军', reason: '英雄联盟周赛 冠军', time: '2026-05-01 20:00', balance: 8000 },
    ],
    matchHistory: [
      { matchId: '#M1023', matchName: '英雄联盟周赛', game: '英雄联盟', joinTime: '2026-04-28', result: 'champion', pointsEarned: 500 },
    ],
    adminLog: [
      { id: 'AL-002', action: 'ban', operator: 'Admin', reason: '多次恶意报名后不参赛，影响赛事秩序', time: '2026-05-15 09:05' },
    ],
  },
  {
    id: 'U-6054', nickname: 'PhoenixRise', username: 'phoenixrise_id', email: 'phoenix@gmail.com',
    phone: undefined, birthday: '2004-03-22', gender: 'other',
    country: '印尼', school: 'Universitas Indonesia',
    teamId: undefined, teamName: undefined, createdTeamId: undefined, createdTeamName: undefined,
    regTime: '2026-05-30', points: 400, matchCount: 1, source: 'organic', role: 'player', status: 'active',
    pointsLog: [
      { id: 'PL-130', type: 'earn', amount: 100, event: 'signup_reward', eventLabel: '注册奖励', reason: '新用户注册赠送积分', time: '2026-05-30 14:00', balance: 400 },
    ],
    matchHistory: [
      { matchId: '#M1024', matchName: '印尼新手杯', game: 'Mobile Legends', joinTime: '2026-06-01', result: 'ongoing', pointsEarned: 0 },
    ],
    adminLog: [],
  },
  {
    id: 'U-5043', nickname: 'IceQueen', username: 'icequeen_vn', email: 'icequeen@gmail.com',
    phone: '+84 91 234 5678', birthday: '1996-10-15', gender: 'female',
    country: '越南', school: undefined,
    teamId: 'T-008', teamName: 'Ice Wolves', createdTeamId: 'T-008', createdTeamName: 'Ice Wolves',
    regTime: '2026-02-28', points: 6700, matchCount: 20, source: 'invite', role: 'player', status: 'active',
    pointsLog: [
      { id: 'PL-140', type: 'earn', amount: 500, event: 'match_win', eventLabel: '赛事冠军', reason: '女子组全国赛 冠军', time: '2026-05-22 18:00', balance: 6700 },
      { id: 'PL-141', type: 'earn', amount: 300, event: 'match_win', eventLabel: '赛事冠军', reason: '越南区域女子赛 冠军', time: '2026-04-10 17:00', balance: 6200 },
      { id: 'PL-142', type: 'earn', amount: 200, event: 'referral', eventLabel: '邀请奖励', reason: '邀请新用户注册', time: '2026-03-15 12:00', balance: 5900 },
      { id: 'PL-143', type: 'earn', amount: 10, event: 'checkin', eventLabel: '每日签到', reason: '连续签到第14天', time: '2026-05-23 09:00', balance: 5700 },
    ],
    matchHistory: [
      { matchId: '#M1025', matchName: '女子组全国赛', game: '王者荣耀', joinTime: '2026-05-15', result: 'champion', pointsEarned: 500 },
      { matchId: '#M1026', matchName: '越南区域女子赛', game: '英雄联盟', joinTime: '2026-04-05', result: 'champion', pointsEarned: 300 },
      { matchId: '#M1027', matchName: 'MLBB 月度杯', game: 'Mobile Legends', joinTime: '2026-03-01', result: 'top4', pointsEarned: 100 },
    ],
    adminLog: [],
  },
  {
    id: 'U-4012', nickname: 'ThunderBolt', username: 'thunderbolt_sg', email: 'thunder@gmail.com',
    phone: '+65 9123 4567', birthday: '1999-08-08', gender: 'male',
    country: '新加坡', school: 'National University of Singapore',
    teamId: 'T-009', teamName: 'Thunder Squad', createdTeamId: 'T-009', createdTeamName: 'Thunder Squad',
    regTime: '2026-03-05', points: 3800, matchCount: 14, source: 'invite', role: 'player', status: 'active',
    pointsLog: [
      { id: 'PL-150', type: 'earn', amount: 300, event: 'match_win', eventLabel: '赛事季军', reason: '新加坡精英赛 季军', time: '2026-05-10 19:00', balance: 3800 },
      { id: 'PL-151', type: 'earn', amount: 10, event: 'checkin', eventLabel: '每日签到', reason: '签到奖励', time: '2026-05-11 09:00', balance: 3500 },
    ],
    matchHistory: [
      { matchId: '#M1028', matchName: '新加坡精英赛', game: '英雄联盟', joinTime: '2026-05-05', result: 'top4', pointsEarned: 300 },
    ],
    adminLog: [],
  },
  {
    id: 'U-3001', nickname: 'MidLaner99', username: 'midlaner99_th', email: 'midlaner@gmail.com',
    phone: '+66 81 234 5678', birthday: '2000-12-12', gender: 'male',
    country: '泰国', school: 'Chulalongkorn University',
    teamId: undefined, teamName: undefined, createdTeamId: undefined, createdTeamName: undefined,
    regTime: '2026-04-18', points: 2100, matchCount: 6, source: 'organic', role: 'player', status: 'active',
    pointsLog: [
      { id: 'PL-160', type: 'earn', amount: 100, event: 'signup_reward', eventLabel: '注册奖励', reason: '新用户注册赠送积分', time: '2026-04-18 13:00', balance: 2100 },
      { id: 'PL-161', type: 'earn', amount: 200, event: 'match_win', eventLabel: '赛事亚军', reason: '泰国区域赛 亚军奖励', time: '2026-05-03 18:00', balance: 2000 },
    ],
    matchHistory: [
      { matchId: '#M1029', matchName: '泰国区域赛', game: '英雄联盟', joinTime: '2026-04-28', result: 'runner_up', pointsEarned: 200 },
    ],
    adminLog: [],
  },
  {
    id: 'U-2090', nickname: 'FireStorm', username: 'firestorm_id', email: 'firestorm@hotmail.com',
    phone: '+62 878 9900 1122', birthday: '1997-06-30', gender: 'male',
    country: '印尼', school: undefined,
    teamId: 'T-010', teamName: 'Fire Nation', createdTeamId: 'T-010', createdTeamName: 'Fire Nation',
    regTime: '2026-01-10', points: 12300, matchCount: 38, source: 'invite', role: 'organizer', status: 'active',
    pointsLog: [
      { id: 'PL-170', type: 'earn', amount: 1500, event: 'match_win', eventLabel: '赛事冠军', reason: '东南亚总决赛 冠军', time: '2026-05-25 20:00', balance: 12300 },
      { id: 'PL-171', type: 'earn', amount: 500, event: 'match_win', eventLabel: '赛事冠军', reason: '印尼全国赛 冠军', time: '2026-04-30 18:00', balance: 10800 },
      { id: 'PL-172', type: 'earn', amount: 300, event: 'referral', eventLabel: '邀请奖励', reason: '邀请15名用户注册', time: '2026-04-01 12:00', balance: 10300 },
      { id: 'PL-173', type: 'earn', amount: 10, event: 'checkin', eventLabel: '每日签到', reason: '连续签到第60天', time: '2026-05-26 08:00', balance: 10000 },
    ],
    matchHistory: [
      { matchId: '#M1030', matchName: '东南亚总决赛', game: '王者荣耀', joinTime: '2026-05-18', result: 'champion', pointsEarned: 1500 },
      { matchId: '#M1031', matchName: '印尼全国赛', game: '英雄联盟', joinTime: '2026-04-22', result: 'champion', pointsEarned: 500 },
    ],
    adminLog: [],
  },
  {
    id: 'U-1080', nickname: 'SuperAdmin', username: 'superadmin', email: 'admin@gainslink.com',
    phone: '+1 800 000 0000', birthday: undefined, gender: undefined,
    country: '中国', school: undefined,
    teamId: undefined, teamName: undefined, createdTeamId: undefined, createdTeamName: undefined,
    regTime: '2025-01-01', points: 0, matchCount: 0, source: 'organic', role: 'admin', status: 'active',
    pointsLog: [],
    matchHistory: [],
    adminLog: [],
  },
];

// ============ 机构/主办方管理 ============
export interface OrganizerItem {
  id: string;
  name: string;
  type: 'official' | 'partner' | 'community';
  logo?: string;
  contact: string;
  email: string;
  status: 'active' | 'suspended' | 'pending';
  authorizedMatches: number;
  createdAt: string;
  description?: string;
  userId?: string;
  userNickname?: string;
}

export const organizerData: OrganizerItem[] = [
  { id: 'O-001', name: 'Gainslink 官方', type: 'official', contact: 'Admin', email: 'admin@gainslink.com', status: 'active', authorizedMatches: 6, createdAt: '2025-01-01', description: '平台官方赛事运营方' },
  { id: 'O-002', name: 'Mars Esports', type: 'partner', contact: 'Mars', email: 'mars@esports.com', status: 'active', authorizedMatches: 2, createdAt: '2026-03-15', description: '第三方专业电竞机构' },
  { id: 'O-003', name: '周末电竞社', type: 'community', contact: 'Weekend', email: 'weekend@gg.com', status: 'active', authorizedMatches: 1, createdAt: '2026-04-20', description: '社区自发组织' },
  { id: 'O-004', name: 'NewStar 联盟', type: 'community', contact: 'NewStar', email: 'newstar@gg.com', status: 'active', authorizedMatches: 1, createdAt: '2026-05-10', description: '新人玩家联盟' },
  { id: 'O-005', name: '高校电竞联盟', type: 'community', contact: 'UniEsports', email: 'uni@gg.com', status: 'active', authorizedMatches: 2, createdAt: '2026-02-28', description: '高校电竞组织' },
  { id: 'O-006', name: 'Manila Gaming', type: 'partner', contact: 'Manila', email: 'manila@gaming.com', status: 'pending', authorizedMatches: 0, createdAt: '2026-06-08', description: '马尼拉本地电竞机构' },
  { id: 'O-007', name: 'Community Cup', type: 'community', contact: 'Cup', email: 'cup@gg.com', status: 'suspended', authorizedMatches: 1, createdAt: '2026-04-01', description: '社区杯赛组织' },
  { id: 'O-008', name: 'Rookie Club', type: 'community', contact: 'Rookie', email: 'rookie@gg.com', status: 'active', authorizedMatches: 1, createdAt: '2026-05-20', description: '新人俱乐部' },
  { id: 'O-009', name: 'Fun Gaming', type: 'community', contact: 'Fun', email: 'fun@gg.com', status: 'active', authorizedMatches: 1, createdAt: '2026-05-01', description: '娱乐赛事组织' },
  { id: 'O-010', name: 'Weekend Warriors', type: 'community', contact: 'Warriors', email: 'warriors@gg.com', status: 'active', authorizedMatches: 1, createdAt: '2026-06-10', description: '周末赛事组织' },
];

// ============ 赛事报名审核 ============
export interface SignupAuditItem {
  id: string;
  userId: string;
  matchId: string;
  matchName: string;
  userNickname: string;
  teamName?: string;
  contactInfo: string;
  signupTime: string;
  status: 'pending' | 'approved' | 'rejected';
  auditReason?: string;
}

export const signupAuditData: SignupAuditItem[] = [
  { id: 'S-1001', userId: 'U-9921', matchId: '#M1023', matchName: 'Dota 2 精英杯', userNickname: 'PlayerOne', teamName: 'Team Alpha', contactInfo: 'playerone@gg.com', signupTime: '06-06 10:23', status: 'pending' },
  { id: 'S-1002', userId: 'U-8823', matchId: '#M1023', matchName: 'Dota 2 精英杯', userNickname: 'ProGamer_X', teamName: 'Pro Squad', contactInfo: 'pro@gg.com', signupTime: '06-06 11:05', status: 'pending' },
  { id: 'S-1003', userId: 'U-7715', matchId: '#M1023', matchName: 'Dota 2 精英杯', userNickname: 'TeamAlpha', contactInfo: 'alpha@gg.com', signupTime: '06-06 12:40', status: 'pending' },
  { id: 'S-1004', userId: 'U-6654', matchId: '#M1020', matchName: 'MLBB 新秀赛', userNickname: 'GamerGirl99', contactInfo: 'girl@gg.com', signupTime: '06-07 09:15', status: 'pending' },
  { id: 'S-1005', userId: 'U-5543', matchId: '#M1020', matchName: 'MLBB 新秀赛', userNickname: 'NoobMaster', teamName: 'Noob Team', contactInfo: 'noob@gg.com', signupTime: '06-07 10:30', status: 'pending' },
  { id: 'S-1006', userId: 'U-4432', matchId: '#M1020', matchName: 'MLBB 新秀赛', userNickname: 'EsportsKing', contactInfo: 'king@gg.com', signupTime: '06-07 11:20', status: 'pending' },
  { id: 'S-1007', userId: 'U-2210', matchId: '#M1015', matchName: 'Dota 2 高校联赛', userNickname: 'DragonSlayer', teamName: 'Dragon', contactInfo: 'dragon@gg.com', signupTime: '06-05 14:10', status: 'pending' },
  { id: 'S-1008', userId: 'U-1109', matchId: '#M1015', matchName: 'Dota 2 高校联赛', userNickname: 'PixelHero', contactInfo: 'pixel@gg.com', signupTime: '06-05 16:45', status: 'pending' },
  { id: 'S-1009', userId: 'U-0098', matchId: '#M1012', matchName: 'eFootball 大师赛', userNickname: 'StormRider', contactInfo: 'storm@gg.com', signupTime: '06-06 08:55', status: 'pending' },
  { id: 'S-1010', userId: 'U-9087', matchId: '#M1012', matchName: 'eFootball 大师赛', userNickname: 'CyberNinja', teamName: 'Ninja', contactInfo: 'ninja@gg.com', signupTime: '06-06 13:22', status: 'pending' },
  { id: 'S-1011', userId: 'U-8076', matchId: '#M1012', matchName: 'eFootball 大师赛', userNickname: 'NeonFlash', contactInfo: 'neon@gg.com', signupTime: '06-06 15:08', status: 'pending' },
  { id: 'S-1012', userId: 'U-6054', matchId: '#M1012', matchName: 'eFootball 大师赛', userNickname: 'PhoenixRise', contactInfo: 'phoenix@gg.com', signupTime: '06-06 17:30', status: 'pending' },
];

// ============ 排期/赛程 ============
export interface MatchGame {
  gameId: string;
  teamA: string;
  teamB: string;
  slotA?: string;
  slotB?: string;
  teamAIsPlaceholder?: boolean;
  teamBIsPlaceholder?: boolean;
  scoreA?: number;
  scoreB?: number;
  winner?: string;
  format?: string;
  startTime: string;
  status: 'scheduled' | 'live' | 'completed' | 'cancelled';
  // 胜者晋级链路
  nextMatchId?: string;
  nextSlot?: 'A' | 'B';
  // 败者链路（双败淘汰 / 季军赛）
  loserNextMatchId?: string;
  loserNextSlot?: 'A' | 'B';
  // 种子序号
  seedA?: number;
  seedB?: number;
  // 双败淘汰重制局标记
  isResetGame?: boolean;
  // 录像链接（上传后填写）
  replayUrl?: string;
}

export interface MatchRound {
  roundId: string;
  matchId: string;
  roundName: string;
  roundNumber: number;
  stage: 'group' | 'knockout' | 'final';
  startTime: string;
  endTime: string;
  status: 'upcoming' | 'ongoing' | 'completed';
  matches: MatchGame[];
  // 所属轮次/阶段
  stageId?: string;
  stageType?: StageType;
  // 分组索引（循环赛/淘汰赛分组用）
  groupIndex?: number;
  // 双败淘汰总决赛重制局（LB 冠军赢第一场后启用）
  isResetRound?: boolean;
}

export interface GroupStanding {
  teamName: string;
  played: number;
  wins: number;
  losses: number;
  draws: number;
  points: number;
  scoreFor: number;
  scoreAgainst: number;
  buchholz?: number; // 瑞士轮：所有已对阵对手的积分总和
}

export const matchRoundData: MatchRound[] = [
  {
    roundId: 'R-1024-1', matchId: '#M1024', roundName: '小组赛 A 轮', roundNumber: 1, stage: 'group', startTime: '06-15 14:00', endTime: '06-15 18:00', status: 'upcoming',
    matches: [
      { gameId: 'G-1024-1-1', teamA: 'Team A1', teamB: 'Team A2', startTime: '06-15 14:00', status: 'scheduled' },
      { gameId: 'G-1024-1-2', teamA: 'Team A3', teamB: 'Team A4', startTime: '06-15 16:00', status: 'scheduled' },
    ],
  },
  {
    roundId: 'R-1024-2', matchId: '#M1024', roundName: '小组赛 B 轮', roundNumber: 2, stage: 'group', startTime: '06-16 14:00', endTime: '06-16 18:00', status: 'upcoming',
    matches: [
      { gameId: 'G-1024-2-1', teamA: 'Team A1', teamB: 'Team A3', startTime: '06-16 14:00', status: 'scheduled' },
      { gameId: 'G-1024-2-2', teamA: 'Team A2', teamB: 'Team A4', startTime: '06-16 16:00', status: 'scheduled' },
    ],
  },
  {
    roundId: 'R-1024-3', matchId: '#M1024', roundName: '淘汰赛', roundNumber: 3, stage: 'knockout', startTime: '06-18 14:00', endTime: '06-18 18:00', status: 'upcoming',
    matches: [
      { gameId: 'G-1024-3-1', teamA: '待定', teamB: '待定', startTime: '06-18 14:00', status: 'scheduled' },
    ],
  },
  {
    roundId: 'R-1023-1', matchId: '#M1023', roundName: '8 强赛', roundNumber: 1, stage: 'knockout', startTime: '06-12 16:00', endTime: '06-12 20:00', status: 'upcoming',
    matches: [
      { gameId: 'G-1023-1-1', teamA: 'Pro Squad', teamB: 'Team Alpha', startTime: '06-12 16:00', status: 'scheduled' },
      { gameId: 'G-1023-1-2', teamA: 'Elite 1', teamB: 'Elite 2', startTime: '06-12 18:00', status: 'scheduled' },
    ],
  },
  {
    roundId: 'R-1022-1', matchId: '#M1022', roundName: '第一轮', roundNumber: 1, stage: 'knockout', startTime: '06-05 15:00', endTime: '06-05 17:00', status: 'ongoing',
    matches: [
      { gameId: 'G-1022-1-1', teamA: 'Squad 1', teamB: 'Squad 2', scoreA: 12, scoreB: 8, winner: 'Squad 1', startTime: '06-05 15:00', status: 'completed' },
      { gameId: 'G-1022-1-2', teamA: 'Squad 3', teamB: 'Squad 4', startTime: '06-05 16:00', status: 'live' },
    ],
  },
];

// ============ 排阵占位与赛程生成辅助函数 ============
export function generatePlaceholderSlots(maxTeams: number): string[] {
  const slots: string[] = [];
  const groupSize = 4;
  let groupIndex = 0;
  for (let i = 0; i < maxTeams; i++) {
    if (i > 0 && i % groupSize === 0) groupIndex++;
    const letter = String.fromCharCode(65 + groupIndex);
    slots.push(`${letter}${(i % groupSize) + 1}`);
  }
  return slots;
}

function createPlaceholderGame(
  matchId: string,
  roundId: string,
  index: number,
  slotA: string,
  slotB: string,
  _startTime?: string,
  format?: string
): MatchGame {
  return {
    gameId: `${matchId}-${roundId}-G${index + 1}`,
    teamA: slotA,
    teamB: slotB,
    slotA,
    slotB,
    teamAIsPlaceholder: true,
    teamBIsPlaceholder: true,
    startTime: '',  // 时间由用户手动排入，生成时保持空白
    format,
    status: 'scheduled',
  };
}

export function applyTemplate(templateKey: string, maxTeams: number): TournamentStage[] {
  const clampedMaxTeams = Math.min(Math.max(1, maxTeams), MAX_TEAMS_LIMIT);
  maxTeams = clampedMaxTeams;
  const id = () => `ST-${Math.random().toString(36).slice(2, 8)}`;
  const powerOfTwo = Math.max(2, Math.pow(2, Math.ceil(Math.log2(maxTeams))));

  const makeStage = (partial: Partial<TournamentStage> & Pick<TournamentStage, 'name' | 'type'>, order: number): TournamentStage => {
    const base = createDefaultStage(order, partial.entrant?.entrantCount || maxTeams);
    const stage: TournamentStage = {
      ...base,
      stageId: id(),
      name: partial.name,
      order,
      type: partial.type,
      entrant: partial.entrant || base.entrant,
      group: partial.group || base.group,
      match: partial.match || base.match,
      scoring: partial.scoring,
      ranking: partial.ranking || base.ranking,
      advancement: partial.advancement,
      formatRules: partial.formatRules || formatRulesForType(partial.type),
      manualAdjust: partial.manualAdjust || base.manualAdjust,
    };
    return syncLegacyStageFields(stage);
  };

  switch (templateKey) {
    case '单败淘汰':
      return [makeStage({
        name: '淘汰赛',
        type: 'SINGLE_ELIMINATION',
        entrant: { entrantCount: powerOfTwo, source: { type: 'REGISTRATION' }, seedingPolicy: { type: 'REGISTRATION_ORDER', allowManualOverride: true } },
        match: { defaultBestOf: 3, allowDraw: false, tieBreakerPolicy: 'NONE', mapScoreEnabled: true, forfeitEnabled: true },
        advancement: [],
        formatRules: formatRulesForType('SINGLE_ELIMINATION'),
      }, 1)];
    case '循环赛':
      return [makeStage({
        name: '循环赛',
        type: 'ROUND_ROBIN',
        entrant: { entrantCount: maxTeams, source: { type: 'REGISTRATION' }, seedingPolicy: { type: 'REGISTRATION_ORDER', allowManualOverride: true } },
        group: { enabled: false, groupCount: 1, teamsPerGroup: maxTeams, allowUnevenGroups: false, assignmentMode: 'BY_SEED_SNAKE', allowManualAdjust: true },
        match: { defaultBestOf: 1, allowDraw: false, tieBreakerPolicy: 'NONE', mapScoreEnabled: true, forfeitEnabled: true },
        scoring: { winPoints: 3, drawPoints: 1, lossPoints: 0, forfeitWinPoints: 3, forfeitLossPoints: 0 },
        advancement: [],
        formatRules: formatRulesForType('ROUND_ROBIN', { roundRobin: { format: 'ROUND_ROBIN', mode: 'SINGLE' } }),
      }, 1)];
    case '双败淘汰':
      return [makeStage({
        name: '双败淘汰赛',
        type: 'DOUBLE_ELIMINATION',
        entrant: { entrantCount: powerOfTwo, source: { type: 'REGISTRATION' }, seedingPolicy: { type: 'REGISTRATION_ORDER', allowManualOverride: true } },
        match: { defaultBestOf: 3, allowDraw: false, tieBreakerPolicy: 'NONE', mapScoreEnabled: true, forfeitEnabled: true },
        advancement: [],
        formatRules: formatRulesForType('DOUBLE_ELIMINATION'),
      }, 1)];
    case '瑞士轮': {
      const rounds = Math.max(1, Math.ceil(Math.log2(maxTeams)));
      return [makeStage({
        name: '瑞士轮',
        type: 'SWISS',
        entrant: { entrantCount: maxTeams, source: { type: 'REGISTRATION' }, seedingPolicy: { type: 'REGISTRATION_ORDER', allowManualOverride: true } },
        match: { defaultBestOf: 1, allowDraw: false, tieBreakerPolicy: 'NONE', mapScoreEnabled: true, forfeitEnabled: true },
        scoring: { winPoints: 1, drawPoints: 0, lossPoints: 0, forfeitWinPoints: 1, forfeitLossPoints: 0 },
        advancement: [],
        formatRules: formatRulesForType('SWISS', { swiss: { format: 'SWISS', rounds, round1Pairing: 'SEED_HIGH_LOW', avoidRepeatOpponent: true, byePolicy: 'LOWEST_SCORE_NO_PREVIOUS_BYE' } }),
      }, 1)];
    }
    case '小组+淘汰': {
      const groupSize = 4;
      const groupCount = Math.max(1, Math.floor(maxTeams / groupSize));
      const stage1Teams = groupCount * groupSize;
      const knockoutTeams = Math.max(2, Math.min(powerOfTwo, groupCount * 2));
      const stage1Id = id();
      const stage2Id = id();
      return [
        makeStage({
          name: '小组赛',
          type: 'ROUND_ROBIN',
          entrant: { entrantCount: stage1Teams, source: { type: 'REGISTRATION' }, seedingPolicy: { type: 'REGISTRATION_ORDER', allowManualOverride: true } },
          group: { enabled: true, groupCount, teamsPerGroup: groupSize, allowUnevenGroups: false, assignmentMode: 'BY_SEED_SNAKE', allowManualAdjust: true },
          match: { defaultBestOf: 1, allowDraw: false, tieBreakerPolicy: 'NONE', mapScoreEnabled: true, forfeitEnabled: true },
          scoring: { winPoints: 3, drawPoints: 1, lossPoints: 0, forfeitWinPoints: 3, forfeitLossPoints: 0 },
          advancement: [{ type: 'TOP_N_PER_GROUP', nextStageId: stage2Id, countPerGroup: 2, nextStageSeedingPolicy: 'PREVIOUS_STAGE_RANK' }],
          formatRules: formatRulesForType('ROUND_ROBIN', { roundRobin: { format: 'ROUND_ROBIN', mode: 'SINGLE' } }),
        }, 1),
        makeStage({
          name: '淘汰赛',
          type: 'SINGLE_ELIMINATION',
          entrant: { entrantCount: knockoutTeams, source: { type: 'FROM_PREVIOUS_STAGE', previousStageId: stage1Id }, seedingPolicy: { type: 'PREVIOUS_STAGE_RANK', allowManualOverride: true } },
          group: { enabled: false, groupCount: 1, teamsPerGroup: knockoutTeams, allowUnevenGroups: false, assignmentMode: 'MANUAL', allowManualAdjust: true },
          match: { defaultBestOf: 3, allowDraw: false, tieBreakerPolicy: 'NONE', mapScoreEnabled: true, forfeitEnabled: true },
          advancement: [],
          formatRules: formatRulesForType('SINGLE_ELIMINATION'),
        }, 2),
      ];
    }
    default:
      return applyTemplate('单败淘汰', maxTeams);
  }
}

function nextDate(baseDate: string, offset: number): string {
  const [month, day] = baseDate.split('-').map(Number);
  const date = new Date(2026, (month || 6) - 1, (day || 15) + offset);
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${m}-${d}`;
}

function generateSingleEliminationStage(
  match: MatchItem,
  stage: TournamentStage,
  stageIndex: number,
  baseDate: string,
  roundOffset: number,
  slots: string[]
): MatchRound[] {
  const rounds: MatchRound[] = [];
  const groupCount = stage.group.enabled ? stage.group.groupCount : (stage.config.groupCount || 1);
  const groupSize = stage.group.enabled
    ? stage.group.teamsPerGroup
    : Math.floor(stage.teamsIn / groupCount);
  const rawBracketSize = stage.config.bracketSize || groupSize;
  const bracketSize = Math.max(2, Math.pow(2, Math.ceil(Math.log2(rawBracketSize))));
  const totalSlotsNeededSE = groupCount * groupSize;
  const slotList = slots.length >= totalSlotsNeededSE ? slots : generatePlaceholderSlots(totalSlotsNeededSE);
  let roundNumber = roundOffset + 1;

  for (let g = 0; g < groupCount; g++) {
    // 取 bracketSize 个槽，不足的位置用 BYE 补齐（供 applyByeWins 自动处理轮空）
    const rawSlots = slotList.slice(g * groupSize, g * groupSize + groupSize);
    const groupSlots: string[] = Array.from({ length: bracketSize }, (_, i) => rawSlots[i] ?? 'BYE');

    let currentMatches: MatchGame[] = [];
    let groupRoundNumber = roundNumber;

    // 首轮：按种子首尾配对（1 vs N, 2 vs N-1 …）
    const firstRoundCount = bracketSize / 2;
    for (let i = 0; i < firstRoundCount; i++) {
      const slotA = groupSlots[i];
      const slotB = groupSlots[bracketSize - 1 - i];
      const game: MatchGame = {
        ...createPlaceholderGame(match.id, `S${stageIndex + 1}-R${groupRoundNumber}`, i, slotA, slotB, `${nextDate(baseDate, groupRoundNumber - 1)} 14:00`, stage.defaultFormat),
        seedA: i + 1,
        seedB: bracketSize - i,
      };
      // BYE 槽标记（applyByeWins 会识别并自动胜）
      if (slotA === 'BYE') { game.teamAIsPlaceholder = true; game.slotA = 'BYE'; }
      if (slotB === 'BYE') { game.teamBIsPlaceholder = true; game.slotB = 'BYE'; }
      currentMatches.push(game);
    }

    rounds.push({
      roundId: `${match.id}-S${stageIndex + 1}-R${groupRoundNumber}`,
      matchId: match.id,
      roundName: `${stage.name} · 第${g + 1}组 · ${bracketSize}强赛`,
      roundNumber: groupRoundNumber,
      stage: 'knockout',
      startTime: `${nextDate(baseDate, groupRoundNumber - 1)} 14:00`,
      endTime: `${nextDate(baseDate, groupRoundNumber - 1)} 18:00`,
      status: 'upcoming',
      matches: currentMatches,
      stageId: stage.stageId,
      stageType: stage.type,
      groupIndex: g,
    });
    groupRoundNumber++;

    // 后续轮次：生成空场次并建立胜者晋级链
    while (currentMatches.length >= 2) {
      const nextMatches: MatchGame[] = [];
      const nextRoundCount = currentMatches.length / 2;
      for (let i = 0; i < nextRoundCount; i++) {
        const gameId = `${match.id}-S${stageIndex + 1}-R${groupRoundNumber}-G${i + 1}`;
        const prev1 = currentMatches[i * 2];
        const prev2 = currentMatches[i * 2 + 1];
        nextMatches.push({
          ...createPlaceholderGame(match.id, `S${stageIndex + 1}-R${groupRoundNumber}`, i, `第${g + 1}组-晋级${i * 2 + 1}`, `第${g + 1}组-晋级${i * 2 + 2}`, `${nextDate(baseDate, groupRoundNumber - 1)} 14:00`, stage.defaultFormat),
          gameId,
        });
        prev1.nextMatchId = gameId;
        prev1.nextSlot = 'A';
        prev2.nextMatchId = gameId;
        prev2.nextSlot = 'B';
      }

      let roundName = `${nextRoundCount * 2}强赛`;
      if (nextRoundCount === 1) roundName = '决赛';
      else if (nextRoundCount === 2) roundName = '半决赛';

      rounds.push({
        roundId: `${match.id}-S${stageIndex + 1}-R${groupRoundNumber}`,
        matchId: match.id,
        roundName: `${stage.name} · 第${g + 1}组 · ${roundName}`,
        roundNumber: groupRoundNumber,
        stage: nextRoundCount === 1 ? 'final' : 'knockout',
        startTime: `${nextDate(baseDate, groupRoundNumber - 1)} 14:00`,
        endTime: `${nextDate(baseDate, groupRoundNumber - 1)} 18:00`,
        status: 'upcoming',
        matches: nextMatches,
        stageId: stage.stageId,
        stageType: stage.type,
        groupIndex: g,
      });
      groupRoundNumber++;
      currentMatches = nextMatches;
    }

    roundNumber = Math.max(roundNumber, groupRoundNumber);

    // 季军赛：把半决赛两场的负者通过 loserNextMatchId 推入
    if (stage.config.thirdPlaceMatch) {
      // currentMatches 此时是决赛的那1场，向前找半决赛（2场）
      const allGroupRounds = rounds.filter((r) => r.stageId === stage.stageId && r.groupIndex === g);
      const semiFinalRound = allGroupRounds.find((r) => r.matches.length === 2 && r.roundName.includes('半决赛'));
      const thirdPlaceGameId = `${match.id}-S${stageIndex + 1}-R${roundNumber}-3P`;
      const thirdPlaceGame: MatchGame = {
        ...createPlaceholderGame(match.id, `S${stageIndex + 1}-R${roundNumber}`, 0, `第${g + 1}组-半决赛负者1`, `第${g + 1}组-半决赛负者2`, `${nextDate(baseDate, roundNumber - 1)} 14:00`, stage.defaultFormat),
        gameId: thirdPlaceGameId,
      };

      // 建立半决赛负者 → 季军赛链路
      if (semiFinalRound) {
        semiFinalRound.matches[0].loserNextMatchId = thirdPlaceGameId;
        semiFinalRound.matches[0].loserNextSlot = 'A';
        if (semiFinalRound.matches[1]) {
          semiFinalRound.matches[1].loserNextMatchId = thirdPlaceGameId;
          semiFinalRound.matches[1].loserNextSlot = 'B';
        }
      }

      rounds.push({
        roundId: `${match.id}-S${stageIndex + 1}-R${roundNumber}`,
        matchId: match.id,
        roundName: `${stage.name} · 第${g + 1}组 · 季军赛`,
        roundNumber,
        stage: 'knockout',
        startTime: `${nextDate(baseDate, roundNumber - 1)} 14:00`,
        endTime: `${nextDate(baseDate, roundNumber - 1)} 18:00`,
        status: 'upcoming',
        matches: [thirdPlaceGame],
        stageId: stage.stageId,
        stageType: stage.type,
        groupIndex: g,
      });
      roundNumber++;
    }
  }

  return rounds;
}

function generateRoundRobinStage(
  match: MatchItem,
  stage: TournamentStage,
  stageIndex: number,
  baseDate: string,
  roundOffset: number,
  slots: string[]
): MatchRound[] {
  const rounds: MatchRound[] = [];
  const groupCount = stage.group.enabled ? stage.group.groupCount : (stage.config.groupCount || 1);
  const groupSize = stage.group.enabled
    ? stage.group.teamsPerGroup
    : Math.floor(stage.teamsIn / groupCount);
  const cycleMode = stage.config.cycleMode || 'single';
  const cycles = cycleMode === 'double' ? 2 : 1;
  // 用 groupCount × groupSize 而非 teamsIn 做长度检查，防止 entrantCount 未同步时导致后几组无槽位
  const totalSlotsNeeded = groupCount * groupSize;
  const slotList = slots.length >= totalSlotsNeeded ? slots : generatePlaceholderSlots(totalSlotsNeeded);
  let roundNumber = roundOffset + 1;

  for (let g = 0; g < groupCount; g++) {
    const baseIdx = g * groupSize;
    const groupSlots: string[] = [];
    for (let i = 0; i < groupSize; i++) {
      if (slotList[baseIdx + i]) groupSlots.push(slotList[baseIdx + i]);
    }

    for (let c = 0; c < cycles; c++) {
      const matches: MatchGame[] = [];
      for (let i = 0; i < groupSlots.length; i++) {
        for (let j = i + 1; j < groupSlots.length; j++) {
          const slotA = cycleMode === 'double' && c === 1 ? groupSlots[j] : groupSlots[i];
          const slotB = cycleMode === 'double' && c === 1 ? groupSlots[i] : groupSlots[j];
          matches.push(createPlaceholderGame(match.id, `S${stageIndex + 1}-R${roundNumber}`, matches.length, slotA, slotB, `${nextDate(baseDate, roundNumber - 1)} 14:00`, stage.defaultFormat));
        }
      }
      const cycleLabel = cycleMode === 'double' ? `第${c + 1}循环` : '第1循环';
      rounds.push({
        roundId: `${match.id}-S${stageIndex + 1}-R${roundNumber}`,
        matchId: match.id,
        roundName: `${stage.name} · 第${g + 1}组 · ${cycleLabel}`,
        roundNumber,
        stage: 'group',
        startTime: `${nextDate(baseDate, roundNumber - 1)} 14:00`,
        endTime: `${nextDate(baseDate, roundNumber - 1)} 18:00`,
        status: 'upcoming',
        matches,
        stageId: stage.stageId,
        stageType: stage.type,
        groupIndex: g,
      });
      roundNumber++;
    }
  }

  return rounds;
}

function generateDoubleEliminationStage(
  match: MatchItem,
  stage: TournamentStage,
  stageIndex: number,
  baseDate: string,
  roundOffset: number,
  slots: string[]
): MatchRound[] {
  const rounds: MatchRound[] = [];
  const groupCount = stage.group.enabled ? stage.group.groupCount : (stage.config.groupCount || 1);
  const groupSize = stage.group.enabled
    ? stage.group.teamsPerGroup
    : Math.floor(stage.teamsIn / groupCount);
  const rawBracketSize = stage.config.bracketSize || groupSize;
  const bracketSize = Math.max(2, Math.pow(2, Math.ceil(Math.log2(rawBracketSize))));
  const totalSlotsNeededDE = groupCount * groupSize;
  const slotList = slots.length >= totalSlotsNeededDE ? slots : generatePlaceholderSlots(totalSlotsNeededDE);
  let roundNumber = roundOffset + 1;

  for (let g = 0; g < groupCount; g++) {
    // 补齐 BYE 槽
    const rawSlots = slotList.slice(g * groupSize, g * groupSize + groupSize);
    const groupSlots: string[] = Array.from({ length: bracketSize }, (_, i) => rawSlots[i] ?? 'BYE');
    let groupRoundNumber = roundNumber;

    // ── 胜者组 ──
    // wbRounds[r] = 该轮的比赛列表，用于建立跨轮链路
    const wbRoundGames: MatchGame[][] = [];

    {
      const wbRoundCount = Math.log2(bracketSize); // e.g. 8队→3轮WB
      const wbNames = ['首轮', '次轮', '半决赛', '决赛'];

      for (let wr = 0; wr < wbRoundCount; wr++) {
        const matchCount = bracketSize / Math.pow(2, wr + 1);
        const matches: MatchGame[] = [];

        for (let i = 0; i < matchCount; i++) {
          let slotA: string, slotB: string;
          if (wr === 0) {
            // 首轮：种子首尾配对
            slotA = groupSlots[i * 2];
            slotB = groupSlots[i * 2 + 1];
          } else {
            slotA = `第${g + 1}组-WB${wr}-${i * 2 + 1}`;
            slotB = `第${g + 1}组-WB${wr}-${i * 2 + 2}`;
          }
          const gameId = `${match.id}-S${stageIndex + 1}-WB-R${wr + 1}-G${i + 1}-Gr${g}`;
          const game: MatchGame = {
            ...createPlaceholderGame(match.id, `S${stageIndex + 1}-WBR${wr + 1}`, i, slotA, slotB, `${nextDate(baseDate, groupRoundNumber - 1)} 14:00`, stage.defaultFormat),
            gameId,
          };
          if (wr === 0) {
            game.seedA = i * 2 + 1;
            game.seedB = i * 2 + 2;
            if (slotA === 'BYE') { game.teamAIsPlaceholder = true; game.slotA = 'BYE'; }
            if (slotB === 'BYE') { game.teamBIsPlaceholder = true; game.slotB = 'BYE'; }
          }
          matches.push(game);
        }

        const name = matchCount === 1 ? '胜者组决赛' : `胜者组${wbNames[wr] || `第${wr + 1}轮`}`;
        rounds.push({
          roundId: `${match.id}-S${stageIndex + 1}-WBR${wr + 1}-Gr${g}`,
          matchId: match.id,
          roundName: `${stage.name} · 第${g + 1}组 · ${name}`,
          roundNumber: groupRoundNumber,
          stage: 'knockout',
          startTime: `${nextDate(baseDate, groupRoundNumber - 1)} 14:00`,
          endTime: `${nextDate(baseDate, groupRoundNumber - 1)} 18:00`,
          status: 'upcoming',
          matches,
          stageId: stage.stageId,
          stageType: stage.type,
          groupIndex: g,
        });

        // 胜者链路：本轮胜者 → 下一WB轮
        if (wr < wbRoundCount - 1) {
          matches.forEach((game, i) => {
            const nextGameId = `${match.id}-S${stageIndex + 1}-WB-R${wr + 2}-G${Math.floor(i / 2) + 1}-Gr${g}`;
            game.nextMatchId = nextGameId;
            game.nextSlot = i % 2 === 0 ? 'A' : 'B';
          });
        }

        wbRoundGames.push(matches);
        groupRoundNumber++;
      }
    }

    // ── 败者组 ──
    // 败者组轮数 = 2*(log2(bracketSize)-1)
    // 奇数轮：接收WB落败者（从高到低WB轮依次进入）+ 内部胜者配对
    // 偶数轮：纯内部对决
    if (bracketSize >= 4) {
      const lbTotalRounds = 2 * (Math.log2(bracketSize) - 1);
      const lbRoundGames: MatchGame[][] = [];

      for (let lb = 0; lb < lbTotalRounds; lb++) {
        // 当前LB轮比赛数
        const lbMatchCount = Math.max(1, bracketSize / Math.pow(2, Math.floor(lb / 2) + 2));
        const matches: MatchGame[] = [];

        for (let i = 0; i < lbMatchCount; i++) {
          const gameId = `${match.id}-S${stageIndex + 1}-LB-R${lb + 1}-G${i + 1}-Gr${g}`;
          const slotA = `第${g + 1}组-LB${lb}-A${i + 1}`;
          const slotB = `第${g + 1}组-LB${lb}-B${i + 1}`;
          matches.push({
            ...createPlaceholderGame(match.id, `S${stageIndex + 1}-LBR${lb + 1}`, i, slotA, slotB, `${nextDate(baseDate, groupRoundNumber - 1)} 14:00`, stage.defaultFormat),
            gameId,
          });
        }

        const lbNames = ['首轮', '次轮', '第三轮', '第四轮', '第五轮', '第六轮', '第七轮', '决赛'];
        const name = lb === lbTotalRounds - 1 ? '败者组决赛' : `败者组${lbNames[lb] || `第${lb + 1}轮`}`;
        rounds.push({
          roundId: `${match.id}-S${stageIndex + 1}-LBR${lb + 1}-Gr${g}`,
          matchId: match.id,
          roundName: `${stage.name} · 第${g + 1}组 · ${name}`,
          roundNumber: groupRoundNumber,
          stage: 'knockout',
          startTime: `${nextDate(baseDate, groupRoundNumber - 1)} 14:00`,
          endTime: `${nextDate(baseDate, groupRoundNumber - 1)} 18:00`,
          status: 'upcoming',
          matches,
          stageId: stage.stageId,
          stageType: stage.type,
          groupIndex: g,
        });

        // LB内部胜者晋级链
        // 下一LB轮比赛数：与本轮相同(1:1)或减半(2:1)
        if (lb < lbTotalRounds - 1) {
          const nextLbMatchCount = Math.max(
            1,
            bracketSize / Math.pow(2, Math.floor((lb + 1) / 2) + 2)
          );
          const isSameCount = nextLbMatchCount === matches.length;
          matches.forEach((game, i) => {
            // 1:1 时直接对应同序号下一场(slot A)；2:1 时两场合并一场(交替 A/B)
            const nextGameIndex = isSameCount ? i : Math.floor(i / 2);
            const nextGameId = `${match.id}-S${stageIndex + 1}-LB-R${lb + 2}-G${nextGameIndex + 1}-Gr${g}`;
            game.nextMatchId = nextGameId;
            game.nextSlot = isSameCount ? 'A' : (i % 2 === 0 ? 'A' : 'B');
          });
        }

        lbRoundGames.push(matches);
        groupRoundNumber++;
      }

      // 建立 WB各轮负者 → LB对应轮次的链路
      // 标准双败路由规则：
      //   WB R1 负者 → LB R1 (lbIdx=0)：4负者填2场，每场各占 slot A / slot B
      //   WB R2 负者 → LB R2 (lbIdx=1)：slot B（slot A 已是 LB R1 胜者）
      //   WB R3 负者 → LB R4 (lbIdx=3)：slot B（跳过纯 LB 内战轮）
      //   WB Rk 负者 → LB R(2k-1) (lbIdx=2k-1, k>=2)
      wbRoundGames.forEach((wbMatches, wr) => {
        // wr=0 → idx=0；wr>=1 → idx=2*wr-1（跳过纯 LB 内战轮）
        const lbIdx = wr === 0 ? 0 : 2 * wr - 1;
        const lbRound = lbRoundGames[lbIdx < lbRoundGames.length ? lbIdx : lbRoundGames.length - 1];
        if (!lbRound) return;

        // ratio > 1：WB R1 情形，LB R1 每场两个槽位都来自 WB 负者（交替 A/B）
        // ratio == 1：WB R2+ 情形，slot A 已是上轮 LB 胜者，WB 负者进 slot B
        const ratio = lbRound.length > 0 ? wbMatches.length / lbRound.length : 1;
        wbMatches.forEach((wbGame, i) => {
          const lbGame = lbRound[Math.floor(i / Math.max(1, ratio))];
          if (!lbGame) return;
          wbGame.loserNextMatchId = lbGame.gameId;
          wbGame.loserNextSlot = ratio > 1 ? (i % 2 === 0 ? 'A' : 'B') : 'B';
        });
      });
    }

    // ── 总决赛 ──
    const deRules = stage.formatRules.doubleElimination;
    const gfFormat = String(deRules?.grandFinalBestOf ?? stage.defaultFormat);
    const grandFinalReset = deRules?.grandFinalReset ?? false;

    const gfGameId = `${match.id}-S${stageIndex + 1}-GF-Gr${g}`;
    const wbFinalGame = wbRoundGames[wbRoundGames.length - 1]?.[0];
    const lbFinalRound = rounds.find((r) => r.roundName.includes('败者组决赛') && r.groupIndex === g);
    const lbFinalGame = lbFinalRound?.matches[0];

    const gfGame: MatchGame = {
      ...createPlaceholderGame(match.id, `S${stageIndex + 1}-GF`, 0, `第${g + 1}组-胜者组冠军`, `第${g + 1}组-败者组冠军`, `${nextDate(baseDate, groupRoundNumber - 1)} 14:00`, gfFormat),
      gameId: gfGameId,
    };
    if (wbFinalGame) { wbFinalGame.nextMatchId = gfGameId; wbFinalGame.nextSlot = 'A'; }
    if (lbFinalGame) { lbFinalGame.nextMatchId = gfGameId; lbFinalGame.nextSlot = 'B'; }

    rounds.push({
      roundId: `${match.id}-S${stageIndex + 1}-GF-Gr${g}`,
      matchId: match.id,
      roundName: `${stage.name} · 第${g + 1}组 · 总决赛`,
      roundNumber: groupRoundNumber,
      stage: 'final',
      startTime: `${nextDate(baseDate, groupRoundNumber - 1)} 14:00`,
      endTime: `${nextDate(baseDate, groupRoundNumber - 1)} 18:00`,
      status: 'upcoming',
      matches: [gfGame],
      stageId: stage.stageId,
      stageType: stage.type,
      groupIndex: g,
    });
    groupRoundNumber++;

    // ── 总决赛重制局（仅在 LB 冠军赢第一场时启用）──
    if (grandFinalReset) {
      const gfResetGameId = `${match.id}-S${stageIndex + 1}-GF-Reset-Gr${g}`;
      const gfResetGame: MatchGame = {
        ...createPlaceholderGame(match.id, `S${stageIndex + 1}-GF-Reset`, 0, `第${g + 1}组-胜者组冠军`, `第${g + 1}组-败者组冠军`, '', gfFormat),
        gameId: gfResetGameId,
        isResetGame: true,
      };
      rounds.push({
        roundId: `${match.id}-S${stageIndex + 1}-GF-Reset-Gr${g}`,
        matchId: match.id,
        roundName: `${stage.name} · 第${g + 1}组 · 总决赛重制局`,
        roundNumber: groupRoundNumber,
        stage: 'final',
        startTime: '',
        endTime: '',
        status: 'upcoming',
        matches: [gfResetGame],
        stageId: stage.stageId,
        stageType: stage.type,
        groupIndex: g,
        isResetRound: true,
      });
      groupRoundNumber++;
    }

    roundNumber = Math.max(roundNumber, groupRoundNumber);
  }

  return rounds;
}

function generateSwissStage(
  match: MatchItem,
  stage: TournamentStage,
  stageIndex: number,
  baseDate: string,
  roundOffset: number,
  slots: string[]
): MatchRound[] {
  const rounds: MatchRound[] = [];
  const groupCount = stage.group.enabled ? stage.group.groupCount : (stage.config.groupCount || 1);
  const groupSize = stage.group.enabled
    ? stage.group.teamsPerGroup
    : Math.floor(stage.teamsIn / groupCount);
  const slotList = slots.length >= stage.teamsIn ? slots : generatePlaceholderSlots(stage.teamsIn);
  const round1Pairing = stage.formatRules.swiss?.round1Pairing ?? 'SEED_HIGH_LOW';
  let roundNumber = roundOffset + 1;

  for (let g = 0; g < groupCount; g++) {
    const baseIdx = g * groupSize;
    const rawSlots: string[] = [];
    for (let i = 0; i < groupSize; i++) {
      if (slotList[baseIdx + i]) rawSlots.push(slotList[baseIdx + i]);
    }

    // 第1轮按配对策略重排种子顺序，生成配对列表
    // 后续轮次由 pairSwissRound 动态生成，这里只生成第1轮占位
    const orderedForR1 = applyRound1Pairing(rawSlots, round1Pairing);

    // 只生成第1轮占位赛程；后续轮次在所有队伍分配完毕后由运营手动触发配对
    const matches: MatchGame[] = [];
    const matchCount = Math.floor(orderedForR1.length / 2);
    for (let i = 0; i < matchCount; i++) {
      const slotA = orderedForR1[i * 2];
      const slotB = orderedForR1[i * 2 + 1];
      matches.push(createPlaceholderGame(match.id, `S${stageIndex + 1}-R${roundNumber}`, i, slotA, slotB, `${nextDate(baseDate, roundNumber - 1)} 14:00`, stage.defaultFormat));
    }
    // 奇数队轮空
    if (orderedForR1.length % 2 !== 0) {
      const byeTeam = orderedForR1[orderedForR1.length - 1];
      matches.push({
        ...createPlaceholderGame(match.id, `S${stageIndex + 1}-R${roundNumber}`, matchCount, byeTeam, 'BYE', `${nextDate(baseDate, roundNumber - 1)} 14:00`, stage.defaultFormat),
        teamBIsPlaceholder: true,
        slotB: 'BYE',
      });
    }

    rounds.push({
      roundId: `${match.id}-S${stageIndex + 1}-R${roundNumber}`,
      matchId: match.id,
      roundName: `${stage.name} · 第${g + 1}组 · 第1轮`,
      roundNumber,
      stage: 'group',
      startTime: `${nextDate(baseDate, roundNumber - 1)} 14:00`,
      endTime: `${nextDate(baseDate, roundNumber - 1)} 18:00`,
      status: 'upcoming',
      matches,
      stageId: stage.stageId,
      stageType: stage.type,
      groupIndex: g,
    });
    roundNumber++;
  }

  return rounds;
}

/** 按第1轮配对策略重排队伍顺序，返回依次配对的数组（index 0vs1, 2vs3…） */
function applyRound1Pairing(slots: string[], policy: SwissRound1Pairing): string[] {
  const n = slots.length;
  if (n === 0) return [];
  if (policy === 'SEED_ADJACENT') {
    // 1vs2, 3vs4, 5vs6… 直接顺序
    return [...slots];
  }
  if (policy === 'SEED_HIGH_LOW') {
    // 1vsN, 2vs(N-1), 3vs(N-2)…
    const paired: string[] = [];
    for (let i = 0; i < Math.floor(n / 2); i++) {
      paired.push(slots[i], slots[n - 1 - i]);
    }
    if (n % 2 !== 0) paired.push(slots[Math.floor(n / 2)]);
    return paired;
  }
  // RANDOM
  const shuffled = [...slots];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

export function validateStages(stages: TournamentStage[], maxTeams: number, strict: boolean = true): string | null {
  if (!stages.length) return '至少需要一个阶段';
  const sorted = [...stages].sort((a, b) => a.order - b.order);

  if (strict && sorted[0].entrant.entrantCount !== maxTeams) {
    return `阶段 1 参赛队伍数 (${sorted[0].entrant.entrantCount}) 应等于赛事队伍上限 (${maxTeams})`;
  }

  for (let i = 0; i < sorted.length; i++) {
    const stage = sorted[i];
    const entrantCount = stage.entrant.entrantCount;
    if (entrantCount < 2) return `阶段 ${i + 1} 参赛队伍数不能少于 2`;
    if (entrantCount > MAX_TEAMS_LIMIT) {
      return `阶段 ${i + 1} 参赛队伍数 (${entrantCount}) 超过系统上限 (${MAX_TEAMS_LIMIT})`;
    }
    if (strict && entrantCount > maxTeams) {
      return `阶段 ${i + 1} 参赛队伍数 (${entrantCount}) 不能超过赛事上限 (${maxTeams})`;
    }
    if (stage.group.enabled) {
      const groupCount = stage.group.groupCount;
      const teamsPerGroup = stage.group.teamsPerGroup;
      if (groupCount < 1) return `阶段 ${i + 1} 分组数不能少于 1`;
      if (teamsPerGroup < 2) return `阶段 ${i + 1} 每组队伍数不能少于 2`;
      if (teamsPerGroup > MAX_TEAMS_PER_GROUP) {
        return `阶段 ${i + 1} 每组队伍数 (${teamsPerGroup}) 超过上限 ${MAX_TEAMS_PER_GROUP}`;
      }
      if (!stage.group.allowUnevenGroups && groupCount * teamsPerGroup < entrantCount) {
        return `阶段 ${i + 1} 分组无法容纳所有队伍，请增加每组人数或允许不均匀分组`;
      }
    }
  }

  // 仅做轻量校验：各阶段内部结构合法即可；晋级通道路由由用户自行维护

  return null;
}

export function generateMatchRounds(match: MatchItem, stages?: TournamentStage[]): MatchRound[] {
  const maxTeams = Math.min(Math.max(1, match.maxTeams || match.cap), MAX_TEAMS_LIMIT);
  const baseDate = match.matchStart || '06-15';

  if (stages && stages.length > 0) {
    const sortedStages = [...stages].sort((a, b) => a.order - b.order);
    const error = validateStages(sortedStages, maxTeams, false);
    if (error) {
      console.warn(`[generateMatchRounds] ${error}`);
      return [];
    }

    const rounds: MatchRound[] = [];
    let roundOffset = 0;
    const availableSlots = generatePlaceholderSlots(maxTeams);

    sortedStages.forEach((stage, index) => {
      // 第一阶段用报名占位槽（A1/A2...），后续阶段用晋级占位槽（晋级席位1/2...）
      const stageSlots = index === 0
        ? availableSlots
        : Array.from({ length: stage.teamsIn }, (_, i) => `晋级席位${i + 1}`);
      let stageRounds: MatchRound[] = [];

      switch (stage.type) {
        case 'ROUND_ROBIN':
          stageRounds = generateRoundRobinStage(match, stage, index, baseDate, roundOffset, stageSlots);
          break;
        case 'SINGLE_ELIMINATION':
          stageRounds = generateSingleEliminationStage(match, stage, index, baseDate, roundOffset, stageSlots);
          break;
        case 'DOUBLE_ELIMINATION':
          stageRounds = generateDoubleEliminationStage(match, stage, index, baseDate, roundOffset, stageSlots);
          break;
        case 'SWISS':
          stageRounds = generateSwissStage(match, stage, index, baseDate, roundOffset, stageSlots);
          break;
        case 'FREE':
          // 自由排布：不预生成任何轮次，由用户手动创建比赛
          stageRounds = [];
          break;
      }

      rounds.push(...stageRounds);
      roundOffset += stageRounds.length;
    });

    return rounds;
  }

  // 原有单 bracket 兼容逻辑
  const powerOfTwo = Math.max(2, Math.pow(2, Math.ceil(Math.log2(maxTeams))));
  const slots = generatePlaceholderSlots(maxTeams);
  const rounds: MatchRound[] = [];
  let roundNumber = 1;

  if (match.bracket === '单败淘汰') {
    let teams = powerOfTwo;
    while (teams >= 2) {
      const matchCount = teams / 2;
      const matches: MatchGame[] = [];
      for (let i = 0; i < matchCount; i++) {
        const slotA = slots[i * 2];
        const slotB = slots[i * 2 + 1];
        matches.push(createPlaceholderGame(match.id, `R${roundNumber}`, i, slotA, slotB, `${nextDate(baseDate, roundNumber - 1)} 14:00`));
      }
      let roundName = `${teams}强赛`;
      if (teams === 2) roundName = '决赛';
      else if (teams === 4) roundName = '半决赛';
      rounds.push({
        roundId: `${match.id}-R${roundNumber}`,
        matchId: match.id,
        roundName,
        roundNumber,
        stage: teams === 2 ? 'final' : 'knockout',
        startTime: `${nextDate(baseDate, roundNumber - 1)} 14:00`,
        endTime: `${nextDate(baseDate, roundNumber - 1)} 18:00`,
        status: 'upcoming',
        matches,
      });
      teams /= 2;
      roundNumber++;
    }
  } else if (match.bracket === '循环赛') {
    const matches: MatchGame[] = [];
    const pairCount = Math.floor(maxTeams / 2);
    for (let i = 0; i < pairCount; i++) {
      const slotA = slots[i * 2];
      const slotB = slots[i * 2 + 1];
      matches.push(createPlaceholderGame(match.id, 'R1', i, slotA, slotB, `${baseDate} 14:00`));
    }
    rounds.push({
      roundId: `${match.id}-R1`,
      matchId: match.id,
      roundName: '循环赛第1轮',
      roundNumber: 1,
      stage: 'group',
      startTime: `${baseDate} 14:00`,
      endTime: `${baseDate} 18:00`,
      status: 'upcoming',
      matches,
    });
  } else if (match.bracket === '小组+淘汰') {
    const groupSize = 4;
    const groupEligible = Math.max(groupSize, Math.floor(maxTeams / groupSize) * groupSize);
    const groupCount = Math.max(1, Math.floor(groupEligible / groupSize));
    const groupMatches: MatchGame[] = [];
    for (let g = 0; g < groupCount; g++) {
      const baseIdx = g * groupSize;
      const groupSlots = [
        slots[baseIdx],
        slots[baseIdx + 1],
        slots[baseIdx + 2],
        slots[baseIdx + 3],
      ].filter(Boolean);
      for (let i = 0; i < groupSlots.length; i++) {
        for (let j = i + 1; j < groupSlots.length; j++) {
          groupMatches.push(
            createPlaceholderGame(match.id, 'R1', groupMatches.length, groupSlots[i], groupSlots[j], `${baseDate} 14:00`)
          );
        }
      }
    }
    rounds.push({
      roundId: `${match.id}-R1`,
      matchId: match.id,
      roundName: '小组赛',
      roundNumber: 1,
      stage: 'group',
      startTime: `${baseDate} 14:00`,
      endTime: `${baseDate} 18:00`,
      status: 'upcoming',
      matches: groupMatches,
    });
    const knockoutTeams = Math.max(2, groupCount * 2);
    let teams = knockoutTeams;
    let koRound = 2;
    while (teams >= 2) {
      const matchCount = teams / 2;
      const matches: MatchGame[] = [];
      for (let i = 0; i < matchCount; i++) {
        const slotA = `晋级${i * 2 + 1}`;
        const slotB = `晋级${i * 2 + 2}`;
        matches.push(createPlaceholderGame(match.id, `R${koRound}`, i, slotA, slotB, `${nextDate(baseDate, koRound - 1)} 14:00`));
      }
      let roundName = `${teams}强赛`;
      if (teams === 2) roundName = '决赛';
      else if (teams === 4) roundName = '半决赛';
      rounds.push({
        roundId: `${match.id}-R${koRound}`,
        matchId: match.id,
        roundName,
        roundNumber: koRound,
        stage: teams === 2 ? 'final' : 'knockout',
        startTime: `${nextDate(baseDate, koRound - 1)} 14:00`,
        endTime: `${nextDate(baseDate, koRound - 1)} 18:00`,
        status: 'upcoming',
        matches,
      });
      teams /= 2;
      koRound++;
    }
  } else if (match.bracket === '双败淘汰') {
    const wbMatches: MatchGame[] = [];
    const wb1Count = powerOfTwo / 2;
    for (let i = 0; i < wb1Count; i++) {
      const slotA = slots[i * 2];
      const slotB = slots[i * 2 + 1];
      wbMatches.push(createPlaceholderGame(match.id, 'R1', i, slotA, slotB, `${baseDate} 14:00`));
    }
    rounds.push({
      roundId: `${match.id}-R1`,
      matchId: match.id,
      roundName: '胜者组首轮',
      roundNumber: 1,
      stage: 'knockout',
      startTime: `${baseDate} 14:00`,
      endTime: `${baseDate} 18:00`,
      status: 'upcoming',
      matches: wbMatches,
    });
    if (powerOfTwo >= 4) {
      const wb2Matches: MatchGame[] = [];
      const wb2Count = powerOfTwo / 4;
      for (let i = 0; i < wb2Count; i++) {
        wb2Matches.push(createPlaceholderGame(match.id, 'R2', i, `胜者${i * 2 + 1}`, `胜者${i * 2 + 2}`, `${nextDate(baseDate, 1)} 14:00`));
      }
      rounds.push({
        roundId: `${match.id}-R2`,
        matchId: match.id,
        roundName: '胜者组次轮',
        roundNumber: 2,
        stage: 'knockout',
        startTime: `${nextDate(baseDate, 1)} 14:00`,
        endTime: `${nextDate(baseDate, 1)} 18:00`,
        status: 'upcoming',
        matches: wb2Matches,
      });
    }
    rounds.push({
      roundId: `${match.id}-R${roundNumber + 1}`,
      matchId: match.id,
      roundName: '决赛',
      roundNumber: roundNumber + 1,
      stage: 'final',
      startTime: `${nextDate(baseDate, 2)} 14:00`,
      endTime: `${nextDate(baseDate, 2)} 18:00`,
      status: 'upcoming',
      matches: [createPlaceholderGame(match.id, `R${roundNumber + 1}`, 0, '胜者组冠军', '败者组冠军', `${nextDate(baseDate, 2)} 14:00`)],
    });
  } else if (match.bracket === '瑞士轮') {
    const roundCount = Math.max(1, Math.ceil(Math.log2(maxTeams)));
    for (let r = 1; r <= roundCount; r++) {
      const matches: MatchGame[] = [];
      const matchCount = Math.floor(maxTeams / 2);
      for (let i = 0; i < matchCount; i++) {
        const slotA = slots[i * 2] || `T${i * 2 + 1}`;
        const slotB = slots[i * 2 + 1] || `T${i * 2 + 2}`;
        matches.push(createPlaceholderGame(match.id, `R${r}`, i, slotA, slotB, `${nextDate(baseDate, r - 1)} 14:00`));
      }
      rounds.push({
        roundId: `${match.id}-R${r}`,
        matchId: match.id,
        roundName: `瑞士轮第${r}轮`,
        roundNumber: r,
        stage: 'group',
        startTime: `${nextDate(baseDate, r - 1)} 14:00`,
        endTime: `${nextDate(baseDate, r - 1)} 18:00`,
        status: 'upcoming',
        matches,
      });
    }
  }

  return rounds;
}

// ============ 轮次数据合并（保留已有路由链路，覆盖比分/队伍）============
// 用于 LOAD_MATCH：用新生成的 fresh rounds 提供正确的 loserNextMatchId 链路，
// 再把 saved rounds 的比分/队伍/状态数据叠加回去，保证旧存档也能正确传播负者。
export function mergeRoundData(fresh: MatchRound[], saved: MatchRound[]): MatchRound[] {
  // 建立 saved game 映射（只保留用户录入/编排的数据字段）
  const savedMap = new Map<string, Partial<MatchGame>>();
  saved.forEach((r) =>
    r.matches.forEach((g) => {
      // 只在队伍名实际存在且已完成分配（非占位）时才恢复队伍信息，
      // 防止旧版 bug 留下的 teamA:undefined + teamAIsPlaceholder:false
      // 通过扩展运算符覆盖掉 fresh 数据中正确的占位信息。
      savedMap.set(g.gameId, {
        ...(g.teamA && !g.teamAIsPlaceholder ? { teamA: g.teamA, teamAIsPlaceholder: false } : {}),
        ...(g.teamB && !g.teamBIsPlaceholder ? { teamB: g.teamB, teamBIsPlaceholder: false } : {}),
        scoreA: g.scoreA,
        scoreB: g.scoreB,
        winner: g.winner,
        status: g.status,
        startTime: g.startTime,
        format: g.format,
        seedA: g.seedA,
        seedB: g.seedB,
      });
    })
  );

  const freshIds = new Set<string>();
  fresh.forEach((r) => r.matches.forEach((g) => freshIds.add(g.gameId)));

  // saved 中只存在但 fresh 中没有的轮次（Swiss 额外轮/手动添加场次）原样保留
  const extraRounds = saved.filter((r) => r.matches.every((g) => !freshIds.has(g.gameId)));

  const merged = fresh.map((round) => ({
    ...round,
    matches: round.matches.map((game) => {
      const s = savedMap.get(game.gameId);
      return s ? { ...game, ...s } : game;
    }),
  }));

  return [...merged, ...extraRounds];
}

// ============ 重放所有已完成场次的胜负传播 ============
// 在 mergeRoundData 之后调用：按轮次顺序扫描已完成场次，
// 用新鲜的 loserNextMatchId/nextMatchId 链路将负者重新推入正确的 LB 槽位，
// 修复旧存档因路由 bug 导致的 LB 队伍缺失/错位问题。
export function repropagateAllRoutes(rounds: MatchRound[]): MatchRound[] {
  let current = rounds;
  // 按轮次顺序处理，确保 WB R1 先于 WB R2 传播
  const sorted = [...rounds].sort((a, b) => a.roundNumber - b.roundNumber);

  for (const round of sorted) {
    for (const origGame of round.matches) {
      if (origGame.status !== 'completed' || !origGame.winner) continue;
      if (origGame.teamAIsPlaceholder || origGame.teamBIsPlaceholder) continue;

      // 始终从 current 读取最新版游戏（确保 loserNextMatchId 是 fresh 的）
      const currentRound = current.find((r) => r.roundId === round.roundId);
      const game = currentRound?.matches.find((g) => g.gameId === origGame.gameId);
      if (!game || !game.winner) continue;

      const winnerName = game.winner;
      const loserName = game.teamA === winnerName ? game.teamB : game.teamA;
      const winnerSeed = game.teamA === winnerName ? game.seedA : game.seedB;
      const loserSeed  = game.teamA === winnerName ? game.seedB : game.seedA;

      // 推胜者（携带种子）
      if (game.nextMatchId) {
        current = current.map((r) => ({
          ...r,
          matches: r.matches.map((g) => {
            if (g.gameId !== game.nextMatchId) return g;
            return game.nextSlot === 'A'
              ? { ...g, teamA: winnerName, teamAIsPlaceholder: false, seedA: winnerSeed }
              : { ...g, teamB: winnerName, teamBIsPlaceholder: false, seedB: winnerSeed };
          }),
        }));
      }
      // 推负者到 LB（携带种子）
      if (game.loserNextMatchId && loserName) {
        current = current.map((r) => ({
          ...r,
          matches: r.matches.map((g) => {
            if (g.gameId !== game.loserNextMatchId) return g;
            return game.loserNextSlot === 'A'
              ? { ...g, teamA: loserName, teamAIsPlaceholder: false, seedA: loserSeed }
              : { ...g, teamB: loserName, teamBIsPlaceholder: false, seedB: loserSeed };
          }),
        }));
      }
    }
  }

  return current;
}

// ============ 淘汰赛晋级传播 ============
export function propagateWinner(
  rounds: MatchRound[],
  roundId: string,
  gameId: string,
  winnerTeamName: string
): MatchRound[] {
  const round = rounds.find((r) => r.roundId === roundId);
  const game = round?.matches.find((g) => g.gameId === gameId);
  if (!game) return rounds;

  // 计算负者队伍名及双方种子编号
  const loserTeamName = game.teamA === winnerTeamName ? game.teamB : game.teamA;
  const winnerSeed = game.teamA === winnerTeamName ? game.seedA : game.seedB;
  const loserSeed  = game.teamA === winnerTeamName ? game.seedB : game.seedA;

  return rounds.map((r) => ({
    ...r,
    matches: r.matches.map((g) => {
      // 推胜者（携带种子编号）
      if (game.nextMatchId && g.gameId === game.nextMatchId) {
        return game.nextSlot === 'A'
          ? { ...g, teamA: winnerTeamName, teamAIsPlaceholder: false, seedA: winnerSeed }
          : { ...g, teamB: winnerTeamName, teamBIsPlaceholder: false, seedB: winnerSeed };
      }
      // 推负者（双败/季军赛，携带种子编号）
      if (game.loserNextMatchId && g.gameId === game.loserNextMatchId && loserTeamName) {
        return game.loserNextSlot === 'A'
          ? { ...g, teamA: loserTeamName, teamAIsPlaceholder: false, seedA: loserSeed }
          : { ...g, teamB: loserTeamName, teamBIsPlaceholder: false, seedB: loserSeed };
      }
      return g;
    }),
  }));
}

function isStaticPlaceholderSlot(game: MatchGame, side: 'A' | 'B'): boolean {
  const slot = side === 'A' ? game.slotA : game.slotB;
  // 只有明确标记为 'BYE' 的槽才触发自动胜。
  // 循环赛/淘汰赛的组位码（A1、W2 等）不应触发，否则会在只有一方队伍时误判自动完赛。
  return slot === 'BYE';
}

// 自动处理淘汰赛首轮轮空：一边为真实队伍、一边为静态空位时，直接判真实队伍获胜并晋级
export function applyByeWins(rounds: MatchRound[]): MatchRound[] {
  let current = rounds;
  let changed = true;
  while (changed) {
    changed = false;
    for (const round of current) {
      for (const game of round.matches) {
        if (game.status === 'completed' || game.status === 'cancelled') continue;
        const aReal = !game.teamAIsPlaceholder;
        const bReal = !game.teamBIsPlaceholder;
        if (aReal === bReal) continue;

        const placeholderSide = game.teamAIsPlaceholder ? 'A' : 'B';
        if (!isStaticPlaceholderSlot(game, placeholderSide)) continue;

        const winnerName = aReal ? game.teamA : game.teamB;
        const winnerSide = aReal ? 'A' : 'B';
        const bo = game.format ? parseInt(game.format.replace('BO', ''), 10) : 1;
        const winsNeeded = Math.max(1, Math.ceil(bo / 2));

        current = current.map((r) =>
          r.roundId === round.roundId
            ? {
                ...r,
                matches: r.matches.map((g) =>
                  g.gameId === game.gameId
                    ? {
                        ...g,
                        status: 'completed' as const,
                        winner: winnerName,
                        scoreA: winnerSide === 'A' ? winsNeeded : 0,
                        scoreB: winnerSide === 'B' ? winsNeeded : 0,
                      }
                    : g
                ),
              }
            : r
        );
        current = propagateWinner(current, round.roundId, game.gameId, winnerName);
        changed = true;
      }
    }
  }
  return current;
}
export function computeRoundRobinStandings(
  rounds: MatchRound[],
  winPoints = 3,
  drawPoints = 1,
  lossPoints = 0
): GroupStanding[] {
  const stats = new Map<string, GroupStanding>();

  const ensureTeam = (name: string) => {
    if (!stats.has(name)) {
      stats.set(name, {
        teamName: name,
        played: 0,
        wins: 0,
        losses: 0,
        draws: 0,
        points: 0,
        scoreFor: 0,
        scoreAgainst: 0,
      });
    }
    return stats.get(name)!;
  };

  rounds.forEach((round) => {
    round.matches.forEach((game) => {
      if (game.status !== 'completed' || game.scoreA === undefined || game.scoreB === undefined) return;
      const a = ensureTeam(game.teamA);
      const b = ensureTeam(game.teamB);
      a.played++;
      b.played++;
      a.scoreFor += game.scoreA;
      a.scoreAgainst += game.scoreB;
      b.scoreFor += game.scoreB;
      b.scoreAgainst += game.scoreA;

      if (game.scoreA > game.scoreB) {
        a.wins++;
        a.points += winPoints;
        b.losses++;
        b.points += lossPoints;
      } else if (game.scoreA < game.scoreB) {
        b.wins++;
        b.points += winPoints;
        a.losses++;
        a.points += lossPoints;
      } else {
        a.draws++;
        b.draws++;
        a.points += drawPoints;
        b.points += drawPoints;
      }
    });
  });

  return Array.from(stats.values()).sort((a, b) => {
    if (b.points !== a.points) return b.points - a.points;
    const aNet = a.scoreFor - a.scoreAgainst;
    const bNet = b.scoreFor - b.scoreAgainst;
    if (bNet !== aNet) return bNet - aNet;
    return b.scoreFor - a.scoreFor;
  });
}

export function computeGroupStandings(
  rounds: MatchRound[],
  groupIndex: number,
  winPoints = 3,
  drawPoints = 1,
  lossPoints = 0
): GroupStanding[] {
  const groupRounds = rounds.filter((r) => r.groupIndex === groupIndex && r.stageType === 'ROUND_ROBIN');
  return computeRoundRobinStandings(groupRounds, winPoints, drawPoints, lossPoints);
}

// ============ 瑞士轮专用积分计算（含 Buchholz） ============

export function computeSwissStandings(
  rounds: MatchRound[],
  winPoints = 3,
  drawPoints = 1,
  lossPoints = 0
): GroupStanding[] {
  // 先用通用逻辑算基础积分
  const base = computeRoundRobinStandings(rounds, winPoints, drawPoints, lossPoints);
  const pointsMap = new Map<string, number>(base.map((s) => [s.teamName, s.points]));

  // 计算 Buchholz：遍历所有已完成局，累加对手当前积分
  const buchholzMap = new Map<string, number>(base.map((s) => [s.teamName, 0]));
  rounds.forEach((round) => {
    round.matches.forEach((game) => {
      if (game.status !== 'completed') return;
      const pa = pointsMap.get(game.teamA) ?? 0;
      const pb = pointsMap.get(game.teamB) ?? 0;
      if (buchholzMap.has(game.teamA)) buchholzMap.set(game.teamA, buchholzMap.get(game.teamA)! + pb);
      if (buchholzMap.has(game.teamB)) buchholzMap.set(game.teamB, buchholzMap.get(game.teamB)! + pa);
    });
  });

  return base
    .map((s) => ({ ...s, buchholz: buchholzMap.get(s.teamName) ?? 0 }))
    .sort((a, b) => {
      if (b.points !== a.points) return b.points - a.points;
      // Buchholz 次级排名
      if ((b.buchholz ?? 0) !== (a.buchholz ?? 0)) return (b.buchholz ?? 0) - (a.buchholz ?? 0);
      const aNet = a.scoreFor - a.scoreAgainst;
      const bNet = b.scoreFor - b.scoreAgainst;
      if (bNet !== aNet) return bNet - aNet;
      return b.scoreFor - a.scoreFor;
    });
}

// ============ 瑞士轮动态配对 ============

/**
 * 根据当前轮次结束后的积分，为下一轮生成配对。
 * - 按积分分组，组内相邻配对（高分打高分）
 * - 跳过已对阵过的组合（avoidRepeat）
 * - 奇数队产生轮空：选积分最低且未曾轮空的队，生成 BYE 局并自动完成
 */
export function pairSwissRound(
  matchId: string,
  stageId: string,
  stageName: string,
  groupIndex: number,
  roundNumber: number,
  completedRounds: MatchRound[],
  allTeams: string[],
  defaultFormat: string,
  byePolicy: SwissByePolicy = 'LOWEST_SCORE_NO_PREVIOUS_BYE',
  avoidRepeat = true,
  winPoints = 3,
  drawPoints = 1,
  lossPoints = 0
): MatchRound {
  const standings = computeSwissStandings(completedRounds, winPoints, drawPoints, lossPoints);

  // 收集已对阵历史
  const played = new Map<string, Set<string>>();
  const hadBye = new Set<string>();
  completedRounds.forEach((r) => {
    r.matches.forEach((g) => {
      if (g.teamBIsPlaceholder && g.slotB === 'BYE') { hadBye.add(g.teamA); return; }
      if (g.teamAIsPlaceholder && g.slotA === 'BYE') { hadBye.add(g.teamB); return; }
      if (!played.has(g.teamA)) played.set(g.teamA, new Set());
      if (!played.has(g.teamB)) played.set(g.teamB, new Set());
      played.get(g.teamA)!.add(g.teamB);
      played.get(g.teamB)!.add(g.teamA);
    });
  });

  // 参赛队按积分排序（standings 已排好；用 allTeams 补充未出场队伍）
  const standingNames = standings.map((s) => s.teamName);
  const remainingTeams = allTeams.filter((t) => !standingNames.includes(t));
  const ordered = [...standingNames, ...remainingTeams];

  // 处理奇数轮空
  let teamsForPairing = [...ordered];
  let byeTeam: string | null = null;
  if (teamsForPairing.length % 2 !== 0) {
    // 选轮空队：积分最低且未曾轮空，否则随机
    const candidates = byePolicy === 'LOWEST_SCORE_NO_PREVIOUS_BYE'
      ? [...teamsForPairing].reverse().filter((t) => !hadBye.has(t))
      : teamsForPairing.filter((t) => !hadBye.has(t)).sort(() => Math.random() - 0.5);
    byeTeam = candidates[0] ?? teamsForPairing[teamsForPairing.length - 1];
    teamsForPairing = teamsForPairing.filter((t) => t !== byeTeam);
  }

  // 配对：贪心相邻 + 避免重复对阵
  const paired = new Set<string>();
  const pairs: [string, string][] = [];

  for (let i = 0; i < teamsForPairing.length; i++) {
    const a = teamsForPairing[i];
    if (paired.has(a)) continue;
    // 找最近未对阵的对手
    let found = false;
    for (let j = i + 1; j < teamsForPairing.length; j++) {
      const b = teamsForPairing[j];
      if (paired.has(b)) continue;
      if (avoidRepeat && played.get(a)?.has(b)) continue;
      pairs.push([a, b]);
      paired.add(a);
      paired.add(b);
      found = true;
      break;
    }
    // 如果所有候选都打过，允许重复（避免死锁）
    if (!found) {
      for (let j = i + 1; j < teamsForPairing.length; j++) {
        const b = teamsForPairing[j];
        if (paired.has(b)) continue;
        pairs.push([a, b]);
        paired.add(a);
        paired.add(b);
        break;
      }
    }
  }

  const startTime = `${nextDate(new Date().toISOString().slice(0, 10), roundNumber - 1)} 14:00`;
  const matches: MatchGame[] = pairs.map(([a, b], idx) => ({
    gameId: `${matchId}-S-G${groupIndex}-R${roundNumber}-M${idx + 1}`,
    teamA: a,
    teamB: b,
    slotA: a,
    slotB: b,
    teamAIsPlaceholder: false,
    teamBIsPlaceholder: false,
    startTime,
    status: 'scheduled',
    format: defaultFormat,
  }));

  // 轮空局
  if (byeTeam) {
    matches.push({
      gameId: `${matchId}-S-G${groupIndex}-R${roundNumber}-BYE`,
      teamA: byeTeam,
      teamB: 'BYE',
      slotA: byeTeam,
      slotB: 'BYE',
      teamAIsPlaceholder: false,
      teamBIsPlaceholder: true,
      scoreA: 1,
      scoreB: 0,
      winner: byeTeam,
      startTime,
      status: 'completed',
      format: defaultFormat,
    });
  }

  return {
    roundId: `${matchId}-S-G${groupIndex}-R${roundNumber}`,
    matchId,
    roundName: `${stageName} · 第${groupIndex + 1}组 · 第${roundNumber}轮`,
    roundNumber,
    stage: 'group',
    startTime,
    endTime: startTime.replace('14:00', '18:00'),
    status: 'upcoming',
    matches,
    stageId,
    stageType: 'SWISS',
    groupIndex,
  };
}

export function promoteWinners(
  rounds: MatchRound[],
  stages: TournamentStage[]
): MatchRound[] {
  if (!rounds.length || !stages.length) return rounds;
  const sortedStages = [...stages].sort((a, b) => a.order - b.order);
  let next = [...rounds];

  sortedStages.forEach((stage, index) => {
    if (index === sortedStages.length - 1) return;
    const nextStage = sortedStages[index + 1];
    const groupCount = stage.group.enabled ? stage.group.groupCount : (stage.config.groupCount || 1);
    const qualifierPerGroup = stage.config.qualifierPerGroup || 1;
    const winPoints = stage.config.winPoints ?? 3;
    const drawPoints = stage.config.drawPoints ?? 1;
    const lossPoints = stage.config.lossPoints ?? 0;

    const promoted: string[] = [];
    for (let g = 0; g < groupCount; g++) {
      const standings = computeGroupStandings(next, g, winPoints, drawPoints, lossPoints);
      const groupTeams = standings.slice(0, qualifierPerGroup).map((s) => s.teamName);
      promoted.push(...groupTeams);
    }

    // 用晋级队伍填充下一阶段占位符（仅填充仍为 placeholder 的位置）
    let teamIndex = 0;
    next = next.map((round) => {
      if (round.stageId !== nextStage.stageId) return round;
      return {
        ...round,
        matches: round.matches.map((game) => {
          const a: MatchGame = { ...game };
          if (a.teamAIsPlaceholder && teamIndex < promoted.length) {
            a.teamA = promoted[teamIndex];
            a.teamAIsPlaceholder = false;
            teamIndex++;
          }
          if (a.teamBIsPlaceholder && teamIndex < promoted.length) {
            a.teamB = promoted[teamIndex];
            a.teamBIsPlaceholder = false;
            teamIndex++;
          }
          return a;
        }),
      };
    });
  });

  return next;
}

// ============ 积分规则 ============
export interface PointRule {
  rank: number;
  points: number;
}

export const defaultPointRules: PointRule[] = [
  { rank: 1, points: 5000 },
  { rank: 2, points: 3000 },
  { rank: 3, points: 2000 },
  { rank: 4, points: 1000 },
  { rank: 5, points: 500 },
];

// ============ 成绩/积分发放记录 ============
export interface MatchResultRecord {
  id: string;
  matchId: string;
  userId: string;
  userNickname: string;
  rank: number;
  score: number;
  pointsEarned: number;
  status: 'pending' | 'confirmed';
  recordedAt?: string;
}

export const matchResultData: MatchResultRecord[] = [
  { id: 'MR-1001', matchId: '#M1018', userId: 'U-7715', userNickname: 'TeamAlpha', rank: 1, score: 95, pointsEarned: 5000, status: 'confirmed', recordedAt: '2026-05-29' },
  { id: 'MR-1002', matchId: '#M1018', userId: 'U-1109', userNickname: 'PixelHero', rank: 2, score: 88, pointsEarned: 3000, status: 'confirmed', recordedAt: '2026-05-29' },
  { id: 'MR-1003', matchId: '#M1018', userId: 'U-5543', userNickname: 'NoobMaster', rank: 3, score: 82, pointsEarned: 2000, status: 'confirmed', recordedAt: '2026-05-29' },
  { id: 'MR-1004', matchId: '#M1014', userId: 'U-3321', userNickname: 'LunaStar', rank: 1, score: 76, pointsEarned: 3000, status: 'pending' },
  { id: 'MR-1005', matchId: '#M1014', userId: 'U-7065', userNickname: 'ShadowHunter', rank: 2, score: 70, pointsEarned: 2000, status: 'pending' },
  { id: 'MR-1006', matchId: '#M1011', userId: 'U-2210', userNickname: 'DragonSlayer', rank: 1, score: 65, pointsEarned: 1500, status: 'pending' },
];

// ─── 战队管理 ────────────────────────────────────────────────────────────────

export type TeamStatus = 'active' | 'disabled';

export interface TeamMember {
  userId: string;
  nickname: string;
  role: 'captain' | 'member';
  joinedAt: string;
}

export interface TeamMatchRecord {
  matchId: string;
  matchName: string;
  game: string;
  result: '冠军' | '亚军' | '季军' | '晋级' | '淘汰' | '参赛';
  date: string;
}

export interface TeamItem {
  id: string;
  name: string;
  logo?: string;
  game: string;
  region: string;
  captainId: string;
  captainName: string;
  memberCount: number;
  matchCount: number;
  status: TeamStatus;
  createdAt: string;
  description?: string;
  members: TeamMember[];
  recentMatches: TeamMatchRecord[];
}

export const teamListData: TeamItem[] = [
  {
    id: 'T-0001', name: 'Alpha Wolves', game: 'MLBB', region: '菲律宾',
    captainId: 'U-7715', captainName: 'PlayerOne', memberCount: 5, matchCount: 12,
    status: 'active', createdAt: '2025-11-03',
    description: '来自马尼拉的职业玩家战队，专注 MLBB 赛场。',
    members: [
      { userId: 'U-7715', nickname: 'PlayerOne', role: 'captain', joinedAt: '2025-11-03' },
      { userId: 'U-1109', nickname: 'PixelHero', role: 'member', joinedAt: '2025-11-04' },
      { userId: 'U-5543', nickname: 'NoobMaster', role: 'member', joinedAt: '2025-11-05' },
      { userId: 'U-3321', nickname: 'LunaStar', role: 'member', joinedAt: '2025-11-10' },
      { userId: 'U-7065', nickname: 'ShadowHunter', role: 'member', joinedAt: '2025-11-15' },
    ],
    recentMatches: [
      { matchId: '#M1018', matchName: 'MLBB 全国公开赛 S3', game: 'MLBB', result: '冠军', date: '2026-05-28' },
      { matchId: '#M1014', matchName: 'Gainslink 积分赛 R4', game: 'MLBB', result: '亚军', date: '2026-04-15' },
      { matchId: '#M1011', matchName: 'MLBB 挑战者杯', game: 'MLBB', result: '晋级', date: '2026-03-20' },
    ],
  },
  {
    id: 'T-0002', name: 'Storm Riders', game: 'Dota 2', region: '泰国',
    captainId: 'U-2210', captainName: 'DragonSlayer', memberCount: 7, matchCount: 8,
    status: 'active', createdAt: '2025-12-18',
    members: [
      { userId: 'U-2210', nickname: 'DragonSlayer', role: 'captain', joinedAt: '2025-12-18' },
      { userId: 'U-4412', nickname: 'TigerKing', role: 'member', joinedAt: '2025-12-20' },
      { userId: 'U-8834', nickname: 'SkyBreaker', role: 'member', joinedAt: '2025-12-22' },
      { userId: 'U-6601', nickname: 'IceWolf', role: 'member', joinedAt: '2026-01-05' },
      { userId: 'U-3398', nickname: 'FireStorm', role: 'member', joinedAt: '2026-01-08' },
      { userId: 'U-9921', nickname: 'GhostBlade', role: 'member', joinedAt: '2026-01-15' },
      { userId: 'U-1127', nickname: 'NightOwl', role: 'member', joinedAt: '2026-02-01' },
    ],
    recentMatches: [
      { matchId: '#M1009', matchName: 'Dota 2 东南亚联赛', game: 'Dota 2', result: '季军', date: '2026-05-10' },
      { matchId: '#M1006', matchName: 'Gainslink 积分赛 R3', game: 'Dota 2', result: '淘汰', date: '2026-04-02' },
    ],
  },
  {
    id: 'T-0003', name: 'Phantom Squad', game: 'PUBG', region: '越南',
    captainId: 'U-5503', captainName: 'ZeroGrav', memberCount: 4, matchCount: 5,
    status: 'active', createdAt: '2026-01-09',
    members: [
      { userId: 'U-5503', nickname: 'ZeroGrav', role: 'captain', joinedAt: '2026-01-09' },
      { userId: 'U-7720', nickname: 'AceStar', role: 'member', joinedAt: '2026-01-10' },
      { userId: 'U-4480', nickname: 'BlitzRun', role: 'member', joinedAt: '2026-01-12' },
      { userId: 'U-9912', nickname: 'VoidWalker', role: 'member', joinedAt: '2026-01-20' },
    ],
    recentMatches: [
      { matchId: '#M1020', matchName: 'PUBG 东南亚公开赛', game: 'PUBG', result: '参赛', date: '2026-06-01' },
      { matchId: '#M1017', matchName: 'Gainslink PUBG 月赛', game: 'PUBG', result: '亚军', date: '2026-05-05' },
    ],
  },
  {
    id: 'T-0004', name: 'Neon Blaze', game: 'MLBB', region: '印度尼西亚',
    captainId: 'U-6631', captainName: 'NeonKnight', memberCount: 6, matchCount: 19,
    status: 'active', createdAt: '2025-09-22',
    members: [
      { userId: 'U-6631', nickname: 'NeonKnight', role: 'captain', joinedAt: '2025-09-22' },
      { userId: 'U-8810', nickname: 'RedArrow', role: 'member', joinedAt: '2025-09-25' },
      { userId: 'U-2244', nickname: 'BlueFang', role: 'member', joinedAt: '2025-10-01' },
      { userId: 'U-1165', nickname: 'WhiteStorm', role: 'member', joinedAt: '2025-10-05' },
      { userId: 'U-3377', nickname: 'GreenFlash', role: 'member', joinedAt: '2025-10-10' },
      { userId: 'U-7788', nickname: 'PurpleRain', role: 'member', joinedAt: '2025-10-18' },
    ],
    recentMatches: [
      { matchId: '#M1021', matchName: 'MLBB 全国公开赛 S4', game: 'MLBB', result: '亚军', date: '2026-06-10' },
      { matchId: '#M1018', matchName: 'MLBB 全国公开赛 S3', game: 'MLBB', result: '季军', date: '2026-05-28' },
      { matchId: '#M1015', matchName: 'Gainslink MLBB 月赛', game: 'MLBB', result: '冠军', date: '2026-04-20' },
    ],
  },
  {
    id: 'T-0005', name: 'Dark Matter', game: 'Dota 2', region: '菲律宾',
    captainId: 'U-4456', captainName: 'CryptoKing', memberCount: 5, matchCount: 3,
    status: 'disabled', createdAt: '2026-02-14',
    description: '因多次违规行为已被禁用。',
    members: [
      { userId: 'U-4456', nickname: 'CryptoKing', role: 'captain', joinedAt: '2026-02-14' },
      { userId: 'U-9988', nickname: 'SpeedDemon', role: 'member', joinedAt: '2026-02-15' },
      { userId: 'U-1234', nickname: 'IronFist', role: 'member', joinedAt: '2026-02-16' },
      { userId: 'U-5678', nickname: 'LightYear', role: 'member', joinedAt: '2026-02-20' },
      { userId: 'U-9012', nickname: 'DarkRift', role: 'member', joinedAt: '2026-02-25' },
    ],
    recentMatches: [
      { matchId: '#M1007', matchName: 'Dota 2 新人杯', game: 'Dota 2', result: '淘汰', date: '2026-03-05' },
    ],
  },
  {
    id: 'T-0006', name: 'Crimson Hawks', game: 'eFootball', region: '马来西亚',
    captainId: 'U-7741', captainName: 'KickMaster', memberCount: 3, matchCount: 7,
    status: 'active', createdAt: '2026-03-01',
    members: [
      { userId: 'U-7741', nickname: 'KickMaster', role: 'captain', joinedAt: '2026-03-01' },
      { userId: 'U-3355', nickname: 'GoalSeeker', role: 'member', joinedAt: '2026-03-03' },
      { userId: 'U-8866', nickname: 'NetBreaker', role: 'member', joinedAt: '2026-03-05' },
    ],
    recentMatches: [
      { matchId: '#M1019', matchName: 'eFootball 东南亚邀请赛', game: 'eFootball', result: '冠军', date: '2026-05-25' },
      { matchId: '#M1013', matchName: 'Gainslink eFootball 月赛', game: 'eFootball', result: '亚军', date: '2026-04-10' },
    ],
  },
  {
    id: 'T-0007', name: 'Iron Curtain', game: 'MLBB', region: '菲律宾',
    captainId: 'U-2298', captainName: 'IronWill', memberCount: 5, matchCount: 2,
    status: 'active', createdAt: '2026-05-20',
    members: [
      { userId: 'U-2298', nickname: 'IronWill', role: 'captain', joinedAt: '2026-05-20' },
      { userId: 'U-6612', nickname: 'SteelEdge', role: 'member', joinedAt: '2026-05-21' },
      { userId: 'U-4490', nickname: 'RockSolid', role: 'member', joinedAt: '2026-05-22' },
      { userId: 'U-1187', nickname: 'TitanFist', role: 'member', joinedAt: '2026-05-23' },
      { userId: 'U-8823', nickname: 'BoulderRush', role: 'member', joinedAt: '2026-05-25' },
    ],
    recentMatches: [
      { matchId: '#M1021', matchName: 'MLBB 全国公开赛 S4', game: 'MLBB', result: '淘汰', date: '2026-06-10' },
    ],
  },
  {
    id: 'T-0008', name: 'Velocity', game: 'PUBG', region: '越南',
    captainId: 'U-5512', captainName: 'SpeedForce', memberCount: 4, matchCount: 11,
    status: 'active', createdAt: '2025-10-30',
    members: [
      { userId: 'U-5512', nickname: 'SpeedForce', role: 'captain', joinedAt: '2025-10-30' },
      { userId: 'U-3344', nickname: 'TurboBoost', role: 'member', joinedAt: '2025-11-01' },
      { userId: 'U-7723', nickname: 'QuickDraw', role: 'member', joinedAt: '2025-11-05' },
      { userId: 'U-9945', nickname: 'SwiftStrike', role: 'member', joinedAt: '2025-11-10' },
    ],
    recentMatches: [
      { matchId: '#M1020', matchName: 'PUBG 东南亚公开赛', game: 'PUBG', result: '晋级', date: '2026-06-01' },
      { matchId: '#M1016', matchName: 'Gainslink PUBG 月赛', game: 'PUBG', result: '冠军', date: '2026-04-28' },
      { matchId: '#M1012', matchName: 'PUBG 新人杯', game: 'PUBG', result: '季军', date: '2026-03-15' },
    ],
  },
];

