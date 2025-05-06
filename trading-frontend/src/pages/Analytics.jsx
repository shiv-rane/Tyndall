// AnalyticsPage.jsx
import { useState } from 'react';
import { Link } from 'react-router-dom';
import StreakTracker from "../components/StreakTracker";
import {
  BarChart,
  LineChart,
  Bar,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Cell,
  ResponsiveContainer,
} from 'recharts';

// Mock data (same as before)
const kpiData = {
  netPnl: 12500,
  winRate: 68,
  avgRRR: 2.4,
  maxDrawdown: -15,
  totalTrades: 142,
};

const equityData = [
  { date: '2024-01-01', value: 100000 },
  { date: '2024-02-01', value: 105000 },
  { date: '2024-03-01', value: 115000 },
];

const monthlyData = [
  { month: 'Jan', pnl: 4200 },
  { month: 'Feb', pnl: -1700 },
  { month: 'Mar', pnl: 6200 },
];

const strategyData = [
  { strategy: 'Breakout', pnl: 7500 },
  { strategy: 'Reversal', pnl: -3200 },
  { strategy: 'Scalping', pnl: 4400 },
];

const rrrData = [
  { range: '0-1.0', trades: 15 },
  { range: '1.0-2.0', trades: 30 },
  { range: '2.0-3.0', trades: 12 },
];

const dayData = [
  { day: 'Mon', pnl: 3200 },
  { day: 'Tue', pnl: -500 },
  { day: 'Wed', pnl: 4000 },
  { day: 'Thu', pnl: 1500 },
  { day: 'Fri', pnl: -200 },
];

const streakData = {
  longestWin: 7,
  longestLoss: 4,
  currentStreak: 2,
  currentType: 'win',
};

const streakTrades = [
  // Last 7 days
  { date: new Date().toISOString().split('T')[0], pnl: 4200 }, // Today
  { date: new Date(Date.now() - 86400000).toISOString().split('T')[0], pnl: -3200 }, // Yesterday
  { date: new Date(Date.now() - 2 * 86400000).toISOString().split('T')[0], pnl: 1500 },
  { date: new Date(Date.now() - 3 * 86400000).toISOString().split('T')[0], pnl: -2800 },
  { date: new Date(Date.now() - 4 * 86400000).toISOString().split('T')[0], pnl: 0 }, // No trade
  { date: new Date(Date.now() - 5 * 86400000).toISOString().split('T')[0], pnl: 4200 },
  { date: new Date(Date.now() - 6 * 86400000).toISOString().split('T')[0], pnl: -1500 },

  // Previous weeks (sample data)
  { date: '2024-05-15', pnl: 3200 },
  { date: '2024-05-14', pnl: -4200 },
  { date: '2024-05-12', pnl: 1800 },
  { date: '2024-05-10', pnl: -2500 },
  { date: '2024-05-08', pnl: 5000 },
  { date: '2024-05-05', pnl: -1200 },
  { date: '2024-05-03', pnl: 3000 },
  { date: '2024-05-01', pnl: -4000 },

  // April 2024
  { date: '2024-04-28', pnl: 2200 },
  { date: '2024-04-25', pnl: -1800 },
  { date: '2024-04-22', pnl: 3500 },
  { date: '2024-04-20', pnl: -2900 },
  { date: '2024-04-18', pnl: 4100 },
  { date: '2024-04-15', pnl: -1500 },
  { date: '2024-04-12', pnl: 2800 },
  { date: '2024-04-10', pnl: -3200 },
  { date: '2024-04-08', pnl: 1900 },
  { date: '2024-04-05', pnl: -2100 },
  { date: '2024-04-03', pnl: 3000 },
  { date: '2024-04-01', pnl: -2500 },

  // March 2024
  { date: '2024-03-28', pnl: 4200 },
  { date: '2024-03-25', pnl: -3800 },
  { date: '2024-03-22', pnl: 1500 },
  { date: '2024-03-20', pnl: -2900 },
  { date: '2024-03-18', pnl: 3200 },
  { date: '2024-03-15', pnl: -4100 },
  { date: '2024-03-12', pnl: 2800 },
  { date: '2024-03-10', pnl: -2200 },
  { date: '2024-03-08', pnl: 3500 },
  { date: '2024-03-05', pnl: -1900 },
  { date: '2024-03-03', pnl: 4100 },
  { date: '2024-03-01', pnl: -3100 },
];

// Generate remaining days with random/no trades
for (let i = 7; i < 90; i++) {
  const date = new Date(Date.now() - i * 86400000).toISOString().split('T')[0];
  const exists = streakTrades.some(trade => trade.date === date);
  
  if (!exists) {
    streakTrades.push({
      date,
      pnl: Math.random() > 0.6 ? // 40% chance of no trade
        (Math.random() > 0.5 ? 
          Math.floor(Math.random() * 5000) : // Profit
          -Math.floor(Math.random() * 4000)) : // Loss
        null
    });
  }
}



// Sidebar component
function Sidebar() {
  return (
    <aside className="w-64 bg-indigo-700 text-white fixed h-screen p-6">
      <h1 className="text-2xl font-bold mb-10">TradeSaaS</h1>
      <nav className="flex flex-col gap-4 text-base">
        <Link to="/dashboard" className="hover:bg-indigo-600 p-3 rounded-lg transition-all">Dashboard</Link>
        <Link to="/journal" className="hover:bg-indigo-600 p-3 rounded-lg transition-all">Journal</Link>
        <Link to="/analytics" className="hover:bg-indigo-600 p-3 rounded-lg transition-all">Analytics</Link>
      </nav>
      <div className="absolute bottom-0 left-0 right-0 p-6 border-t border-indigo-500">
        <button
          onClick={() => {
            localStorage.removeItem('token');
            window.location.href = '/login';
          }}
          className="w-full p-3 bg-indigo-600 hover:bg-indigo-500 rounded-lg"
        >
          Logout
        </button>
      </div>
    </aside>
  );
}

// KPI card
function KPICard({ title, value }) {
  return (
    <div className="bg-white p-4 rounded-xl shadow-sm border-l-4 border-indigo-600">
      <p className="text-sm text-gray-500">{title}</p>
      <p className="text-2xl font-bold text-gray-800 mt-1">{typeof value === 'number' ? value.toLocaleString() : value}</p>
    </div>
  );
}

// Chart container
function ChartCard({ title, children }) {
  return (
    <div className="bg-white p-4 rounded-xl shadow-sm">
      <h3 className="text-lg font-semibold text-indigo-700 mb-2">{title}</h3>
      {children}
    </div>
  );
}

// Select filter
function SelectFilter({ label, options }) {
  return (
    <div className="flex flex-col gap-1">
      <label className="text-sm text-gray-700 font-medium">{label}</label>
      <select className="rounded-md border border-gray-300 px-3 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-600">
        {options.map(option => (
          <option key={option.value} value={option.value}>{option.label}</option>
        ))}
      </select>
    </div>
  );
}

// Main component
export default function AnalyticsPage() {
  const [filters, setFilters] = useState({
    dateRange: '30d',
    strategy: 'all',
    symbol: 'all',
  });

  const getBarColor = (value) => (value >= 0 ? '#22c55e' : '#ef4444');

  return (
    <div className="flex">
      <Sidebar />
      <main className="ml-64 p-6 w-full min-h-screen bg-gray-50">
        {/* KPI Cards */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-6">
          <KPICard title="Net PnL (₹)" value={kpiData.netPnl} />
          <KPICard title="Win Rate (%)" value={kpiData.winRate} />
          <KPICard title="Avg RRR" value={kpiData.avgRRR} />
          <KPICard title="Max Drawdown (%)" value={kpiData.maxDrawdown} />
          <KPICard title="Total Trades" value={kpiData.totalTrades} />
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <ChartCard title="Equity Curve">
            <ResponsiveContainer width="100%" height={250}>
              <LineChart data={equityData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="value" stroke="#6366f1" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </ChartCard>

                <ChartCard title="Monthly Performance">
        <ResponsiveContainer width="100%" height={240}>
          <BarChart
            data={monthlyData}
            margin={{ top: 10, right: 20, left: 0, bottom: 0 }}
            barGap={8}
          >
            <CartesianGrid strokeDasharray="2 4" vertical={false} />
            <XAxis dataKey="month" tickLine={false} axisLine={false} />
            <YAxis tickLine={false} axisLine={false} />
            <Tooltip />
            <Bar dataKey="pnl" barSize={30}>
              {monthlyData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={getBarColor(entry.pnl)} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </ChartCard>



          <ChartCard title="Strategy Performance">
          <ResponsiveContainer width="100%" height={250}>
  <BarChart data={strategyData} barSize={28} barGap={4} categoryGap={10}>
    <CartesianGrid strokeDasharray="2 4" vertical={false} />
    <XAxis dataKey="strategy" tickLine={false} axisLine={false} />
    <YAxis tickLine={false} axisLine={false} />
    <Tooltip />
    <Bar dataKey="pnl">
      {strategyData.map((entry, index) => (
        <Cell key={index} fill={getBarColor(entry.pnl)} />
      ))}
    </Bar>
  </BarChart>
</ResponsiveContainer>
          </ChartCard>

          <ChartCard title="RRR Distribution">
          <ResponsiveContainer width="100%" height={250}>
  <BarChart data={rrrData} barSize={28} barGap={4} categoryGap={10}>
    <CartesianGrid strokeDasharray="2 4" vertical={false} />
    <XAxis dataKey="range" tickLine={false} axisLine={false} />
    <YAxis tickLine={false} axisLine={false} />
    <Tooltip />
    <Bar dataKey="trades" fill="#4f46e5" />
  </BarChart>
</ResponsiveContainer>

          </ChartCard>

          <ChartCard title="Day of Week Performance">
           <ResponsiveContainer width="100%" height={250}>
  <BarChart data={dayData} barSize={28} barGap={4} categoryGap={10}>
    <CartesianGrid strokeDasharray="2 4" vertical={false} />
    <XAxis dataKey="day" tickLine={false} axisLine={false} />
    <YAxis tickLine={false} axisLine={false} />
    <Tooltip />
    <Bar dataKey="pnl">
      {dayData.map((entry, index) => (
        <Cell key={index} fill={getBarColor(entry.pnl)} />
      ))}
    </Bar>
  </BarChart>
</ResponsiveContainer>

          </ChartCard>


          <ChartCard title="Trading Activity Calendar">
          <StreakTracker trades={streakTrades} />
          </ChartCard>


        </div>

        {/* Filters */}
        <div className="mt-8 bg-white p-4 rounded-xl shadow-sm">
          <div className="flex flex-wrap gap-6">
            <SelectFilter
              label="Date Range"
              options={[
                { value: '7d', label: 'Last 7 Days' },
                { value: '30d', label: 'Last 30 Days' },
                { value: '90d', label: 'Last 90 Days' },
              ]}
            />
            <SelectFilter
              label="Strategy"
              options={[
                { value: 'all', label: 'All Strategies' },
                { value: 'breakout', label: 'Breakout' },
                { value: 'reversal', label: 'Reversal' },
              ]}
            />
          </div>
        </div>
      </main>
    </div>
  );
}
