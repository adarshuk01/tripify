import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { HiArrowLeft, HiArrowRight } from 'react-icons/hi';
import { tripService } from '../services/tripService';
import { GeneratingLoader } from '../components/common/Loader';
import StepTraveler from '../components/planner/StepTraveler';
import StepDestination from '../components/planner/StepDestination';
import StepPreferences from '../components/planner/StepPreferences';
import StepBudget from '../components/planner/StepBudget';
import StepReview from '../components/planner/StepReview';

const STEPS = ['Traveler', 'Destination', 'Preferences', 'Budget', 'Review'];

const defaultForm = {
  travelParty: 'Solo',
  numberOfPeople: 1,
  destination: '',
  startingLocation: '',
  travelMode: 'Flight',
  duration: 3,
  startDate: null,
  endDate: null,
  lunchStop: '',
  dinnerStop: '',
  preferences: [],
  budget: 'Medium',
};

export default function PlannerPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [step, setStep] = useState(0);
  const [form, setForm] = useState(defaultForm);
  const [generating, setGenerating] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState('');

  useEffect(() => {
    const dest = searchParams.get('dest');
    if (dest) {
      setForm((f) => ({ ...f, destination: dest }));
      setStep(1);
    }
  }, []);

  const handleChange = (key, value) => {
    setForm((f) => ({ ...f, [key]: value }));
    setError('');
  };

  const validate = () => {
    if (step === 1) {
      if (!form.destination.trim()) return 'Please enter a destination';
      if (!form.startDate) return 'Please select a start date';
      if (!form.endDate) return 'Please select an end date';
    }
    if (step === 4) {
      if (!form.destination.trim()) return 'Destination is required';
    }
    return null;
  };

  const next = () => {
    const err = validate();
    if (err) { setError(err); return; }
    setStep((s) => Math.min(s + 1, STEPS.length - 1));
    window.scrollTo(0, 0);
  };

  const back = () => {
    setStep((s) => Math.max(s - 1, 0));
    setError('');
    window.scrollTo(0, 0);
  };

  const handleGenerate = async () => {
    setGenerating(true);
    setProgress(10);
    setError('');

    const timer = setInterval(() => {
      setProgress((p) => {
        if (p >= 90) { clearInterval(timer); return 90; }
        return p + Math.floor(Math.random() * 10) + 5;
      });
    }, 1500);

    try {
      const payload = {
        destination: form.destination,
        startingLocation: form.startingLocation,
        numberOfPeople: form.numberOfPeople,
        travelMode: form.travelMode,
        budget: form.budget === 'Flexible' ? 'Luxury' : form.budget,
        duration: form.duration,
        preferences: form.preferences,
        travelParty: form.travelParty,
        lunchStop: form.lunchStop,
        dinnerStop: form.dinnerStop,
        startDate: form.startDate,
        endDate: form.endDate,
      };

      const { data } = await tripService.generate(payload);
      clearInterval(timer);
      setProgress(100);

      setTimeout(() => {
        navigate(`/itinerary/${data.data._id}`);
      }, 500);
    } catch (err) {
      clearInterval(timer);
      setGenerating(false);
      setProgress(0);
      setError(err.response?.data?.message || 'Failed to generate itinerary. Please try again.');
    }
  };

  const progressPct = ((step + 1) / STEPS.length) * 100;

  return (
    <div className="page-container">
      {generating && <GeneratingLoader progress={progress} />}

      {/* Progress bar */}
      <div className="mb-6">
        <div className="flex items-center gap-3 mb-3">
          {step > 0 && (
            <button onClick={back} className="p-2 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
              <HiArrowLeft className="w-5 h-5 text-gray-600 dark:text-gray-400" />
            </button>
          )}
          <div className="flex-1 h-2 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
            <div
              className="h-full bg-primary-500 rounded-full transition-all duration-500"
              style={{ width: `${progressPct}%` }}
            />
          </div>
          <span className="text-xs text-gray-400 font-medium w-10 text-right">
            {step + 1}/{STEPS.length}
          </span>
        </div>
      </div>

      {/* Step content */}
      <div className="min-h-[400px]">
        {step === 0 && <StepTraveler data={form} onChange={handleChange} />}
        {step === 1 && <StepDestination data={form} onChange={handleChange} />}
        {step === 2 && <StepPreferences data={form} onChange={handleChange} />}
        {step === 3 && <StepBudget data={form} onChange={handleChange} />}
        {step === 4 && <StepReview data={form} onEdit={setStep} />}
      </div>

      {error && (
        <div className="mt-4 p-3 bg-red-50 dark:bg-red-900/20 border border-red-100 dark:border-red-800 rounded-xl text-sm text-red-600 dark:text-red-400">
          {error}
        </div>
      )}

      {/* Footer action */}
      <div className="mt-8">
        {step < STEPS.length - 1 ? (
          <button onClick={next} className="btn-primary w-full">
            Continue
            <HiArrowRight className="w-4 h-4" />
          </button>
        ) : (
          <button
            onClick={handleGenerate}
            disabled={generating}
            className="btn-primary w-full text-base py-4"
          >
            🪄 Build My Itinerary
          </button>
        )}
      </div>
    </div>
  );
}
