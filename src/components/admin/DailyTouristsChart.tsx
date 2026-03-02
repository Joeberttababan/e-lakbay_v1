import React, { useMemo } from 'react';
import { motion } from 'framer-motion';
import { Skeleton } from '../ui/skeleton';
import { DailyTouristData, formatDateLabel } from './types';

type DailyTouristsChartProps = {
  loading: boolean;
  data: DailyTouristData[];
};

const DailyTouristsChart: React.FC<DailyTouristsChartProps> = ({ loading, data }) => {
  const maxCount = useMemo(() => {
    return Math.max(...data.map((d) => d.count), 1);
  }, [data]);

  return (
    <div className="rounded-2xl border border-white/10 bg-white/5 p-4 md:p-6">
      <h3 className="text-lg font-semibold mb-2">Daily New Tourists</h3>
      <p className="text-sm text-white/60 mb-6">Based on tourist account creation</p>

      {loading ? (
        <div className="h-64 flex items-center justify-center">
          <Skeleton className="h-full w-full rounded-lg" />
        </div>
      ) : data.length === 0 ? (
        <div className="h-64 flex items-center justify-center text-white/60">
          No tourist data available for the selected period.
        </div>
      ) : (
        <div className="h-64 flex items-end gap-1 overflow-x-auto pb-8 relative">
          {/* Y-axis labels */}
          <div className="absolute left-0 top-0 bottom-8 w-8 flex flex-col justify-between text-xs text-white/40">
            <span>{maxCount}</span>
            <span>{Math.round(maxCount / 2)}</span>
            <span>0</span>
          </div>

          {/* Bars */}
          <div className="flex items-end gap-1 ml-10 flex-1 h-full">
            {data.map((day) => {
              const heightPercent = maxCount > 0 ? (day.count / maxCount) * 100 : 0;
              return (
                <div
                  key={day.date}
                  className="flex-1 min-w-3 max-w-10 flex flex-col items-center group"
                >
                  <motion.div
                    className={`w-full rounded-t transition-colors relative ${
                      day.count > 0 ? 'bg-blue-500/70 hover:bg-blue-500' : 'bg-white/10'
                    }`}
                    initial={{ height: 0 }}
                    animate={{ height: day.count > 0 ? `${heightPercent}%` : '2px' }}
                    transition={{ duration: 0.5, ease: 'easeOut' }}
                  >
                    {/* Tooltip */}
                    <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-slate-800 px-2 py-1 rounded text-xs whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10">
                      {day.count} tourist{day.count !== 1 ? 's' : ''}
                    </div>
                  </motion.div>
                  <span className="text-[8px] sm:text-[10px] text-white/40 mt-2 -rotate-45 origin-top-left whitespace-nowrap">
                    {formatDateLabel(day.date)}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

export default DailyTouristsChart;
