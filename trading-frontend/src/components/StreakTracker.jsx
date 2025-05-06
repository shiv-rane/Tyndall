// StreakTracker.jsx
import { useState } from 'react';

const StreakTracker = ({ trades }) => {
  const [tooltip, setTooltip] = useState({ visible: false, content: '', x: 0, y: 0 });

  // GitHub-like color scales
  const PROFIT_COLORS = ['#9be9a8', '#40c463', '#30a14e', '#216e39'];
  const LOSS_COLORS = ['#ffb3b3', '#ff6666', '#ff1a1a', '#cc0000'];

  // Generate 20 weeks of data
  const weeks = Array(20).fill().map((_, weekIndex) => 
    Array(7).fill().map((_, dayIndex) => {
      const date = new Date();
      date.setDate(date.getDate() - (20 - weekIndex) * 7 + dayIndex);
      return date.toISOString().split('T')[0];
    })
  ).reverse();

  // Prepare trade data
  const tradeMap = trades.reduce((acc, trade) => {
    acc[trade.date] = trade.pnl;
    return acc;
  }, {});

  // Get color for cell
  const getColor = (pnl) => {
    if (pnl === null || pnl === undefined) return '#ebedf0';
    const absPnl = Math.abs(pnl);
    const maxPnl = Math.max(...trades.map(t => Math.abs(t.pnl)), 1);
    const level = Math.min(Math.floor((absPnl / maxPnl) * 4), 3);
    return pnl > 0 ? PROFIT_COLORS[level] : LOSS_COLORS[level];
  };

  // Handle mouse events
  const handleCellHover = (event, date, pnl) => {
    const rect = event.target.getBoundingClientRect();
    const scrollLeft = window.scrollX || document.documentElement.scrollLeft;
    const scrollTop = window.scrollY || document.documentElement.scrollTop;
    
    setTooltip({
      visible: true,
      content: pnl !== null && pnl !== undefined ? 
        `${pnl >= 0 ? 'Profit' : 'Loss'} of ₹${Math.abs(pnl)} on ${new Date(date).toLocaleDateString('en-IN', {
          weekday: 'short',
          day: 'numeric',
          month: 'short',
        })}` :
        `No trades on ${new Date(date).toLocaleDateString('en-IN')}`,
      x: rect.left + scrollLeft,
      y: rect.top + scrollTop - 40
    });
  };

  return (
    <div className="p-4 relative">
      <div className="flex items-start">
        {/* Day labels */}
        <div className="flex flex-col gap-1 mr-2 text-xs text-gray-500">
          {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
            <div key={day} className="h-4 flex items-center">{day.slice(0, 3)}</div>
          ))}
        </div>

        {/* Weeks container with proper overflow handling */}
        <div className="flex gap-1 overflow-x-auto overflow-y-hidden pb-4" style={{ scrollbarWidth: 'none' }}>
          {weeks.map((week, weekIndex) => (
            <div key={weekIndex} className="flex flex-col gap-1">
              {week.map((date, dayIndex) => {
                const pnl = tradeMap[date];
                return (
                  <div
                    key={`${weekIndex}-${dayIndex}`}
                    className="w-4 h-4 rounded-sm border border-gray-100 cursor-pointer"
                    style={{ backgroundColor: getColor(pnl) }}
                    onMouseEnter={(e) => handleCellHover(e, date, pnl)}
                    onMouseLeave={() => setTooltip({ ...tooltip, visible: false })}
                  />
                );
              })}
            </div>
          ))}
        </div>
      </div>

      {/* Tooltip with proper positioning */}
      {tooltip.visible && (
        <div 
          className="fixed bg-gray-800 text-white p-2 rounded text-xs shadow-lg z-50"
          style={{ 
            left: `${tooltip.x}px`,
            top: `${tooltip.y}px`,
            transform: 'translate(-50%, 0)'
          }}
        >
          {tooltip.content}
        </div>
      )}

      {/* Legend */}
      <div className="flex gap-6 mt-4 text-sm">
        <div className="flex items-center gap-2">
          <span>Less</span>
          {PROFIT_COLORS.map((color, i) => (
            <div key={i} className="w-4 h-4 rounded-sm" style={{ backgroundColor: color }} />
          ))}
          <span>More Profit</span>
        </div>
        <div className="flex items-center gap-2">
          <span>Less</span>
          {LOSS_COLORS.map((color, i) => (
            <div key={i} className="w-4 h-4 rounded-sm" style={{ backgroundColor: color }} />
          ))}
          <span>More Loss</span>
        </div>
      </div>
    </div>
  );
};
export default StreakTracker;
