import React, { useEffect, useState } from "react";
import { useNavigate,Link } from "react-router-dom";
import { FaUserCircle } from "react-icons/fa";
import axios from "axios";
import Sidebar from '../components/Sidebar';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';

const Dashboard = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState({});
  const [equityData, setEquityData] = useState([]);
  const [recentTrades, setRecentTrades] = useState([]);
  const [smartTip, setSmartTip] = useState("");

  useEffect(() => {
    const token = JSON.parse(localStorage.getItem("token"))?.token;
    if (!token) {
      navigate("/login");
      return;
    }
  }, [navigate]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = JSON.parse(localStorage.getItem("token"))?.token;
        
        const axiosConfig = {
          headers: {
            Authorization: `Bearer ${token}`
          }
        };

        const [statsRes, equityRes, tradesRes, tipRes] = await Promise.all([
          axios.get("http://localhost:8080/api/dashboard/summary", axiosConfig),
          axios.get("http://localhost:8080/api/v1/analytics/equity-curve", axiosConfig),
          axios.get("http://localhost:8080/api/dashboard/recent-trades", axiosConfig),
          axios.get("/api/user/suggestions", axiosConfig),
        ]);

        // Process equity data immediately after receiving it
        const processedEquityData = equityRes.data
          .map(item => ({
            date: item.date,
            value: item.capital 
          }))
          .sort((a, b) => new Date(a.date) - new Date(b.date));

        setStats(statsRes.data);
        setEquityData(processedEquityData); 
        setRecentTrades(tradesRes.data || []);
        setSmartTip(tipRes.data.tip || "");
      } catch (error) {
        console.error("Error fetching dashboard data", error);
        if (error.response?.status === 401) {
          localStorage.removeItem("token");
          navigate("/login");
        }
      }
    };

    fetchData();
  }, [navigate]);

   const formatCurrency = (value) => `₹${value?.toLocaleString() || 0}`;
  return (
    <div className="flex min-h-screen bg-gray-100">

      {/* Sidebar */}
      <div className="w-64 bg-indigo-600 text-white flex flex-col p-6 h-screen sticky top-0 relative">
          <h1 className="text-2xl font-bold mb-10 tracking-wide">TradeSaaS</h1>

          <nav className="flex flex-col gap-2">
            <a
              href="/dashboard"
              className="p-3 rounded-lg hover:bg-indigo-500 hover:scale-[1.02] transition-all duration-200 font-medium tracking-wide"
            >
              Dashboard
            </a>
            <a
              href="/journal"
              className="p-3 rounded-lg hover:bg-indigo-500 hover:scale-[1.02] transition-all duration-200 font-medium tracking-wide"
            >
              Journal
            </a>
            <a
              href="/analytics"
              className="p-3 rounded-lg hover:bg-indigo-500 hover:scale-[1.02] transition-all duration-200 font-medium tracking-wide"
            >
              Analytics
            </a>
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


      {/* Main Content */}
      <div className="flex-1 p-10">

        {/* Quick Stats */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-10">
          <div className="bg-white p-4 rounded-xl shadow text-center">
            <h2 className="text-gray-500 text-sm mb-2">Net PnL</h2>
            <p className={`text-2xl font-bold ${stats.total_pnl >= 0 ? "text-green-600" : "text-red-600"}`}>
              ₹{stats.total_pnl || 0}
            </p>
          </div>
          <div className="bg-white p-4 rounded-xl shadow text-center">
            <h2 className="text-gray-500 text-sm mb-2">Win Rate</h2>
            <p className="text-2xl font-bold">{stats.winrate || 0}%</p>
          </div>
          <div className="bg-white p-4 rounded-xl shadow text-center">
            <h2 className="text-gray-500 text-sm mb-2">Avg RRR</h2>
            <p className="text-2xl font-bold">{stats.avg_rrr || 0}</p>
          </div>
          <div className="bg-white p-4 rounded-xl shadow text-center">
            <h2 className="text-gray-500 text-sm mb-2">Total Trades</h2>
            <p className="text-2xl font-bold">{stats.total_trade || 0}</p>
          </div>
          <div className="bg-white p-4 rounded-xl shadow text-center">
            <h2 className="text-gray-500 text-sm mb-2">Max Drawdown</h2>
            <p className="text-2xl font-bold">{stats.max_drawdown || 0}%</p>
          </div>
        </div>

        {/* Equity Curve */}
         <div className="bg-white rounded-xl shadow p-6 mb-8">
          <h2 className="text-xl font-semibold mb-4 text-indigo-600">Capital Over Time</h2>
          <div className="w-full h-64">
            {equityData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={equityData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis 
                    dataKey="date"
                    tickFormatter={(date) => new Date(date).toLocaleDateString('en-IN', {
                      month: 'short',
                      day: 'numeric'
                    })}
                  />
                  <YAxis
                    tickFormatter={(value) => `₹${value.toLocaleString('en-IN')}`}
                  />
                  <Tooltip
                    labelFormatter={(date) => new Date(date).toLocaleDateString('en-IN', {
                      weekday: 'long',
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                    formatter={(value) => [formatCurrency(value), 'Capital']}
                  />
                  <Line
                    type="linear" 
                    dataKey="value"
                    stroke="#4f46e5"
                    strokeWidth={2}
                    dot={false}
                    activeDot={{ r: 6 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            ) : (
              <div className="w-full h-full bg-gray-50 rounded flex items-center justify-center text-gray-500">
                {equityData.length === 0 ? 'Loading equity data...' : 'No equity data available'}
              </div>
            )}
          </div>
        </div>
        
        {/* Recent Trades */}
        <div className="bg-white rounded-xl shadow p-6 mb-8">
          <h2 className="text-xl font-semibold mb-4 text-indigo-600">Recent Trades</h2>
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm text-gray-700">
              <thead>
                <tr className="text-left bg-indigo-600 text-white">
                  <th className="p-2">Date</th>
                  <th className="p-2">Symbol</th>
                  <th className="p-2">Side</th>
                  <th className="p-2">Entry</th>
                  <th className="p-2">Exit</th>
                  <th className="p-2">P&L</th>
                  <th className="p-2">Note</th>
                </tr>
              </thead>
              <tbody>
                {Array.isArray(recentTrades) && recentTrades.length > 0 ? (
                  recentTrades.map((trade, idx) => (
                    <tr key={idx} className="border-b">
                      <td className="p-2">{trade.date || "N/A"}</td>
                      <td className="p-2">{trade.symbol || "N/A"}</td>
                      <td className="p-2">{trade.side || "N/A"}</td>
                      <td className="p-2">{trade.entry ?? "-"}</td>
                      <td className="p-2">{trade.exit ?? "-"}</td>
                      <td className={`p-2 ${trade.pnl >= 0 ? "text-green-600" : "text-red-600"}`}>
                        ₹{Number.isFinite(trade.pnl) ? Math.round(trade.pnl) : 0}
                      </td>
                      <td className="p-2">{trade.note || "-"}</td>

                    </tr>
                  ))
                ) : (
                  <tr>
                    <td className="p-2 text-center" colSpan="7">
                      No trades found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Smart Suggestion */}
        {smartTip && (
          <div className="bg-indigo-100 text-indigo-700 rounded-xl p-4 shadow">
            💡 Tip: {smartTip}
          </div>
        )}

      </div>
    </div>
  );
};

export default Dashboard;
