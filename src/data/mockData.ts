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
}

export const matchListData: MatchItem[] = [
  { id: '#M1024', name: 'MLBB 夏季赛 · 小组赛', game: 'MLBB', bracket: '小组+淘汰', signupStart: '06-01', signupEnd: '06-10', matchStart: '06-15', matchEnd: '06-20', signed: 1250, cap: 2000, status: 'open' },
  { id: '#M1023', name: 'Dota 2 精英杯', game: 'Dota 2', bracket: '双败淘汰', signupStart: '05-25', signupEnd: '06-08', matchStart: '06-12', matchEnd: '06-18', signed: 680, cap: 800, status: 'closing' },
  { id: '#M1022', name: 'PUBG 周末挑战赛', game: 'PUBG', bracket: '单败淘汰', signupStart: '05-28', signupEnd: '06-04', matchStart: '06-05', matchEnd: '06-06', signed: 320, cap: 500, status: 'live' },
  { id: '#M1021', name: 'eFootball 杯赛 · 8强', game: 'eFootball', bracket: '单败淘汰', signupStart: '05-20', signupEnd: '06-05', matchStart: '06-07', matchEnd: '06-10', signed: 128, cap: 128, status: 'live' },
  { id: '#M1020', name: 'MLBB 新秀赛', game: 'MLBB', bracket: '循环赛', signupStart: '06-05', signupEnd: '06-12', matchStart: '06-18', matchEnd: '06-25', signed: 45, cap: 80, status: 'open' },
  { id: '#M1019', name: 'Dota 2 友谊赛', game: 'Dota 2', bracket: '单败淘汰', signupStart: '05-15', signupEnd: '05-25', matchStart: '05-28', matchEnd: '05-30', signed: 256, cap: 300, status: 'ended' },
  { id: '#M1018', name: 'PUBG 月度争霸赛', game: 'PUBG', bracket: '小组+淘汰', signupStart: '05-01', signupEnd: '05-20', matchStart: '05-22', matchEnd: '05-28', signed: 890, cap: 1000, status: 'ended' },
  { id: '#M1017', name: 'MLBB 城市赛 · 马尼拉站', game: 'MLBB', bracket: '瑞士轮', signupStart: '06-10', signupEnd: '06-20', matchStart: '06-25', matchEnd: '06-30', signed: 12, cap: 64, status: 'draft' },
  { id: '#M1016', name: 'eFootball 预选赛', game: 'eFootball', bracket: '循环赛', signupStart: '05-10', signupEnd: '05-20', matchStart: '05-22', matchEnd: '05-28', signed: 420, cap: 500, status: 'cancelled' },
  { id: '#M1015', name: 'Dota 2 高校联赛', game: 'Dota 2', bracket: '双败淘汰', signupStart: '05-18', signupEnd: '06-01', matchStart: '06-03', matchEnd: '06-10', signed: 156, cap: 256, status: 'live' },
  { id: '#M1014', name: 'MLBB 全明星赛', game: 'MLBB', bracket: '单败淘汰', signupStart: '05-05', signupEnd: '05-15', matchStart: '05-18', matchEnd: '05-20', signed: 64, cap: 64, status: 'ended' },
  { id: '#M1013', name: 'PUBG 新人杯', game: 'PUBG', bracket: '单败淘汰', signupStart: '06-08', signupEnd: '06-15', matchStart: '06-18', matchEnd: '06-20', signed: 180, cap: 400, status: 'open' },
  { id: '#M1012', name: 'eFootball 大师赛', game: 'eFootball', bracket: '小组+淘汰', signupStart: '05-12', signupEnd: '05-30', matchStart: '06-02', matchEnd: '06-10', signed: 520, cap: 600, status: 'live' },
  { id: '#M1011', name: 'Dota 2 娱乐赛', game: 'Dota 2', bracket: '循环赛', signupStart: '05-08', signupEnd: '05-18', matchStart: '05-20', matchEnd: '05-25', signed: 88, cap: 100, status: 'ended' },
  { id: '#M1010', name: 'MLBB 周末娱乐赛', game: 'MLBB', bracket: '单败淘汰', signupStart: '06-12', signupEnd: '06-14', matchStart: '06-15', matchEnd: '06-16', signed: 32, cap: 64, status: 'open' },
];

// ============ 用户列表 ============
export interface UserItem {
  id: string;
  nickname: string;
  regTime: string;
  country: string;
  points: number;
  matchCount: number;
  source: 'organic' | 'invite';
  status: 'active' | 'banned';
}

export const userListData: UserItem[] = [
  { id: 'U-9921', nickname: 'PlayerOne', regTime: '2026-05-20', country: '菲律宾', points: 3250, matchCount: 12, source: 'invite', status: 'active' },
  { id: 'U-8823', nickname: 'ProGamer_X', regTime: '2026-05-18', country: '印尼', points: 1800, matchCount: 8, source: 'organic', status: 'active' },
  { id: 'U-7715', nickname: 'TeamAlpha', regTime: '2026-04-12', country: '中国', points: 8500, matchCount: 25, source: 'invite', status: 'active' },
  { id: 'U-6654', nickname: 'GamerGirl99', regTime: '2026-05-22', country: '菲律宾', points: 1200, matchCount: 5, source: 'organic', status: 'active' },
  { id: 'U-5543', nickname: 'NoobMaster', regTime: '2026-03-28', country: '越南', points: 5600, matchCount: 18, source: 'invite', status: 'active' },
  { id: 'U-4432', nickname: 'EsportsKing', regTime: '2026-05-25', country: '马来西亚', points: 800, matchCount: 3, source: 'organic', status: 'active' },
  { id: 'U-3321', nickname: 'LunaStar', regTime: '2026-02-15', country: '印尼', points: 9200, matchCount: 30, source: 'invite', status: 'banned' },
  { id: 'U-2210', nickname: 'DragonSlayer', regTime: '2026-05-10', country: '中国', points: 2400, matchCount: 9, source: 'organic', status: 'active' },
  { id: 'U-1109', nickname: 'PixelHero', regTime: '2026-01-20', country: '菲律宾', points: 11500, matchCount: 42, source: 'invite', status: 'active' },
  { id: 'U-0098', nickname: 'StormRider', regTime: '2026-05-28', country: '越南', points: 600, matchCount: 2, source: 'organic', status: 'active' },
  { id: 'U-9087', nickname: 'CyberNinja', regTime: '2026-04-05', country: '马来西亚', points: 4300, matchCount: 15, source: 'invite', status: 'active' },
  { id: 'U-8076', nickname: 'NeonFlash', regTime: '2026-05-15', country: '菲律宾', points: 1900, matchCount: 7, source: 'organic', status: 'active' },
  { id: 'U-7065', nickname: 'ShadowHunter', regTime: '2026-03-10', country: '中国', points: 7800, matchCount: 22, source: 'invite', status: 'banned' },
  { id: 'U-6054', nickname: 'PhoenixRise', regTime: '2026-05-30', country: '印尼', points: 400, matchCount: 1, source: 'organic', status: 'active' },
  { id: 'U-5043', nickname: 'IceQueen', regTime: '2026-02-28', country: '越南', points: 6700, matchCount: 20, source: 'invite', status: 'active' },
];
