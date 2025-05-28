// WeeklyPerformance.jsx
import { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import axiosInstance from "../../api/axios";

function ChartCard({ title, children }) {
    return (
      <div className="bg-white p-4 rounded-xl shadow-sm">
        <h3 className="text-lg font-semibold text-indigo-700 mb-2">{title}</h3>
        {children}
      </div>
    );
  }

const WeeklyPerformance = () => {
  const [weeklyData, setWeeklyData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Color generator function
  const getBarColor = (value) => {
    const intensity = Math.min(Math.abs(value) / 5000, 1); // Adjust 5000 based on your max PnL
    return value >= 0 
      ? `rgba(34, 197, 94, ${0.3 + intensity * 0.7})`
      : `rgba(239, 68, 68, ${0.3 + intensity * 0.7})`;
  };

  useEffect(() => {
    const fetchWeeklyData = async () => {
      try {
        const tokenObject = JSON.parse(localStorage.getItem('token'));
        if (!tokenObject?.token) throw new Error('No authentication token found');

        const response = await axiosInstance.get('/api/v1/analytics/weekly-performance', {
          headers: { Authorization: `Bearer ${tokenObject.token}` }
        });

        const transformed = response.data.map(entry => ({
          weekStart: entry.weekStart,
          pnl: entry.pnl,
          weekLabel: formatWeekRange(entry.weekStart)
        }));

        setWeeklyData(transformed);
        setError(null);
      } catch (error) {
        setError(error.message);
        console.error("Error fetching weekly performance data", error);
      } finally {
        setLoading(false);
      }
    };

    fetchWeeklyData();
  }, []);

  const formatWeekRange = (startDateStr) => {
    const start = new Date(startDateStr);
    const end = new Date(start);
    end.setDate(start.getDate() + 6);

    return `${start.toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })} - ${end.toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}`;
  };

  const formatPnl = (value) => 
    new Intl.NumberFormat('en-IN', { 
      style: 'currency', 
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(value);

  if (loading) return <div className="p-4 text-gray-500">Loading weekly performance...</div>;
  if (error) return <div className="p-4 text-red-500">Error: {error}</div>;

  return (
    <ChartCard title="Weekly Performance">
      <div className="h-[250px]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={weeklyData}
            margin={{ top: 20, right: 30, left: 20, bottom: 10 }}
          >
            <CartesianGrid strokeDasharray="3 3" vertical={false} />
            <XAxis
              dataKey="weekLabel"
              tickLine={false}
              axisLine={false}
              angle={-45}
              textAnchor="end"
              interval={0}
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
                    <p className="font-medium">{payload[0].payload.weekLabel}</p>
                    <p>{formatPnl(payload[0].value)}</p>
                  </div>
                );
              }}
            />
            <Bar dataKey="pnl" barSize={28}>
              {weeklyData.map((entry, index) => (
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

export default WeeklyPerformance;