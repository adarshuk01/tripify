import { HiPencil, HiLocationMarker, HiUsers, HiCalendar, HiStar } from 'react-icons/hi';

function formatDate(iso) {
  if (!iso) return null;
  return new Date(iso).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
}

export default function StepReview({ data, onEdit }) {
  const dateLabel = data.startDate && data.endDate
    ? `${formatDate(data.startDate)} → ${formatDate(data.endDate)}`
    : `${data.duration} day${data.duration > 1 ? 's' : ''}`;

  const rows = [
    {
      icon: HiLocationMarker,
      label: 'Destination',
      value: data.destination || 'Not set',
      step: 1,
    },
    {
      icon: HiUsers,
      label: 'Party',
      value: `${data.travelParty} • ${data.numberOfPeople} traveler${data.numberOfPeople > 1 ? 's' : ''}`,
      step: 0,
    },
    {
      icon: HiCalendar,
      label: 'Dates',
      value: dateLabel,
      step: 1,
    },
    {
      icon: HiStar,
      label: 'Interests',
      value: data.preferences?.length ? `${data.preferences.length} selected` : 'None selected',
      detail: data.preferences,
      step: 2,
    },
    {
      emoji: '₹',
      label: 'Budget',
      value: data.budget || 'Not set',
      step: 3,
    },
  ];

  return (
    <div className="animate-slide-up">
      <div className="mb-8">
        <span className="text-3xl">✅</span>
        <h2 className="font-display font-bold text-2xl text-gray-900 dark:text-white mt-2">
          Review Summary
        </h2>
        <p className="text-gray-500 dark:text-gray-400 mt-1">
          Looks good? Let's build your perfect itinerary.
        </p>
      </div>

      <div className="space-y-3">
        {rows.map((row) => {
          const Icon = row.icon;
          return (
            <div key={row.label} className="card p-4">
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-3">
                  <div className="w-9 h-9 rounded-xl bg-primary-50 dark:bg-primary-900/20 flex items-center justify-center flex-shrink-0">
                    {Icon
                      ? <Icon className="w-4 h-4 text-primary-600 dark:text-primary-400" />
                      : <span className="font-bold text-primary-600 dark:text-primary-400 text-base">{row.emoji}</span>
                    }
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">
                      {row.label}
                    </p>
                    <p className="font-display font-semibold text-gray-900 dark:text-white mt-0.5">
                      {row.value}
                    </p>
                    {row.detail && row.detail.length > 0 && (
                      <div className="flex flex-wrap gap-1 mt-2">
                        {row.detail.map((p, i) => (
                          <span key={i} className="text-xs bg-primary-50 dark:bg-primary-900/20 text-primary-700 dark:text-primary-400 px-2 py-0.5 rounded-full">
                            {p}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
                <button
                  onClick={() => onEdit(row.step)}
                  className="p-2 rounded-xl text-primary-500 hover:bg-primary-50 dark:hover:bg-primary-900/20 transition-colors"
                >
                  <HiPencil className="w-4 h-4" />
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {data.travelMode && (
        <div className="mt-3 p-3 bg-gray-50 dark:bg-gray-800/50 rounded-xl">
          <p className="text-sm text-gray-600 dark:text-gray-400">
            <span className="font-semibold">Travel Mode:</span> {data.travelMode}
            {data.startingLocation && ` • From ${data.startingLocation}`}
          </p>
        </div>
      )}
    </div>
  );
}
