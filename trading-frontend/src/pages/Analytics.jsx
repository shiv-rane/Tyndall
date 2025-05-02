import { useState } from 'react';
import { Link } from 'react-router-dom';
import { BarChart, LineChart, Bar, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

// Mock data
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
  currentType: 'win'
};

function Sidebar() {
  return (
    <div className="w-64 bg-indigo-600 text-white fixed h-full p-6">
      <h1 className="text-2xl font-bold mb-10 tracking-wide">TradeSaaS</h1>
      <nav className="flex flex-col gap-2">
        <Link to="/dashboard" className="p-3 rounded-lg hover:bg-indigo-500 hover:scale-[1.02] transition-all duration-200 font-medium tracking-wide">
          Dashboard
        </Link>
        <Link to="/journal" className="p-3 rounded-lg hover:bg-indigo-500 hover:scale-[1.02] transition-all duration-200 font-medium tracking-wide">
          Journal
        </Link>
        <Link to="/analytics" className="p-3 rounded-lg hover:bg-indigo-500 hover:scale-[1.02] transition-all duration-200 font-medium tracking-wide">
          Analytics
        </Link>
      </nav>
      <div className="absolute bottom-0 left-0 right-0 p-6 border-t border-indigo-400">
        <button
          onClick={() => {
            localStorage.removeItem('token');
            window.location.href = '/login';
          }}
          className="w-full p-3 text-left rounded-lg hover:bg-indigo-400 bg-indigo-500 transition-colors font-medium tracking-wide"
        >
          Logout
        </button>
      </div>
    </div>
  );
}

export default function AnalyticsPage() {
  const [filters, setFilters] = useState({
    dateRange: '30d',
    strategy: 'all',
    symbol: 'all',
  });

  const getBarColor = (value) => value >= 0 ? '#16a34a' : '#dc2626';

  return (
    <div className="flex">
      <Sidebar />
      
      <div className="ml-64 p-6 w-full min-h-screen bg-gray-50">
        {/* KPI Cards */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-3 mb-6">
          <KPICard title="Net PnL (₹)" value={kpiData.netPnl} />
          <KPICard title="Win Rate (%)" value={kpiData.winRate} />
          <KPICard title="Avg RRR" value={kpiData.avgRRR} />
          <KPICard title="Max DD (%)" value={kpiData.maxDrawdown} />
          <KPICard title="Total Trades" value={kpiData.totalTrades} />
        </div>

        {/* Charts */}
        <div className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <ChartCard title="Equity Curve">
              <ResponsiveContainer width="100%" height={250}>
                <LineChart data={equityData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" stroke="#4f46e5" />
                  <YAxis stroke="#4f46e5" />
                  <Tooltip />
                  <Line 
                    type="monotone" 
                    dataKey="value" 
                    stroke="#4f46e5"
                    strokeWidth={2}
                  />
                </LineChart>
              </ResponsiveContainer>
            </ChartCard>

            <ChartCard title="Monthly Performance">
              <ResponsiveContainer width="100%" height={250}>
                <BarChart data={monthlyData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" stroke="#4f46e5" />
                  <YAxis stroke="#4f46e5" />
                  <Tooltip />
                  <Bar 
                    dataKey="pnl"
                    fill={({ pnl }) => getBarColor(pnl)}
                  />
                </BarChart>
              </ResponsiveContainer>
            </ChartCard>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <ChartCard title="Strategy Performance">
              <ResponsiveContainer width="100%" height={250}>
                <BarChart data={strategyData}>
                  <XAxis dataKey="strategy" stroke="#4f46e5" />
                  <YAxis stroke="#4f46e5" />
                  <Tooltip />
                  <Bar 
                    dataKey="pnl"
                    fill={({ pnl }) => getBarColor(pnl)}
                  />
                </BarChart>
              </ResponsiveContainer>
            </ChartCard>

            <ChartCard title="RRR Distribution">
              <ResponsiveContainer width="100%" height={250}>
                <BarChart data={rrrData}>
                  <XAxis dataKey="range" stroke="#4f46e5" />
                  <YAxis stroke="#4f46e5" />
                  <Tooltip />
                  <Bar 
                    dataKey="trades" 
                    fill="#4f46e5"
                  />
                </BarChart>
              </ResponsiveContainer>
            </ChartCard>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <ChartCard title="Day of Week Performance">
              <ResponsiveContainer width="100%" height={250}>
                <BarChart data={dayData}>
                  <XAxis dataKey="day" stroke="#4f46e5" />
                  <YAxis stroke="#4f46e5" />
                  <Tooltip />
                  <Bar 
                    dataKey="pnl"
                    fill={({ pnl }) => getBarColor(pnl)}
                  />
                </BarChart>
              </ResponsiveContainer>
            </ChartCard>

            <ChartCard title="Win/Loss Streaks">
              <div className="p-4">
                <table className="w-full">
                  <tbody>
                    <tr className="border-b">
                      <td className="py-2 font-medium">Longest Win Streak</td>
                      <td className="text-green-600">{streakData.longestWin} trades</td>
                    </tr>
                    <tr className="border-b">
                      <td className="py-2 font-medium">Longest Loss Streak</td>
                      <td className="text-red-600">{streakData.longestLoss} trades</td>
                    </tr>
                    <tr>
                      <td className="py-2 font-medium">Current Streak</td>
                      <td className={streakData.currentType === 'win' ? 'text-green-600' : 'text-red-600'}>
                        {streakData.currentStreak} {streakData.currentType}
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </ChartCard>
          </div>
        </div>

        {/* Filters */}
        <div className="mt-4 p-3 bg-white rounded-lg shadow-sm">
          <div className="flex flex-wrap gap-4">
            <SelectFilter 
              label="Date Range"
              options={[
                { value: '7d', label: 'Last 7 days' },
                { value: '30d', label: 'Last 30 days' },
                { value: '90d', label: 'Last 90 days' },
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
      </div>
    </div>
  );
}

function KPICard({ title, value }) {
  return (
    <div className="bg-white p-3 rounded-lg shadow-sm border-l-4 border-indigo-600">
      <h3 className="text-xs font-medium text-gray-500">{title}</h3>
      <p className="text-xl font-semibold mt-1 text-gray-900">
        {typeof value === 'number' ? value.toLocaleString() : value}
      </p>
    </div>
  );
}

function ChartCard({ title, children }) {
  return (
    <div className="bg-white p-3 rounded-lg shadow-sm">
      <h3 className="text-base font-semibold mb-2 text-indigo-600">{title}</h3>
      {children}
    </div>
  );
}

function SelectFilter({ label, options }) {
  return (
    <div className="flex items-center gap-2">
      <label className="text-sm text-gray-600">{label}</label>
      <select className="rounded-md border border-gray-300 px-3 py-1 text-sm focus:ring-2 focus:ring-indigo-600 focus:border-indigo-600">
        {options.map(option => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );
}