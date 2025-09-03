export function GlassBoxLogo({ className = "h-8 w-8" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 48 48"
      className={className}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Outer glass box frame */}
      <path
        d="M12 8 L36 8 L42 14 L42 34 L36 40 L12 40 L6 34 L6 14 Z"
        stroke="currentColor"
        strokeWidth="2"
        fill="none"
        className="text-blue-600 dark:text-blue-400"
        opacity="0.8"
      />
      
      {/* Inner transparent box */}
      <path
        d="M8 14 L24 22 L40 14 M24 22 L24 42"
        stroke="currentColor"
        strokeWidth="2"
        fill="none"
        className="text-blue-600 dark:text-blue-400"
        opacity="0.6"
      />
      
      {/* Data dots inside */}
      <circle cx="16" cy="20" r="2" fill="currentColor" className="text-cyan-500" />
      <circle cx="32" cy="20" r="2" fill="currentColor" className="text-green-500" />
      <circle cx="24" cy="28" r="2" fill="currentColor" className="text-purple-500" />
      
      {/* Connecting lines (data flow) */}
      <path
        d="M16 20 L24 28 L32 20"
        stroke="currentColor"
        strokeWidth="1"
        fill="none"
        className="text-gray-400 dark:text-gray-600"
        opacity="0.5"
      />
    </svg>
  )
}
