export const ProductSkeleton = () => {
  return (
    <div className="group relative bg-card border border-border rounded-3xl overflow-hidden shadow-md2 animate-pulse">
      {/* Image placeholder */}
      <div className="w-full h-72 skeleton-shimmer bg-gray-700/40"></div>

      {/* Details */}
      <div className="p-6 text-center space-y-4">
        <div className="h-4 w-24 bg-gray-600/40 mx-auto rounded"></div>
        <div className="h-5 w-40 bg-gray-600/40 mx-auto rounded"></div>
        <div className="flex justify-center items-center gap-4">
          <div className="h-6 w-16 bg-gray-600/40 rounded"></div>
          <div className="h-6 w-20 bg-gray-600/40 rounded"></div>
        </div>
        <div className="flex justify-center gap-3">
          <div className="h-9 w-24 bg-gray-600/40 rounded-full"></div>
          <div className="h-9 w-28 bg-gray-600/40 rounded-full"></div>
        </div>
      </div>
    </div>
  );
};
