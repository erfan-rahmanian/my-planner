
export type EventType = 'normal' | 'exam' | 'meeting' | 'deadline';

export interface CalendarEvent {
  id: string;
  title: string;
  type: EventType;
  hour: number; // 0 to 23
  description?: string;
  isCompleted: boolean;
}

export interface DayData {
  date: string; // ISO Gregorian string (YYYY-MM-DD) acting as key
  events: CalendarEvent[];
}

export interface PlannerState {
  [dateKey: string]: CalendarEvent[];
}

export const HOURS = Array.from({ length: 24 }, (_, i) => i); // 0, 1, ... 23

export const EVENT_TYPES: { value: EventType; label: string; color: string }[] = [
  { value: 'normal', label: 'معمولی', color: 'bg-slate-500' },
  { value: 'exam', label: 'امتحان', color: 'bg-rose-500' },
  { value: 'meeting', label: 'جلسه', color: 'bg-blue-500' },
  { value: 'deadline', label: 'تحویل پروژه', color: 'bg-amber-500' },
];
