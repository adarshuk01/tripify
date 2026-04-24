export default function TripifyLogo({ size = 36 }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 36 36"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <rect width="36" height="36" rx="10" fill="#3BB07B" />
      <path
        d="M10 22C10 22 10 14 18 14C26 14 26 22 26 22"
        stroke="white"
        strokeWidth="2.5"
        strokeLinecap="round"
      />
      <circle cx="18" cy="11" r="3" fill="white" />
      <path
        d="M14 22L18 26L22 22"
        stroke="white"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
