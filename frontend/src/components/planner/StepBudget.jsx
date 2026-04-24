const budgets = [
  {
    value: 'Low',
    label: 'Cheap',
    emoji: '💰',
    desc: 'Budget-friendly, economical travel.',
    color: 'border-blue-400 bg-blue-50 dark:bg-blue-900/20',
    activeColor: 'border-blue-500 bg-blue-500',
    tag: 'Best Value',
  },
  {
    value: 'Medium',
    label: 'Balanced',
    emoji: '🧳',
    desc: 'Moderate spending for a balanced trip.',
    color: 'border-amber-400 bg-amber-50 dark:bg-amber-900/20',
    activeColor: 'border-amber-500 bg-amber-500',
    tag: 'Most Popular',
  },
  {
    value: 'Luxury',
    label: 'Luxury',
    emoji: '💎',
    desc: 'High-end, indulgent experiences.',
    color: 'border-purple-400 bg-purple-50 dark:bg-purple-900/20',
    activeColor: 'border-purple-500 bg-purple-500',
    tag: 'Premium',
  },
  {
    value: 'Flexible',
    label: 'Flexible',
    emoji: '🪄',
    desc: 'No budget restrictions.',
    color: 'border-green-400 bg-green-50 dark:bg-green-900/20',
    activeColor: 'border-green-500 bg-green-500',
    tag: '',
  },
];

export default function StepBudget({ data, onChange }) {
  return (
    <div className="animate-slide-up">
      <div className="mb-8">
        <span className="text-3xl">💵</span>
        <h2 className="font-display font-bold text-2xl text-gray-900 dark:text-white mt-2">
          Set your trip budget
        </h2>
        <p className="text-gray-500 dark:text-gray-400 mt-1">
          Let us know your budget preference, and we'll craft an itinerary that suits your financial comfort.
        </p>
      </div>

      <div className="space-y-3">
        {budgets.map((b) => {
          const isSelected = data.budget === b.value;
          return (
            <button
              key={b.value}
              onClick={() => onChange('budget', b.value)}
              className={`w-full text-left p-4 rounded-2xl border-2 transition-all duration-200 ${
                isSelected
                  ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20'
                  : 'border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800/50 hover:border-primary-300'
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="text-2xl">{b.emoji}</span>
                  <div>
                    <p className={`font-display font-semibold ${isSelected ? 'text-primary-700 dark:text-primary-400' : 'text-gray-900 dark:text-white'}`}>
                      {b.label}
                    </p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">{b.desc}</p>
                  </div>
                </div>
                {b.tag && (
                  <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-primary-100 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400">
                    {b.tag}
                  </span>
                )}
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
