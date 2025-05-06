// StreakTracker.jsx
import { Tooltip } from 'recharts';
import { format, parseISO, eachDayOfInterval, startOfWeek, endOfWeek } from 'date-fns';

const StreakTracker = ({ trades }) => {
  // GitHub-like color scales
  const PROFIT_COLORS = ['#9be9a8', '#40c463', '#30a14e', '#216e39'];
  const LOSS_COLORS = ['#ffb3b3', '#ff6666', '#ff1a1a', '#cc0000'];
  
  // Prepare trade data with dates
  const tradeMap = trades.reduce((acc, trade) => {
    acc[trade.date] = trade.pnl;
    return acc;
  }, {});

  // Generate 12 months of data (GitHub-style)
  const today = new Date();
  const startDate = new Date(today);
  startDate.setMonth(today.getMonth() - 11);
  startDate.setDate(1);

  // Create array of all days in the 12-month period
  const allDays = eachDayOfInterval({
    start: startDate,
    end: today
  });

  // Group days into weeks
  const weeks = [];
  let currentWeekStart = startOfWeek(startDate, { weekStartsOn: 0 });
  
  while (currentWeekStart <= today) {
    const weekDays = eachDayOfInterval({
      start: currentWeekStart,
      end: endOfWeek(currentWeekStart, { weekStartsOn: 0 })
    });
    
    weeks.push(weekDays);
    currentWeekStart = startOfWeek(
      new Date(currentWeekStart.setDate(currentWeekStart.getDate() + 7)), 
      { weekStartsOn: 0 }
    );
  }

  // Calculate color intensity
  const getColor = (pnl) => {
    if (!pnl) return '#ebedf0'; // No trade
    
    const absolutePnl = Math.abs(pnl);
    const isProfit = pnl > 0;
    
    // Get max values for scaling
    const maxProfit = Math.max(...trades.filter(t => t.pnl > 0).map(t => t.pnl));
    const maxLoss = Math.abs(Math.min(...trades.filter(t => t.pnl < 0).map(t => t.pnl)));
    
    const scale = isProfit ? absolutePnl / maxProfit : absolutePnl / maxLoss;
    const level = Math.min(Math.floor(scale * 4), 3);
    
    return isProfit ? PROFIT_COLORS[level] : LOSS_COLORS[level];
  };

  return (
    <div className="p-4">
      <div className="flex gap-1 items-start">
        {/* Day labels */}
        <div className="flex flex-col gap-1 mr-2 text-xs text-gray-500">
          {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
            <div key={day} className="h-4 flex items-center">{day}</div>
          ))}
        </div>

        {/* Main grid */}
        <div className="flex gap-1 overflow-x-auto pb-4">
          {weeks.map((weekDays, weekIndex) => (
            <div key={weekIndex} className="flex flex-col gap-1">
              {weekDays.map((date) => {
                const dateString = format(date, 'yyyy-MM-dd');
                const pnl = tradeMap[dateString];
                const isFuture = date > today;
                
                return (
                  <Tooltip
                    key={dateString}
                    content={
                      <div className="bg-gray-800 text-white p-2 rounded text-xs">
                        {isFuture ? 'Future date' : pnl ? 
                          `${pnl > 0 ? 'Profit' : 'Loss'}: ₹${Math.abs(pnl)} on ${format(date, 'MMM d, yyyy')}` :
                          `No trades on ${format(date, 'MMM d, yyyy')}`
                        }
                      </div>
                    }
                  >
                    <div
                      className={`w-4 h-4 rounded-sm cursor-pointer border border-gray-100 ${
                        isFuture ? 'opacity-50' : ''
                      }`}
                      style={{
                        backgroundColor: isFuture ? '#ebedf0' : getColor(pnl),
                        opacity: pnl ? 1 : 0.6
                      }}
                    />
                  </Tooltip>
                );
              })}
            </div>
          ))}
        </div>
      </div>

      {/* Legend */}
      <div className="flex items-center gap-6 mt-4">
        <div className="flex items-center gap-2 text-sm">
          <span>Less</span>
          {PROFIT_COLORS.map((color, i) => (
            <div key={i} className="w-4 h-4 rounded-sm" style={{ backgroundColor: color }} />
          ))}
          <span>More Profit</span>
        </div>
        <div className="flex items-center gap-2 text-sm">
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