import React from 'react';

const SkeletonCard = ({ className = '' }) => (
  <div className={`bg-gray-200 dark:bg-gray-800 rounded-3xl animate-pulse ${className}`} />
);

const DashboardSkeleton = () => {
  return (
    <div className="min-h-screen p-4 sm:p-6 lg:p-8">
      <main className="max-w-7xl mx-auto">
        {/* Skeleton Header */}
        <div className="mb-8">
          <div className="h-10 w-3/5 bg-gray-300 dark:bg-gray-700 rounded-lg animate-pulse mb-4"></div>
          <div className="h-6 w-4/5 bg-gray-200 dark:bg-gray-800 rounded-lg animate-pulse"></div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column Skeleton */}
          <div className="lg:col-span-2 space-y-6">
            <SkeletonCard className="h-28" />
            <SkeletonCard className="h-64" />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <SkeletonCard className="h-48" />
              <SkeletonCard className="h-48" />
            </div>
          </div>

          {/* Right Column Skeleton */}
          <div className="lg:col-span-1 space-y-6">
            <SkeletonCard className="h-36" />
            <SkeletonCard className="h-24" />
            <SkeletonCard className="h-40" />
            <SkeletonCard className="h-28" />
          </div>
        </div>
      </main>
    </div>
  );
};

export default DashboardSkeleton;