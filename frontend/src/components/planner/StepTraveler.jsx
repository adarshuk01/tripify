const partyOptions = [
  { value: 'Solo', label: 'Only Me', emoji: '🧍', desc: 'Traveling solo, just you.' },
  { value: 'Couple', label: 'A Couple', emoji: '❤️', desc: 'A romantic getaway for two.' },
  { value: 'Family', label: 'Family', emoji: '👨‍👩‍👧', desc: 'Quality time with your loved ones.' },
  { value: 'Friends', label: 'Friends', emoji: '🌟', desc: 'Adventure with your closest pals.' },
  { value: 'Work', label: 'Work', emoji: '💼', desc: 'Business or corporate travel.' },
];

export default function StepTraveler({ data, onChange }) {
  return (
    <div className="animate-slide-up">
      <div className="mb-8">
        <span className="text-3xl">🧳</span>
        <h2 className="font-display font-bold text-2xl text-gray-900 dark:text-white mt-2">
          Who is going?
        </h2>
        <p className="text-gray-500 dark:text-gray-400 mt-1">
          Let's get started by selecting who you're traveling with.
        </p>
      </div>

      <div className="space-y-3">
        {partyOptions.map((opt) => (
          <button
            key={opt.value}
            onClick={() => onChange('travelParty', opt.value)}
            className={`w-full text-left p-4 rounded-2xl border-2 transition-all duration-200 ${
              data.travelParty === opt.value
                ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20'
                : 'border-gray-200 dark:border-gray-700 hover:border-primary-300 dark:hover:border-primary-700 bg-white dark:bg-gray-800/50'
            }`}
          >
            <div className="flex items-center gap-3">
              <span className="text-2xl">{opt.emoji}</span>
              <div>
                <p className={`font-display font-semibold ${
                  data.travelParty === opt.value
                    ? 'text-primary-700 dark:text-primary-400'
                    : 'text-gray-900 dark:text-white'
                }`}>
                  {opt.label}
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-400">{opt.desc}</p>
              </div>
            </div>
          </button>
        ))}
      </div>

      <div className="mt-6">
        <label className="label">Number of Travelers</label>
        <div className="flex items-center gap-4">
          <button
            onClick={() => onChange('numberOfPeople', Math.max(1, data.numberOfPeople - 1))}
            className="w-11 h-11 rounded-xl bg-gray-100 dark:bg-gray-800 flex items-center justify-center text-xl font-bold text-gray-700 dark:text-gray-300 hover:bg-gray-200 transition-colors"
          >
            −
          </button>
          <span className="font-display font-bold text-2xl text-gray-900 dark:text-white min-w-[2rem] text-center">
            {data.numberOfPeople}
          </span>
          <button
            onClick={() => onChange('numberOfPeople', Math.min(20, data.numberOfPeople + 1))}
            className="w-11 h-11 rounded-xl bg-gray-100 dark:bg-gray-800 flex items-center justify-center text-xl font-bold text-gray-700 dark:text-gray-300 hover:bg-gray-200 transition-colors"
          >
            +
          </button>
        </div>
      </div>
    </div>
  );
}
