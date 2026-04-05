"use client";
import { useState, useEffect } from "react";
import { useCheckoutStore } from "@/lib/store";
import { 
  CalendarDays, Clock, MapPin, Plus, Store, ToggleLeft, ToggleRight, Loader2
} from "lucide-react";

export default function SchedulePage() {
  const { adminSchedules, fetchAllSchedules, addScheduleToDB, toggleScheduleStatusDB } = useCheckoutStore();
  const [isAdding, setIsAdding] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Form State
  const [date, setDate] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [location, setLocation] = useState("PUP Manila Main Campus (Mural/Pylon)");

  useEffect(() => {
    fetchAllSchedules();
  }, [fetchAllSchedules]);

  const handleAddSchedule = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    const success = await addScheduleToDB(date, startTime, endTime, location);
    
    if (success) {
      setDate("");
      setStartTime("");
      setEndTime("");
      setIsAdding(false);
    } else {
      alert("Failed to add schedule. Make sure your database is connected.");
    }
    
    setIsLoading(false);
  };

  // Format dates nicely (e.g., "Monday, Apr 12, 2026")
  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = { weekday: 'long', year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('en-US', options);
  };

  // Format times nicely (e.g., "13:00:00" -> "1:00 PM")
  const formatTime = (timeString: string) => {
    const [hours, minutes] = timeString.split(':');
    const h = parseInt(hours);
    const ampm = h >= 12 ? 'PM' : 'AM';
    const formattedHours = h % 12 || 12;
    return `${formattedHours}:${minutes} ${ampm}`;
  };

  const activeCount = adminSchedules.filter(s => s.isActive).length;

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 relative">
      
      {/* TOP METRICS */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-gray-500 text-sm font-medium mb-1">Active Meetup Slots</p>
            <h3 className="text-2xl font-bold text-gray-900">{activeCount}</h3>
          </div>
          <div className="w-12 h-12 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center">
            <CalendarDays className="w-6 h-6" />
          </div>
        </div>
        <div className="bg-[#FBEAF0]/50 p-6 rounded-2xl border border-[#D4537E]/20 shadow-sm flex flex-col justify-center">
          <h3 className="text-[#D4537E] font-bold flex items-center gap-2 mb-1">
            <Store className="w-4 h-4" /> Campus Meetups
          </h3>
          <p className="text-xs text-gray-600 leading-relaxed">
            Create time slots here. Students will select them during checkout. If an emergency occurs, toggle a slot to inactive to instantly hide it from the storefront.
          </p>
        </div>
      </div>

      {/* HEADER & CONTROLS */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold text-gray-900">Manage Schedule</h2>
        <button 
          onClick={() => setIsAdding(!isAdding)} 
          className="bg-[#D4537E] text-white px-5 py-2.5 rounded-xl text-sm font-medium hover:bg-[#b8436b] shadow-sm flex items-center gap-2 transition-colors"
        >
          <Plus className="w-4 h-4" /> Add Time Slot
        </button>
      </div>

      {/* ADD SCHEDULE FORM */}
      {isAdding && (
        <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm mb-8 animate-in slide-in-from-top-4 duration-300">
          <form onSubmit={handleAddSchedule} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Date</label>
                <input 
                  required type="date" value={date} onChange={(e) => setDate(e.target.value)} 
                  className="w-full bg-gray-50 border border-gray-200 focus:border-[#D4537E] outline-none rounded-xl px-4 py-2.5 text-sm" 
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Start Time</label>
                <input 
                  required type="time" value={startTime} onChange={(e) => setStartTime(e.target.value)} 
                  className="w-full bg-gray-50 border border-gray-200 focus:border-[#D4537E] outline-none rounded-xl px-4 py-2.5 text-sm" 
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">End Time</label>
                <input 
                  required type="time" value={endTime} onChange={(e) => setEndTime(e.target.value)} 
                  className="w-full bg-gray-50 border border-gray-200 focus:border-[#D4537E] outline-none rounded-xl px-4 py-2.5 text-sm" 
                />
              </div>
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Location</label>
              <div className="relative">
                <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input 
                  required type="text" value={location} onChange={(e) => setLocation(e.target.value)} 
                  className="w-full bg-gray-50 border border-gray-200 focus:border-[#D4537E] outline-none rounded-xl py-2.5 pl-9 pr-4 text-sm" 
                />
              </div>
            </div>
            <div className="flex justify-end gap-3 pt-2">
              <button type="button" onClick={() => setIsAdding(false)} className="px-5 py-2.5 rounded-xl border border-gray-200 text-gray-600 font-medium hover:bg-gray-50 text-sm transition-colors">Cancel</button>
              <button type="submit" disabled={isLoading} className="bg-[#D4537E] text-white px-6 py-2.5 rounded-xl text-sm font-medium hover:bg-[#b8436b] shadow-sm flex items-center justify-center min-w-[120px] transition-colors">
                {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Save Slot'}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* SCHEDULE TABLE */}
      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-gray-50 text-gray-500 font-medium border-b border-gray-200">
              <tr>
                <th className="px-6 py-4">Date</th>
                <th className="px-6 py-4">Time Window</th>
                <th className="px-6 py-4">Location</th>
                <th className="px-6 py-4 text-center">Status</th>
                <th className="px-6 py-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {adminSchedules.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-gray-500">No schedules created yet. Add one above!</td>
                </tr>
              ) : (
                adminSchedules.map((schedule) => (
                  <tr key={schedule.id} className={`transition-colors ${!schedule.isActive ? 'bg-gray-50/50' : 'hover:bg-gray-50'}`}>
                    <td className="px-6 py-4">
                      <p className={`font-bold ${schedule.isActive ? 'text-gray-900' : 'text-gray-400 line-through'}`}>
                        {formatDate(schedule.date)}
                      </p>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2 text-gray-600">
                        <Clock className="w-4 h-4 text-gray-400" />
                        <span className={!schedule.isActive ? 'text-gray-400' : ''}>
                          {formatTime(schedule.startTime)} - {formatTime(schedule.endTime)}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-gray-600">
                      <span className={!schedule.isActive ? 'text-gray-400' : ''}>{schedule.location}</span>
                    </td>
                    <td className="px-6 py-4 text-center">
                      {schedule.isActive ? (
                        <span className="bg-emerald-100 text-emerald-800 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider">Active</span>
                      ) : (
                        <span className="bg-gray-100 text-gray-600 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider">Hidden</span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button 
                        onClick={() => toggleScheduleStatusDB(schedule.id, schedule.isActive)}
                        className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                          schedule.isActive ? 'text-red-600 hover:bg-red-50' : 'text-emerald-600 hover:bg-emerald-50'
                        }`}
                      >
                        {schedule.isActive ? (
                          <><ToggleRight className="w-5 h-5 text-emerald-500" /> Disable</>
                        ) : (
                          <><ToggleLeft className="w-5 h-5 text-gray-400" /> Enable</>
                        )}
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
}