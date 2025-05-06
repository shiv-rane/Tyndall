// StreakTracker.jsx
import { useState, useMemo } from 'react';

const StreakTracker = ({ trades }) => {
  const [tooltip, setTooltip] = useState(null);

  // Color configurations
  const PROFIT_COLORS = ['#9be9a8', '#40c463', '#30a14e', '#216e39'];
  const LOSS_COLORS = ['#ffb3b3', '#ff6666', '#ff1a1a', '#cc0000'];
  const NEUTRAL_COLOR = '#ebedf0';

  // Process trades with strict date validation
  const { tradeMap, maxPnl } = useMemo(() => {
    const map = new Map();
    let max = 1;

    trades.forEach(({ date, pnl }) => {
      try {
        const isoDate = new Date(date).toISOString().split('T')[0];
        if (!isNaN(new Date(isoDate))) {
          map.set(isoDate, pnl);
          if (Math.abs(pnl) > max) max = Math.abs(pnl);
        }
      } catch {
        console.warn(`Invalid date format: ${date}`);
      }
    });

    return { tradeMap: map, maxPnl: max };
  }, [trades]);

  // Generate 52-week grid with real-time cursor tracking
  const { dateGrid, monthLabels } = useMemo(() => {
    const grid = [];
    const labels = [];
    const today = new Date();
    const endDate = new Date(today);
    
    // Start from 51 weeks ago (to show full year)
    const startDate = new Date(today);
    startDate.setDate(today.getDate() - (51 * 7));
    
    // Align to Sunday
    startDate.setDate(startDate.getDate() - startDate.getDay());

    let current = new Date(startDate);
    let lastMonth = -1;
    
    // Generate weeks until we reach today
    while (current <= endDate) {
      const weekDates = [];
      const firstDay = new Date(current);
      
      // Month label handling
      const currentMonth = firstDay.getMonth();
      if (currentMonth !== lastMonth) {
        labels.push({
          weekIndex: grid.length,
          label: firstDay.toLocaleString('default', { month: 'short' })
        });
        lastMonth = currentMonth;
      } else {
        labels.push(null);
      }

      // Generate week
      for (let day = 0; day < 7; day++) {
        const date = new Date(current);
        weekDates.push(date.toISOString().split('T')[0]);
        current.setDate(current.getDate() + 1);
        
        // Stop if we've passed today
        if (date > endDate) break;
      }
      
      grid.push(weekDates);
    }

    return { dateGrid: grid, monthLabels: labels };
  }, []);

  // Get color with null protection
  const getColor = (date) => {
    const pnl = tradeMap.get(date);
    if (pnl === undefined) return NEUTRAL_COLOR;
    
    const level = Math.min(Math.floor((Math.abs(pnl) / maxPnl) * 4), 3);
    return pnl > 0 ? PROFIT_COLORS[level] : LOSS_COLORS[level];
  };

  // Real-time cursor tracking
  const handleMouseMove = (event, date) => {
    const pnl = tradeMap.get(date);
    const dateObj = new Date(date);
    const { clientX, clientY } = event;
    const windowWidth = window.innerWidth;
  
    setTooltip({
      content: pnl !== undefined 
        ? `${pnl >= 0 ? 'Profit' : 'Loss'} of ₹${Math.abs(pnl)} on ${dateObj.toLocaleDateString('en-IN', {
            day: 'numeric',
            month: 'short',
            year: 'numeric'
          })}`
        : `No trades on ${dateObj.toLocaleDateString('en-IN', {
            day: 'numeric',
            month: 'short',
            year: 'numeric'
          })}`,
      x: clientX + (clientX > windowWidth - 200 ? -180 : 10),
      y: clientY - 40
    });
  };
  return (
    <div className="relative p-4">
      <div className="flex items-start">
        {/* Day labels */}
        {/* <div className="flex flex-col gap-1 mr-2 text-xs text-gray-500">
          {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
            <div key={day} className="h-4">{day.slice(0, 3)}</div>
          ))}
        </div> */}

        {/* Main grid with direct cursor tracking */}
        <div className="flex gap-1 overflow-x-auto scrollbar-hide">
          {dateGrid.map((week, weekIndex) => (
            <div key={weekIndex} className="flex flex-col gap-1">
              {week.map((date) => {
    const isFuture = new Date(date) > new Date();
    const hasTrade = tradeMap.has(date);
    
            return (
            <div
                key={date}
                className={`w-3 h-3 rounded-sm border cursor-pointer ${
                isFuture ? 'bg-gray-100' : 'border-gray-100'
                }`}
                style={{ 
                backgroundColor: hasTrade ? getColor(date) : NEUTRAL_COLOR,
                opacity: hasTrade ? 1 : 0.6
                }}
                onMouseMove={(e) => !isFuture && handleMouseMove(e, date)}
                onMouseLeave={() => setTooltip(null)}
            />
            );
        })}
            </div>
          ))}
        </div>
      </div>

      {/* Cursor-locked tooltip */}

{tooltip && (
  <div
    className="fixed bg-gray-800 text-white px-3 py-2 rounded text-xs shadow-lg z-50 pointer-events-none whitespace-nowrap"
    style={{
      left: `${tooltip.x}px`,
      top: `${tooltip.y}px`,
      transform: tooltip.x < 100 ? 'translateX(0)' : 'translateX(-50%)'
    }}
  >
    {tooltip.content}
    <div className="absolute -bottom-1 left-1/2 w-2 h-2 bg-gray-800 transform -translate-x-1/2 rotate-45" />
  </div>
)}
    </div>
  );
};

export default StreakTracker;
