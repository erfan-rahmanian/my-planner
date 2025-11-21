
import React, { useState, useEffect } from 'react';
import { CalendarDays, ChevronDown, ChevronUp } from 'lucide-react';
import AnimatedBackground from './components/AnimatedBackground';
import Calendar from './components/Calendar';
import DailyPlanner from './components/DailyPlanner';
import WeekPreview from './components/WeekPreview';
import EventModal from './components/EventModal';
import { CalendarEvent, PlannerState } from './types';
import { getDateKey } from './utils/dateUtils';
import clsx from 'clsx';

const App: React.FC = () => {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [plannerState, setPlannerState] = useState<PlannerState>(() => {
    try {
      const saved = localStorage.getItem('barnameh-data');
      return saved ? JSON.parse(saved) : {};
    } catch (e) {
      return {};
    }
  });

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalHour, setModalHour] = useState<number | null>(null);
  const [isCalendarVisible, setIsCalendarVisible] = useState(false);

  // Persist data
  useEffect(() => {
    localStorage.setItem('barnameh-data', JSON.stringify(plannerState));
  }, [plannerState]);

  const handleAddEvent = (hour: number) => {
    setModalHour(hour);
    setIsModalOpen(true);
  };

  const handleSaveEvent = (eventData: Omit<CalendarEvent, 'id' | 'isCompleted'>) => {
    const dateKey = getDateKey(selectedDate);
    const newEvent: CalendarEvent = {
      ...eventData,
      id: crypto.randomUUID(),
      isCompleted: false
    };

    setPlannerState(prev => {
      const currentDayEvents = prev[dateKey] || [];
      return {
        ...prev,
        [dateKey]: [...currentDayEvents, newEvent]
      };
    });
  };

  const toggleEventComplete = (eventId: string) => {
     const dateKey = getDateKey(selectedDate);
     setPlannerState(prev => {
       const events = prev[dateKey] || [];
       return {
         ...prev,
         [dateKey]: events.map(e => e.id === eventId ? { ...e, isCompleted: !e.isCompleted } : e)
       };
     });
  };

  const deleteEvent = (eventId: string) => {
    const dateKey = getDateKey(selectedDate);
    setPlannerState(prev => {
      const events = prev[dateKey] || [];
      return {
        ...prev,
        [dateKey]: events.filter(e => e.id !== eventId)
      };
    });
  };

  // Get events for currently selected day
  const currentEvents = plannerState[getDateKey(selectedDate)] || [];

  return (
    // h-[100dvh] ensures the app takes the full dynamic viewport height on mobile (address bar handling)
    <div className="relative h-[100dvh] flex flex-col overflow-hidden font-sans text-slate-800">
      <AnimatedBackground />
      
      <div className="flex flex-col lg:grid lg:grid-cols-12 lg:gap-8 h-full w-full max-w-7xl mx-auto p-4 lg:p-8">
        
        {/* Sidebar / Header Section */}
        {/* On Mobile: This is the top header + week preview + calendar toggle */}
        {/* On Desktop: This is the left sidebar */}
        <div className="lg:col-span-4 flex flex-col gap-4 lg:gap-6 shrink-0 mb-2 lg:mb-0 lg:h-full lg:overflow-y-auto">
           
           {/* App Title */}
           <div className="bg-white/90 backdrop-blur-lg rounded-3xl p-4 lg:p-6 shadow-sm text-center shrink-0 flex items-center justify-between lg:block">
             <div>
               <h1 className="text-xl lg:text-2xl font-extrabold text-slate-800 tracking-tight">برنامـه</h1>
               <p className="text-slate-500 text-xs lg:text-sm mt-1">نظم دهنده شخصی شما</p>
             </div>
             
             {/* Mobile Calendar Toggle Button */}
             <button 
               onClick={() => setIsCalendarVisible(!isCalendarVisible)}
               className="lg:hidden p-2 text-slate-500 hover:bg-slate-100 rounded-full transition-colors"
             >
               {isCalendarVisible ? <ChevronUp /> : <CalendarDays />}
             </button>
           </div>

           {/* Week Preview - Always Visible */}
           <div className="shrink-0">
              <WeekPreview 
                selectedDate={selectedDate}
                onSelectDate={setSelectedDate}
                events={plannerState}
              />
           </div>

           {/* Calendar - Collapsible on Mobile, Always visible on Desktop */}
           <div className={clsx(
             "transition-all duration-300 overflow-hidden",
             isCalendarVisible ? "max-h-[400px] opacity-100" : "max-h-0 opacity-0 lg:max-h-none lg:opacity-100"
           )}>
             <Calendar 
               selectedDate={selectedDate}
               onSelectDate={(d) => {
                 setSelectedDate(d);
                 // Optional: Close calendar on selection on mobile for better UX
                 if (window.innerWidth < 1024) setIsCalendarVisible(false);
               }}
               events={plannerState}
             />
           </div>
        </div>

        {/* Main Content: Daily Planner */}
        {/* Takes remaining height on mobile */}
        <div className="lg:col-span-8 flex-1 min-h-0 h-full">
          <DailyPlanner 
            events={currentEvents}
            onAddEvent={handleAddEvent}
            onToggleComplete={toggleEventComplete}
            onDeleteEvent={deleteEvent}
          />
        </div>

      </div>

      <EventModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSaveEvent}
        initialHour={modalHour}
      />
    </div>
  );
};

export default App;
