// AnalyticsPage.jsx
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axiosInstance from '../api/axios';
import StreakTracker from "../components/StreakTracker";
import MonthlyPerformance from '../components/analytics/MonthlyPerformance';
import WeeklyPerformance from '../components/analytics/WeeklyPerformance';
import { Card, CardHeader, CardBody } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { FaUserCircle } from 'react-icons/fa';
import { Link } from 'react-router-dom';

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


const equityData = [
  { date: '2024-01-01', value: 100000 },
  { date: '2024-02-01', value: 105000 },
  { date: '2024-03-01', value: 115000 },
];

const formatWeek = (startDateStr) => {
  const start = new Date(startDateStr);
  const end = new Date(start);
  end.setDate(start.getDate() + 6);

  const options = { month: 'short', day: 'numeric' };
  return `${start.toLocaleDateString('en-US', options)} - ${end.toLocaleDateString('en-US', options)}`;
};


// Sidebar component
function Sidebar() {
  return (
    <div className="w-64 bg-indigo-600 text-white flex flex-col p-6 h-screen sticky top-0 relative">
      <h1 className="text-2xl font-bold mb-10 tracking-wide">TradeSaaS</h1>

      <nav className="flex flex-col gap-2">
        <Link
          to="/dashboard"
          className="p-3 rounded-lg hover:bg-indigo-500 hover:scale-[1.02] transition-all duration-200 font-medium tracking-wide"
        >
          Dashboard
        </Link>
        <Link
          to="/journal"
          className="p-3 rounded-lg hover:bg-indigo-500 hover:scale-[1.02] transition-all duration-200 font-medium tracking-wide"
        >
          Journal
        </Link>
        <Link
          to="/analytics"
          className="p-3 rounded-lg hover:bg-indigo-500 hover:scale-[1.02] transition-all duration-200 font-medium tracking-wide"
        >
          Analytics
        </Link>
      </nav>

      <div className="mt-auto mb-2">
        <button
          onClick={() => {
            window.location.href = '/profile';
          }}
          className="w-full p-3 text-left rounded-lg hover:bg-indigo-500 hover:scale-[1.02] transition-all duration-200 font-medium tracking-wide flex items-center gap-2"
        >
          <FaUserCircle size={20} /> My Profile
        </button>
      </div>

      <div className="pb-2">
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
// KPI card
function KPICard({ title, value, valueClassName = '' }) {
  return (
    <div className="bg-white p-4 rounded-xl shadow-sm border-l-4 border-indigo-600">
      <p className="text-sm text-gray-500">{title}</p>
      <p className={`text-2xl font-bold mt-1 ${valueClassName}`}>
        {typeof value === 'number' ? value.toLocaleString() : value}
      </p>
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
  const [kpiData, setKpiData] = useState(null);
  const [trades, setTrades] = useState([]);
  const [strategyPerformance, setStrategyPerformance] = useState([]);
  const [equityData, setEquityData] = useState([]);
  const [weeklyData, setWeeklyData] = useState([]);
  const [equityLoading, setEquityLoading] = useState(true);
  const [equityError, setEquityError] = useState(null); 
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({
    dateRange: '30d',
    strategy: 'all',
    symbol: 'all',
  });


  //fetch summary data
  useEffect(() => {
    const fetchData = async () => {
      try {

        const tokenObject = JSON.parse(localStorage.getItem('token'));
        const token = tokenObject ? tokenObject.token : null;

        if (!token) {
          setError('No authentication token found');
          setLoading(false);
          return;
        }

       const response = await axiosInstance.get('/api/v1/analytics/summary', {
                 headers: { 'Authorization': `Bearer ${token}` },
               });
               setKpiData(response.data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);


//fetch streak data
  useEffect(() => {
    const fetchTrades = async () => {
      try {
        const tokenObject = JSON.parse(localStorage.getItem('token'));
        const token = tokenObject ? tokenObject.token : null;

        const response = await axiosInstance.get('/api/v1/analytics/heatstreaks', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setTrades(response.data);
      } catch (err) {
        console.error('Error fetching trades:', err);
      }
    };
  
    fetchTrades();
  }, []);



  //fetch strategy table
  useEffect(() => {
    const fetchStrategyPerformance = async () => {
      try {
        const tokenObject = JSON.parse(localStorage.getItem('token'));
        const token = tokenObject ? tokenObject.token : null;

        const response = await axiosInstance.get('/api/v1/analytics/strategy-table', {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        setStrategyPerformance(response.data);
      } catch (err) {
        console.error('Error fetching strategy performance:', err);
        setStrategyPerformance([]);
      }
    };
    fetchStrategyPerformance();
  }, []);


  // Fetch equity curve data
useEffect(() => {
  const fetchEquityData = async () => {
    try {
      const tokenObject = JSON.parse(localStorage.getItem('token'));
      const token = tokenObject?.token;

      const response = await axiosInstance.get(
        '/api/v1/analytics/equity-curve', 
        {
          headers: { 'Authorization': `Bearer ${token}` }
        }
      );
      
      // Transform data if needed (ensure date format matches)
      const formattedData = response.data.map(item => ({
        date: item.date, // Assuming ISO format from backend
        value: item.capital // Adjust according to your API response
      }));
      
      setEquityData(formattedData);
    } catch (err) {
      console.error('Error fetching equity curve:', err);
      setEquityData([]);
    }
  };

  fetchEquityData();
}, []);

  const getBarColor = (pnl) => (pnl >= 0 ? '#22c55e' : '#ef4444'); // green/red

  return (
    <div className="flex">
      <Sidebar />
      <main className="ml-64 p-6 w-full min-h-screen bg-gray-50">
        {/* KPI Cards */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-6">
          <KPICard
            title="Net PnL (₹)"
            value={kpiData?.totalPnl || 0} // Fallback to 0 if null
            valueClassName={kpiData?.totalPnl >= 0 ? 'text-green-600' : 'text-red-600'}
          />
          <KPICard 
            title="Win Rate (%)" 
            value={kpiData?.winRate ?? '--'} // Nullish coalescing
          />
          <KPICard 
            title="Avg RRR" 
            value={kpiData?.avgRiskReward ?? '-'} 
          />
          <KPICard 
            title="Max Drawdown (%)" 
            value={kpiData?.maxDrawdown ?? 'N/A'} 
          />
          <KPICard 
            title="Total Trades" 
            value={kpiData?.totalTrades ?? 0} 
          />
        </div>



        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <ChartCard title="Equity Curve">
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={equityData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis 
                dataKey="date" 
                tickFormatter={(date) => new Date(date).toLocaleDateString('en-US', { month: 'short', day: '2-digit' })}
              />
              <YAxis />
              <Tooltip 
                labelFormatter={(value) => new Date(value).toLocaleDateString()}
                formatter={(value) => `₹${value.toLocaleString()}`}
              />
              <Line 
                type="monotone" 
                dataKey="value" 
                stroke="#6366f1" 
                strokeWidth={2}
                dot={false}
              />
            </LineChart>
          </ResponsiveContainer>
        </ChartCard>

          <MonthlyPerformance />

          <WeeklyPerformance />

          <ChartCard title="Trading Activity Calendar">
          <StreakTracker trades={trades} />
          </ChartCard>

        </div>

        <div className="mt-6 w-full">
          <Card className="w-full">
            <CardHeader 
              title="Strategy Performance Analysis" 
              subtitle="Detailed breakdown of each trading strategy"
            />
            <CardBody className="px-0">
              <div className="overflow-x-auto">
                <table className="w-full divide-y divide-neutral-200">
                  <thead>
                    <tr>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">
                        Strategy
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">
                        Total Trades
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">
                        Win Rate
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">
                        Total P&L
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">
                        Avg. P&L Per Trade
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-neutral-200">
                    {strategyPerformance?.map((strategy) => (
                      <tr key={strategy.strategy} className="hover:bg-neutral-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <Badge variant="primary" size="sm">
                            {strategy.strategy}
                          </Badge>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-neutral-900">{strategy.totalTrades}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-neutral-900">
                            {strategy.winRate?.toFixed(1)}%
                          </div>
                        <div className="w-full bg-neutral-200 rounded-full h-1.5 mt-1">
                          <div className="bg-yellow-200 h-1.5 rounded-full" 
                            style={{ width: `${strategy.winRate}%` }}
                          ></div>
                        </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                        <div className={`text-sm font-medium ${
                          strategy.totalPnl >= 0 ? 'text-green-600' : 'text-red-600'
                        }`}>
                          {strategy.totalPnl >= 0 ? '+' : ''}
                          ${strategy.totalPnl?.toFixed(2)}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className={`text-sm font-medium ${
                          strategy.avgPnlPerTrade >= 0 ? 'text-green-600' : 'text-red-600'
                        }`}>
                          {strategy.avgPnlPerTrade >= 0 ? '+' : ''}
                          ${strategy.avgPnlPerTrade?.toFixed(2)}
                        </div>
                      </td>
                      </tr>
                      
                    ))}
                  </tbody>
                </table>
              </div>
            </CardBody>
          </Card>
        </div>

        {/* Filters */}
        {/* <div className="mt-8 bg-white p-4 rounded-xl shadow-sm">
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
        </div> */}
      </main>
    </div>
  );
}
