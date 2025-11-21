
import React, { useEffect, useRef } from 'react';
import { HOURS, CalendarEvent, EVENT_TYPES } from '../types';
import { toPersianDigits } from '../utils/dateUtils';
import { Plus, CheckCircle2, Circle, Trash2 } from 'lucide-react';
import clsx from 'clsx';

interface DailyPlannerProps {
  events: CalendarEvent[];
  onAddEvent: (hour: number) => void;
  onToggleComplete: (eventId: string) => void;
  onDeleteEvent: (eventId: string) => void;
}

const DailyPlanner: React.FC<DailyPlannerProps> = ({ events, onAddEvent, onToggleComplete, onDeleteEvent }) => {
  
  const getEventsForHour = (h: number) => events.filter(e => e.hour === h);
  const getEventTypeColor = (type: string) => EVENT_TYPES.find(t => t.value === type)?.color || 'bg-slate-500';
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Scroll to current hour on mount to avoid user scrolling from 00:00 every time
    const currentHour = new Date().getHours();
    // We try to find the element corresponding to current hour
    const element = document.getElementById(`hour-${currentHour}`);
    if (element && scrollContainerRef.current) {
      element.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  }, []);

  return (
    <div className="bg-white/80 backdrop-blur-md rounded-3xl shadow-xl border border-white/50 overflow-hidden flex flex-col h-full w-full">
      <div className="p-4 md:p-6 bg-white/50 border-b border-slate-100 shrink-0">
        <h2 className="text-xl font-bold text-slate-800">برنامه روزانه</h2>
        <p className="text-slate-500 text-sm mt-1">وظایف خود را زمان‌بندی کنید</p>
      </div>
      
      <div 
        ref={scrollContainerRef}
        className="overflow-y-auto flex-1 p-2 md:p-4 space-y-3 custom-scrollbar scroll-smooth"
      >
        {HOURS.map((hour) => {
          const hourEvents = getEventsForHour(hour);
          const isPast = hour < new Date().getHours(); // Simple check

          return (
            <div key={hour} id={`hour-${hour}`} className="group flex gap-2 md:gap-4 relative min-h-[5rem]">
              {/* Time Column */}
              <div className="w-12 md:w-16 flex flex-col items-center pt-2 shrink-0">
                <span className={clsx("text-base md:text-lg font-bold", isPast ? "text-slate-400" : "text-slate-700")}>
                  {toPersianDigits(hour)}:00
                </span>
              </div>

              {/* Timeline Line */}
              <div className="absolute top-0 bottom-0 right-[3rem] md:right-[3.7rem] w-px bg-slate-200 group-last:hidden"></div>

              {/* Content Area */}
              <div className="flex-1 pb-4">
                <div className="space-y-2">
                  {hourEvents.map((evt) => (
                    <div 
                      key={evt.id} 
                      className={clsx(
                        "relative flex items-start gap-2 md:gap-3 p-2 md:p-3 rounded-xl border transition-all group/card",
                        evt.isCompleted ? "bg-slate-50 border-slate-100" : "bg-white border-slate-200 shadow-sm hover:shadow-md"
                      )}
                    >
                      {/* Color Strip */}
                      <div className={clsx("absolute right-0 top-0 bottom-0 w-1.5 rounded-r-xl", getEventTypeColor(evt.type))} />

                      <button 
                        onClick={() => onToggleComplete(evt.id)}
                        className={clsx("mt-1 transition-colors shrink-0", evt.isCompleted ? "text-emerald-500" : "text-slate-300 hover:text-emerald-500")}
                      >
                         {evt.isCompleted ? <CheckCircle2 size={20} /> : <Circle size={20} />}
                      </button>

                      <div className="flex-1 pr-2 min-w-0">
                        <h4 className={clsx("font-bold text-sm truncate", evt.isCompleted ? "text-slate-400 line-through" : "text-slate-800")}>
                          {evt.title}
                        </h4>
                        {evt.description && (
                          <p className="text-xs text-slate-500 mt-1 line-clamp-2">{evt.description}</p>
                        )}
                      </div>
                      
                      <button 
                        onClick={() => onDeleteEvent(evt.id)}
                        className="opacity-100 md:opacity-0 group-hover/card:opacity-100 text-slate-400 hover:text-rose-500 transition-opacity p-1 shrink-0"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  ))}
                  
                  {/* Add Button (Visible when empty or on hover) */}
                  <button
                    onClick={() => onAddEvent(hour)}
                    className={clsx(
                      "w-full py-2 border-2 border-dashed border-slate-200 rounded-xl flex items-center justify-center text-slate-400 hover:border-primary/50 hover:text-primary hover:bg-primary/5 transition-all",
                      hourEvents.length === 0 ? "opacity-50 hover:opacity-100" : "opacity-0 group-hover:opacity-100 focus:opacity-100"
                    )}
                  >
                    <Plus size={16} />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default DailyPlanner;
