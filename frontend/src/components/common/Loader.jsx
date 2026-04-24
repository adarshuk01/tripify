export default function Loader({ size = 'md', color = 'primary' }) {
  const sizes = { sm: 'w-5 h-5', md: 'w-8 h-8', lg: 'w-12 h-12' };
  const colors = {
    primary: 'border-primary-500',
    white: 'border-white',
    gray: 'border-gray-400',
  };

  return (
    <div
      className={`${sizes[size]} ${colors[color]} border-2 border-t-transparent rounded-full animate-spin`}
      role="status"
      aria-label="Loading"
    />
  );
}

export function PageLoader() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 dark:bg-tripify-dark gap-4">
      <div className="w-16 h-16 border-4 border-primary-200 border-t-primary-500 rounded-full animate-spin" />
      <p className="font-display text-gray-500 dark:text-gray-400 animate-pulse">
        Loading...
      </p>
    </div>
  );
}

export function GeneratingLoader({ progress }) {
  return (
    <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white dark:bg-tripify-card rounded-3xl p-8 max-w-xs w-full text-center shadow-2xl animate-slide-up">
        <div className="w-20 h-20 mx-auto mb-6 relative">
          <div className="w-20 h-20 border-4 border-primary-100 rounded-full" />
          <div className="absolute inset-0 w-20 h-20 border-4 border-t-primary-500 rounded-full animate-spin" />
        </div>
        <h3 className="font-display font-bold text-xl text-gray-900 dark:text-white mb-2">
          Generating Itinerary...
        </h3>
        {progress && (
          <p className="text-primary-500 font-semibold text-lg mb-3">{progress}%</p>
        )}
        <p className="text-gray-500 dark:text-gray-400 text-sm leading-relaxed">
          Please wait while our AI works its magic to create the perfect trip plan tailored to your preferences.
        </p>
      </div>
    </div>
  );
}

export function SkeletonCard() {
  return (
    <div className="card p-4 space-y-3">
      <div className="skeleton h-4 w-3/4" />
      <div className="skeleton h-3 w-1/2" />
      <div className="skeleton h-3 w-2/3" />
      <div className="flex gap-2 mt-2">
        <div className="skeleton h-6 w-16 rounded-full" />
        <div className="skeleton h-6 w-20 rounded-full" />
      </div>
    </div>
  );
}
