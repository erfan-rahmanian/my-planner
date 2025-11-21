import React from 'react';
import { getWeekDays, toPersianDigits, isSameDay, getJalaliDateParts, getDateKey } from '../utils/dateUtils';
import { PlannerState } from '../types';
import clsx from 'clsx';

interface WeekPreviewProps {
  selectedDate: Date;
  onSelectDate: (date: Date) => void;
  events: PlannerState;
}

const WeekPreview: React.FC<WeekPreviewProps> = ({ selectedDate, onSelectDate, events }) => {
  const weekDays = getWeekDays(selectedDate);

  return (
    <div className="bg-white/60 backdrop-blur-md rounded-3xl shadow-sm p-4 border border-white/40 mb-6 overflow-x-auto">
      <div className="flex justify-between min-w-[300px]">
        {weekDays.map((date, idx) => {
          const isSelected = isSameDay(date, selectedDate);
          const dayEvents = events[getDateKey(date)] || [];
          const importantEvents = dayEvents.filter(e => e.type !== 'normal');
          const parts = getJalaliDateParts(date);
          const dayName = new Intl.DateTimeFormat('fa-IR', { weekday: 'short' }).format(date);

          return (
            <button
              key={idx}
              onClick={() => onSelectDate(date)}
              className={clsx(
                "flex flex-col items-center justify-center p-3 rounded-2xl transition-all w-full mx-1",
                isSelected ? "bg-white shadow-md ring-2 ring-secondary/30" : "hover:bg-white/50"
              )}
            >
              <span className="text-xs text-slate-500 mb-1">{dayName}</span>
              <span className={clsx("text-lg font-bold mb-1", isSelected ? "text-secondary" : "text-slate-700")}>
                {toPersianDigits(parts.day)}
              </span>
              
              {/* Event Dots */}
              <div className="flex gap-1 h-2">
                {importantEvents.length > 0 ? (
                  importantEvents.slice(0, 3).map((evt, i) => (
                    <div 
                      key={i} 
                      className={clsx(
                        "w-1.5 h-1.5 rounded-full",
                        evt.type === 'exam' ? 'bg-rose-500' :
                        evt.type === 'meeting' ? 'bg-blue-500' : 'bg-amber-500'
                      )} 
                    />
                  ))
                ) : (
                   dayEvents.length > 0 && <div className="w-1.5 h-1.5 rounded-full bg-slate-300"></div>
                )}
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default WeekPreview;