import React from 'react';

const TopSalesSection = () => {
  const salesData = [
    { id: 1, product: 'Therapy Session Package', amount: '$299', change: '+12%' },
    { id: 2, product: 'Assessment Bundle', amount: '$199', change: '+8%' },
    { id: 3, product: 'Consultation Service', amount: '$149', change: '+15%' },
    { id: 4, product: 'Group Therapy', amount: '$99', change: '+5%' }
  ];

  return (
    <div className="glass glass-card p-6">
      <h3 className="text-lg font-semibold text-[var(--color-text)] mb-4">
        Top Sales
      </h3>
      <div className="space-y-4">
        {salesData.map((item) => (
          <div key={item.id} className="flex justify-between items-center">
            <div>
              <p className="text-sm font-medium text-[var(--color-text)]">
                {item.product}
              </p>
              <p className="text-xs text-[var(--color-text-secondary)]">
                Revenue: {item.amount}
              </p>
            </div>
            <span className="text-sm font-medium text-[var(--color-success)]">
              {item.change}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TopSalesSection;
