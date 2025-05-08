// MonthlyPerformance.jsx
import { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import axios from 'axios';

function ChartCard({ title, children }) {
    return (
      <div className="bg-white p-4 rounded-xl shadow-sm">
        <h3 className="text-lg font-semibold text-indigo-700 mb-2">{title}</h3>
        {children}
      </div>
    );
  }

const MonthlyPerformance = () => {
  const [monthlyData, setMonthlyData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Color generator function (same as weekly)
  const getBarColor = (value) => {
    const intensity = Math.min(Math.abs(value) / 10000, 1); // Adjust denominator based on max PnL
    return value >= 0 
      ? `rgba(34, 197, 94, ${0.3 + intensity * 0.7})`
      : `rgba(239, 68, 68, ${0.3 + intensity * 0.7})`;
  };

  useEffect(() => {
    const fetchMonthlyData = async () => {
      try {
        const tokenObject = JSON.parse(localStorage.getItem('token'));
        if (!tokenObject?.token) throw new Error('No authentication token found');

        const response = await axios.get('http://localhost:8080/api/v1/analytics/monthly-performance', {
          headers: { Authorization: `Bearer ${tokenObject.token}` }
        });

        // Transform backend data to match chart format
        const transformed = response.data.map(entry => ({
          month: formatMonth(entry.month),
          pnl: entry.total_pnl
        }));

        setMonthlyData(transformed);
        setError(null);
      } catch (error) {
        setError(error.message);
        console.error("Error fetching monthly performance data", error);
      } finally {
        setLoading(false);
      }
    };

    fetchMonthlyData();
  }, []);

  const formatMonth = (monthString) => {
    const date = new Date(monthString + '-01'); // Add day to parse correctly
    return date.toLocaleDateString('en-US', { month: 'short' });
  };

  const formatPnl = (value) => 
    new Intl.NumberFormat('en-IN', { 
      style: 'currency', 
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(value);

  if (loading) return <div className="p-4 text-gray-500">Loading monthly performance...</div>;
  if (error) return <div className="p-4 text-red-500">Error: {error}</div>;

  return (
    <ChartCard title="Monthly Performance">
      <div className="h-[250px]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={monthlyData}
            margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" vertical={false} />
            <XAxis
              dataKey="month"
              tickLine={false}
              axisLine={false}
              tick={{ fontSize: 12 }}
            />
            <YAxis
              tickLine={false}
              axisLine={false}
              tickFormatter={formatPnl}
              width={80}
            />
            <Tooltip
              content={({ active, payload }) => {
                if (!active || !payload?.length) return null;
                return (
                  <div className="bg-gray-800 text-white p-2 rounded text-xs">
                    <p className="font-medium">{payload[0].payload.month}</p>
                    <p>{formatPnl(payload[0].value)}</p>
                  </div>
                );
              }}
            />
            <Bar dataKey="pnl" barSize={30}>
              {monthlyData.map((entry, index) => (
                <Cell 
                  key={`cell-${index}`} 
                  fill={getBarColor(entry.pnl)}
                  radius={[4, 4, 0, 0]}
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </ChartCard>
  );
};

export default MonthlyPerformance;