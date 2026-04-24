const allPreferences = [
  { label: 'Adventure Travel', emoji: '🏔️' },
  { label: 'City Breaks', emoji: '🏙️' },
  { label: 'Cultural Exploration', emoji: '🏛️' },
  { label: 'Glamping', emoji: '⛺' },
  { label: 'Beach Vacations', emoji: '🏖️' },
  { label: 'Nature Escapes', emoji: '🌿' },
  { label: 'Relaxing Getaways', emoji: '🌅' },
  { label: 'Road Trips', emoji: '🚗' },
  { label: 'Food Tourism', emoji: '🍜' },
  { label: 'Backpacking', emoji: '🎒' },
  { label: 'Cruise Vacations', emoji: '🚢' },
  { label: 'Staycations', emoji: '🏠' },
  { label: 'Skiing/Snowboarding', emoji: '⛷️' },
  { label: 'Wine Tours', emoji: '🍷' },
  { label: 'Wildlife Safaris', emoji: '🦁' },
  { label: 'Art Galleries', emoji: '🎨' },
  { label: 'Historical Sites', emoji: '🏰' },
  { label: 'Eco-Tourism', emoji: '🌱' },
  { label: 'Photography', emoji: '📸' },
  { label: 'Wellness & Spa', emoji: '🧘' },
];

export default function StepPreferences({ data, onChange }) {
  const toggle = (label) => {
    const current = data.preferences || [];
    const updated = current.includes(label)
      ? current.filter((p) => p !== label)
      : [...current, label];
    onChange('preferences', updated);
  };

  return (
    <div className="animate-slide-up">
      <div className="mb-8">
        <span className="text-3xl">🌟</span>
        <h2 className="font-display font-bold text-2xl text-gray-900 dark:text-white mt-2">
          Tailor your adventure
        </h2>
        <p className="text-gray-500 dark:text-gray-400 mt-1">
          Select your travel preferences to customize your trip plan.
        </p>
      </div>

      {data.preferences?.length > 0 && (
        <p className="text-sm text-primary-600 dark:text-primary-400 font-medium mb-4">
          {data.preferences.length} selected
        </p>
      )}

      <div className="flex flex-wrap gap-2">
        {allPreferences.map(({ label, emoji }) => {
          const selected = (data.preferences || []).includes(label);
          return (
            <button
              key={label}
              onClick={() => toggle(label)}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-full border-2 font-medium text-sm transition-all duration-200 ${
                selected
                  ? 'border-primary-500 bg-primary-500 text-white shadow-md'
                  : 'border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:border-primary-300'
              }`}
            >
              <span>{emoji}</span>
              {label}
            </button>
          );
        })}
      </div>
    </div>
  );
}
