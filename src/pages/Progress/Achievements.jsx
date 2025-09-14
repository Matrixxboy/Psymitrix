import React from 'react';

const FiStar = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon></svg>
);

const Achievements = ({ items = [] }) => (
  <div className="space-y-4">
    {items.slice(0, 3).map((ach, i) => (
      <div key={i} className={`flex items-center gap-4 p-3 rounded-lg ${ach.achieved ? 'bg-white/10' : 'bg-white/5 opacity-60'}`}>
        <FiStar className={`${ach.achieved ? 'text-yellow-400' : 'text-light-body dark:text-dark-body'} text-xl`} />
        <span className={`font-medium ${ach.achieved ? 'text-light-headings dark:text-dark-headings' : 'text-light-body dark:text-dark-body'}`}>{ach.title}</span>
      </div>
    ))}
    <button className="text-center w-full mt-2 text-sm text-light-primary dark:text-dark-primary font-semibold hover:underline">
      View All
    </button>
  </div>
);

export default Achievements;
