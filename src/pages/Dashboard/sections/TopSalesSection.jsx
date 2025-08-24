import React from 'react';

const TopSalesSection = () => {
  const salesData = [
    { id: 1, product: 'Therapy Session Package', amount: '$299', change: '+12%' },
    { id: 2, product: 'Assessment Bundle', amount: '$199', change: '+8%' },
    { id: 3, product: 'Consultation Service', amount: '$149', change: '+15%' },
    { id: 4, product: 'Group Therapy', amount: '$99', change: '+5%' }
  ];

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
        Top Sales
      </h3>
      <div className="space-y-4">
        {salesData.map((item) => (
          <div key={item.id} className="flex justify-between items-center">
            <div>
              <p className="text-sm font-medium text-gray-900 dark:text-white">
                {item.product}
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                Revenue: {item.amount}
              </p>
            </div>
            <span className="text-sm font-medium text-green-600 dark:text-green-400">
              {item.change}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TopSalesSection;
