import { useState } from 'react';
import { HiSearch, HiChevronLeft, HiChevronRight } from 'react-icons/hi';
import { MdFlight, MdDirectionsCar, MdDirectionsBus, MdTrain, MdTwoWheeler } from 'react-icons/md';

const travelModes = [
  { value: 'Flight', label: 'Flight', icon: MdFlight },
  { value: 'Train', label: 'Train', icon: MdTrain },
  { value: 'Bus', label: 'Bus', icon: MdDirectionsBus },
  { value: 'Car', label: 'Car', icon: MdDirectionsCar },
  { value: 'Bike', label: 'Bike', icon: MdTwoWheeler },
];

const WEEKDAYS = ['Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa', 'Su'];

function toDateOnly(d) {
  return new Date(d.getFullYear(), d.getMonth(), d.getDate());
}

function DateRangePicker({ startDate, endDate, onChange }) {
  const today = toDateOnly(new Date());

  const [viewYear, setViewYear] = useState(() => {
    const d = startDate ? new Date(startDate) : today;
    return d.getFullYear();
  });
  const [viewMonth, setViewMonth] = useState(() => {
    const d = startDate ? new Date(startDate) : today;
    return d.getMonth();
  });
  // 'start' | 'end'
  const [picking, setPicking] = useState(!startDate ? 'start' : (!endDate ? 'end' : 'start'));

  const start = startDate ? toDateOnly(new Date(startDate)) : null;
  const end = endDate ? toDateOnly(new Date(endDate)) : null;

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const getDaysInMonth = (y, m) => new Date(y, m + 1, 0).getDate();
  // Mon=0 offset
  const getOffset = (y, m) => { const d = new Date(y, m, 1).getDay(); return d === 0 ? 6 : d - 1; };

  const prevMonth = () => {
    if (viewMonth === 0) { setViewYear(y => y - 1); setViewMonth(11); }
    else setViewMonth(m => m - 1);
  };
  const nextMonth = () => {
    if (viewMonth === 11) { setViewYear(y => y + 1); setViewMonth(0); }
    else setViewMonth(m => m + 1);
  };

  const handleDayClick = (day) => {
    const clicked = new Date(viewYear, viewMonth, day);
    if (clicked < today) return; // can't select past dates

    if (picking === 'start') {
      onChange('startDate', clicked.toISOString());
      onChange('endDate', null);
      onChange('duration', 1);
      setPicking('end');
    } else {
      if (start && clicked < start) {
        // Swap
        onChange('endDate', start.toISOString());
        onChange('startDate', clicked.toISOString());
      } else {
        onChange('endDate', clicked.toISOString());
      }
      const diff = Math.ceil(Math.abs(clicked - (start || clicked)) / 86400000) + 1;
      onChange('duration', Math.max(1, diff));
      setPicking('start');
    }
  };

  const isStart = (y, m, d) => start && start.getFullYear() === y && start.getMonth() === m && start.getDate() === d;
  const isEnd = (y, m, d) => end && end.getFullYear() === y && end.getMonth() === m && end.getDate() === d;
  const isInRange = (y, m, d) => {
    if (!start || !end) return false;
    const dt = new Date(y, m, d);
    return dt > start && dt < end;
  };
  const isPast = (y, m, d) => new Date(y, m, d) < today;

  const days = getDaysInMonth(viewYear, viewMonth);
  const offset = getOffset(viewYear, viewMonth);

  const formatDate = (iso) => {
    if (!iso) return null;
    return new Date(iso).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
  };

  return (
    <div>
      {/* Selected range display */}
      <div className="flex gap-2 mb-4">
        <button
          onClick={() => setPicking('start')}
          className={`flex-1 p-3 rounded-2xl border-2 text-left transition-all ${
            picking === 'start' ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20' : 'border-gray-200 dark:border-gray-700'
          }`}>
          <p className="text-xs font-semibold text-gray-400 dark:text-gray-500 mb-0.5">START DATE</p>
          <p className={`text-sm font-bold ${startDate ? 'text-gray-900 dark:text-white' : 'text-gray-400'}`}>
            {startDate ? formatDate(startDate) : 'Select date'}
          </p>
        </button>
        <button
          onClick={() => startDate && setPicking('end')}
          className={`flex-1 p-3 rounded-2xl border-2 text-left transition-all ${
            picking === 'end' ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20' : 'border-gray-200 dark:border-gray-700'
          }`}>
          <p className="text-xs font-semibold text-gray-400 dark:text-gray-500 mb-0.5">END DATE</p>
          <p className={`text-sm font-bold ${endDate ? 'text-gray-900 dark:text-white' : 'text-gray-400'}`}>
            {endDate ? formatDate(endDate) : 'Select date'}
          </p>
        </button>
      </div>

      {/* Instruction hint */}
      <p className="text-xs text-primary-600 dark:text-primary-400 font-medium mb-3 text-center">
        {picking === 'start' ? '📅 Tap a start date' : '📅 Tap an end date'}
      </p>

      {/* Calendar */}
      <div className="bg-white dark:bg-gray-800/60 border border-gray-100 dark:border-gray-700 rounded-2xl p-4">
        {/* Month header */}
        <div className="flex items-center justify-between mb-4">
          <button onClick={prevMonth} className="w-8 h-8 flex items-center justify-center rounded-xl hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
            <HiChevronLeft className="w-5 h-5 text-gray-500" />
          </button>
          <span className="font-display font-bold text-gray-900 dark:text-white text-sm">
            {monthNames[viewMonth]} {viewYear}
          </span>
          <button onClick={nextMonth} className="w-8 h-8 flex items-center justify-center rounded-xl hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
            <HiChevronRight className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {/* Weekday headers */}
        <div className="grid grid-cols-7 mb-2">
          {WEEKDAYS.map((w) => (
            <div key={w} className="text-center text-xs font-semibold text-gray-400 dark:text-gray-500 py-1">{w}</div>
          ))}
        </div>

        {/* Day cells */}
        <div className="grid grid-cols-7">
          {/* Empty offset cells */}
          {Array.from({ length: offset }).map((_, i) => <div key={`off-${i}`} />)}

          {Array.from({ length: days }).map((_, i) => {
            const d = i + 1;
            const sel = isStart(viewYear, viewMonth, d) || isEnd(viewYear, viewMonth, d);
            const inRange = isInRange(viewYear, viewMonth, d);
            const past = isPast(viewYear, viewMonth, d);
            const isStartDay = isStart(viewYear, viewMonth, d);
            const isEndDay = isEnd(viewYear, viewMonth, d);

            return (
              <div key={d} className="relative flex items-center justify-center py-0.5">
                {/* Range highlight band */}
                {inRange && (
                  <div className="absolute inset-y-0 left-0 right-0 bg-primary-100 dark:bg-primary-900/30" />
                )}
                {isStartDay && end && (
                  <div className="absolute inset-y-0 right-0 w-1/2 bg-primary-100 dark:bg-primary-900/30" />
                )}
                {isEndDay && start && (
                  <div className="absolute inset-y-0 left-0 w-1/2 bg-primary-100 dark:bg-primary-900/30" />
                )}

                <button
                  onClick={() => !past && handleDayClick(d)}
                  className={`relative z-10 w-9 h-9 flex items-center justify-center rounded-full text-sm transition-all font-medium
                    ${past ? 'text-gray-300 dark:text-gray-600 cursor-not-allowed' : ''}
                    ${sel ? 'bg-primary-500 text-white font-bold shadow-md' : ''}
                    ${!sel && !past ? 'text-gray-700 dark:text-gray-300 hover:bg-primary-100 dark:hover:bg-primary-900/30' : ''}
                    ${inRange ? 'text-primary-700 dark:text-primary-300' : ''}
                  `}
                >
                  {d}
                </button>
              </div>
            );
          })}
        </div>
      </div>

      {/* Duration badge */}
      {startDate && endDate && (
        <div className="mt-3 text-center">
          <span className="inline-flex items-center gap-2 bg-primary-50 dark:bg-primary-900/20 text-primary-700 dark:text-primary-400 text-sm font-semibold px-4 py-2 rounded-full">
            🗓️ {Math.ceil((new Date(endDate) - new Date(startDate)) / 86400000) + 1} days trip
          </span>
        </div>
      )}
    </div>
  );
}

export default function StepDestination({ data, onChange }) {
  const needsRoute = data.travelMode === 'Car' || data.travelMode === 'Bike';

  return (
    <div className="animate-slide-up">
      <div className="mb-8">
        <span className="text-3xl">📍</span>
        <h2 className="font-display font-bold text-2xl text-gray-900 dark:text-white mt-2">
          Where & When?
        </h2>
        <p className="text-gray-500 dark:text-gray-400 mt-1">
          Tell us your destination, travel mode, and trip dates.
        </p>
      </div>

      <div className="space-y-6">
        {/* Destination */}
        <div>
          <label className="label">Destination *</label>
          <div className="relative">
            <HiSearch className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              className="input-field pl-12"
              placeholder="e.g. Munnar, Paris, Bali..."
              value={data.destination}
              onChange={(e) => onChange('destination', e.target.value)}
            />
          </div>
        </div>

        {/* Travel Mode */}
        <div>
          <label className="label">Travel Mode *</label>
          <div className="grid grid-cols-5 gap-2">
            {travelModes.map(({ value, label, icon: Icon }) => (
              <button
                key={value}
                onClick={() => onChange('travelMode', value)}
                className={`flex flex-col items-center gap-1.5 p-3 rounded-2xl border-2 transition-all duration-200 ${
                  data.travelMode === value
                    ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20'
                    : 'border-gray-200 dark:border-gray-700 hover:border-primary-300 bg-white dark:bg-gray-800/50'
                }`}
              >
                <Icon className={`w-6 h-6 ${data.travelMode === value ? 'text-primary-600' : 'text-gray-500'}`} />
                <span className={`text-xs font-medium ${data.travelMode === value ? 'text-primary-600 dark:text-primary-400' : 'text-gray-600 dark:text-gray-400'}`}>
                  {label}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Date Range Picker */}
        <div>
          <label className="label">When will your adventure begin and end? 📅</label>
          <p className="text-xs text-gray-500 dark:text-gray-400 mb-3">
            Choose your travel dates — duration is calculated automatically.
          </p>
          <DateRangePicker
            startDate={data.startDate}
            endDate={data.endDate}
            onChange={onChange}
          />
        </div>

        {/* Road trip extras */}
        {needsRoute && (
          <div className="space-y-4 p-4 bg-primary-50 dark:bg-primary-900/10 rounded-2xl border border-primary-100 dark:border-primary-900/30 animate-fade-in">
            <p className="text-sm font-semibold text-primary-700 dark:text-primary-400">
              🚗 Road Trip Details
            </p>
            <div>
              <label className="label">Starting Location</label>
              <input
                type="text"
                className="input-field"
                placeholder="e.g. Kochi, Chennai..."
                value={data.startingLocation}
                onChange={(e) => onChange('startingLocation', e.target.value)}
              />
            </div>
            <div>
              <label className="label">Lunch Stop Preference</label>
              <input
                type="text"
                className="input-field"
                placeholder="e.g. Thrissur, highway dhaba..."
                value={data.lunchStop}
                onChange={(e) => onChange('lunchStop', e.target.value)}
              />
            </div>
            <div>
              <label className="label">Dinner Stop Preference</label>
              <input
                type="text"
                className="input-field"
                placeholder="e.g. good restaurant at destination..."
                value={data.dinnerStop}
                onChange={(e) => onChange('dinnerStop', e.target.value)}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
