
import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { EVENT_TYPES, EventType, CalendarEvent, HOURS } from '../types';
import { toPersianDigits } from '../utils/dateUtils';

interface EventModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (event: Omit<CalendarEvent, 'id' | 'isCompleted'>) => void;
  initialHour: number | null;
}

const EventModal: React.FC<EventModalProps> = ({ isOpen, onClose, onSave, initialHour }) => {
  const [title, setTitle] = useState('');
  const [type, setType] = useState<EventType>('normal');
  const [hour, setHour] = useState<number>(6);
  const [description, setDescription] = useState('');

  useEffect(() => {
    if (isOpen && initialHour !== null) {
      setHour(initialHour);
      setTitle('');
      setType('normal');
      setDescription('');
    }
  }, [isOpen, initialHour]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;
    onSave({ title, type, hour, description, isCompleted: false });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/20 backdrop-blur-sm" onClick={onClose}></div>
      <div className="relative bg-white rounded-3xl shadow-2xl w-full max-w-md p-6 animate-in fade-in zoom-in-95 duration-200">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-xl font-bold text-slate-800">افزودن برنامه جدید</h3>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600">
            <X className="w-6 h-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-600 mb-1">عنوان</label>
            <input
              autoFocus
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all"
              placeholder="مثلاً: مطالعه ریاضی"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
             <div>
              <label className="block text-sm font-medium text-slate-600 mb-1">ساعت</label>
              <select
                value={hour}
                onChange={(e) => setHour(Number(e.target.value))}
                className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-primary outline-none bg-white"
              >
                {HOURS.map((h) => (
                  <option key={h} value={h}>
                    {toPersianDigits(h)}:00
                  </option>
                ))}
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-slate-600 mb-1">نوع فعالیت</label>
              <select
                value={type}
                onChange={(e) => setType(e.target.value as EventType)}
                className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-primary outline-none bg-white"
              >
                {EVENT_TYPES.map((t) => (
                  <option key={t.value} value={t.value}>{t.label}</option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-600 mb-1">توضیحات (اختیاری)</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all min-h-[80px]"
              placeholder="جزئیات بیشتر..."
            />
          </div>

          <button
            type="submit"
            disabled={!title.trim()}
            className="w-full py-3 bg-primary hover:bg-indigo-600 text-white font-bold rounded-xl shadow-lg shadow-primary/30 transition-all disabled:opacity-50 disabled:cursor-not-allowed mt-4"
          >
            ثبت برنامه
          </button>
        </form>
      </div>
    </div>
  );
};

export default EventModal;
