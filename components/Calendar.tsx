import React, { useMemo } from 'react';
import { ChevronRight, ChevronLeft } from 'lucide-react';
import { getJalaliDateParts, getJalaliMonthName, getPersianMonthRange, toPersianDigits, isSameDay, getDateKey, getJalaliYear } from '../utils/dateUtils';
import { PlannerState } from '../types';

interface CalendarProps {
  selectedDate: Date;
  onSelectDate: (date: Date) => void;
  events: PlannerState;
}

const WEEK_DAYS = ['ش', 'ی', 'د', 'س', 'چ', 'پ', 'ج'];

const Calendar: React.FC<CalendarProps> = ({ selectedDate, onSelectDate, events }) => {
  
  const { startDate, endDate } = useMemo(() => getPersianMonthRange(selectedDate), [selectedDate]);

  const days = useMemo(() => {
    const daysArr = [];
    // We need to pad the beginning if the month doesn't start on Saturday
    const startDayOfWeek = startDate.getDay(); // 0=Sun, ... 6=Sat
    // Calculate padding: Sat(6)->0, Sun(0)->1, Mon(1)->2 ... Fri(5)->6
    const padCount = (startDayOfWeek + 1) % 7;

    // Previous month padding days
    for (let i = padCount; i > 0; i--) {
      const d = new Date(startDate);
      d.setDate(d.getDate() - i);
      daysArr.push({ date: d, isCurrentMonth: false });
    }

    // Current month days
    const current = new Date(startDate);
    while (current <= endDate) {
      daysArr.push({ date: new Date(current), isCurrentMonth: true });
      current.setDate(current.getDate() + 1);
    }

    // Next month padding to fill the grid (optional, 42 cells standard grid)
    const remaining = 42 - daysArr.length;
    for (let i = 1; i <= remaining; i++) {
      const d = new Date(endDate);
      d.setDate(d.getDate() + i);
      daysArr.push({ date: new Date(d), isCurrentMonth: false });
    }

    return daysArr;
  }, [startDate, endDate]);

  const handlePrevMonth = () => {
    const newDate = new Date(startDate);
    newDate.setDate(newDate.getDate() - 15); // Go back into previous month
    onSelectDate(newDate);
  };

  const handleNextMonth = () => {
    const newDate = new Date(endDate);
    newDate.setDate(newDate.getDate() + 2); // Go forward into next month
    onSelectDate(newDate);
  };

  return (
    <div className="bg-white/80 backdrop-blur-md rounded-3xl shadow-xl p-6 border border-white/50">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <button onClick={handlePrevMonth} className="p-2 hover:bg-slate-100 rounded-full transition-colors text-slate-600">
          <ChevronRight className="w-5 h-5" />
        </button>
        <div className="text-xl font-bold text-slate-800 flex flex-col items-center">
          <span>{getJalaliMonthName(selectedDate)}</span>
          <span className="text-sm font-normal text-slate-500 mt-1">{toPersianDigits(getJalaliYear(selectedDate))}</span>
        </div>
        <button onClick={handleNextMonth} className="p-2 hover:bg-slate-100 rounded-full transition-colors text-slate-600">
          <ChevronLeft className="w-5 h-5" />
        </button>
      </div>

      {/* Week Header */}
      <div className="grid grid-cols-7 mb-2 text-center">
        {WEEK_DAYS.map((d) => (
          <div key={d} className="text-sm font-medium text-slate-400 py-2">{d}</div>
        ))}
      </div>

      {/* Days Grid */}
      <div className="grid grid-cols-7 gap-2">
        {days.map((item, idx) => {
          const dateKey = getDateKey(item.date);
          const dayEvents = events[dateKey] || [];
          const hasImportant = dayEvents.some(e => e.type !== 'normal');
          const isSelected = isSameDay(item.date, selectedDate);
          const isToday = isSameDay(item.date, new Date());

          return (
            <button
              key={idx}
              onClick={() => onSelectDate(item.date)}
              className={`
                relative aspect-square rounded-2xl flex flex-col items-center justify-center text-sm transition-all duration-200
                ${!item.isCurrentMonth ? 'text-slate-300' : 'text-slate-700'}
                ${isSelected ? 'bg-primary text-white shadow-lg scale-105 z-10 ring-4 ring-primary/20' : 'hover:bg-slate-100'}
                ${isToday && !isSelected ? 'border-2 border-primary/50' : ''}
              `}
            >
              <span className={`text-lg ${isSelected ? 'font-bold' : 'font-medium'}`}>
                {toPersianDigits(getJalaliDateParts(item.date).day)}
              </span>
              
              {/* Indicators */}
              <div className="flex gap-0.5 mt-1 h-1.5">
                {dayEvents.length > 0 && (
                  <div className={`w-1.5 h-1.5 rounded-full ${isSelected ? 'bg-white/80' : (hasImportant ? 'bg-rose-500' : 'bg-primary/60')}`}></div>
                )}
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default Calendar;