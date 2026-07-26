export const EmptyState = () => {
  return (
    <div className="flex flex-col items-center justify-center py-4 px-6 text-center text-gray-300">
      {/* Icon area */}
      <div className="w-20 h-20 mb-6 rounded-full bg-[#1e293b] flex items-center justify-center border border-gray-700 shadow-inner">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1.5}
          stroke="currentColor"
          className="w-10 h-10 text-primary"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M3 16.5v.75A2.25 2.25 0 005.25 19.5h13.5A2.25 2.25 0 0021 17.25v-.75M3 16.5L9.75 9m0 0l2.25 2.25M9.75 9v6.75M21 16.5L14.25 9m0 0L12 11.25M14.25 9v6.75"
          />
        </svg>
      </div>

      {/* Title */}
      <h2 className="text-2xl font-semibold text-text-muted mb-2">
        No products found
      </h2>

      {/* Subtitle */}
      <p className="text-gray-500 max-w-md mb-8">
        We couldn’t find any perfumes that match your current filters or search
        terms.
      </p>

      {/* Action button */}
      <button
        onClick={() => window.location.reload()}
        className="px-6 py-2.5 bg-primary hover:bg-primary/90 text-card rounded-full font-medium transition-all duration-300"
      >
        Refresh Page
      </button>
    </div>
  );
};
