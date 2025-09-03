export function GlassBoxLogo({ className = "h-8 w-8" }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* 3D transparent box - isometric view */}
      {/* Front face */}
      <path
        d="M6 9.5V18.5L12 22L18 18.5V9.5L12 6L6 9.5Z"
        stroke="currentColor"
        strokeWidth="1.5"
        className="text-blue-500 dark:text-blue-400"
        fill="currentColor"
        fillOpacity="0.1"
      />
      
      {/* Top face */}
      <path
        d="M6 9.5L12 6L18 9.5L12 13L6 9.5Z"
        stroke="currentColor"
        strokeWidth="1.5"
        className="text-blue-600 dark:text-blue-500"
        fill="currentColor"
        fillOpacity="0.05"
      />
      
      {/* Visible edges for depth */}
      <path
        d="M12 13V22M12 6V13M6 9.5L12 13L18 9.5"
        stroke="currentColor"
        strokeWidth="1.5"
        className="text-blue-500 dark:text-blue-400"
      />
    </svg>
  )
}
