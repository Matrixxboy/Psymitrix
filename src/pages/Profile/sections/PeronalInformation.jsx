import React from "react";
import { useAuth } from '../../../hooks/useAuth';
    
const PersonalInformation = () => {
  const { user } = useAuth();

  const infoItems = [
    { title: "Gender", value: user?.gender },
    { title: "Blood Group", value: user?.blood_group },
    { title: "Older Siblings", value: user?.older_siblings },
    { title: "Younger Siblings", value: user?.younger_siblings },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {infoItems.map((item, index) => (
        <div
          key={index}
          className="flex items-center justify-between bg-light-secondary/40 dark:bg-dark-secondary/30 
          shadow-md dark:shadow-zinc-800 hover:shadow-xl transition-all duration-300 
          p-4 rounded-2xl backdrop-blur-sm border border-transparent hover:border-light-accent/40 dark:hover:border-dark-accent/40"
        >
          <div>
            <h4 className="font-semibold text-light-headings dark:text-dark-headings">
              {item.title}
            </h4>
            <p className="text-sm text-light-body dark:text-dark-body">
              {item.value}
            </p>
          </div>
          <button
            className="text-sm font-semibold text-light-accent dark:text-dark-accent hover:underline hover:scale-105 transition-transform duration-200"
          >
            Edit
          </button>
        </div>
      ))}
    </div>
  );
};

export default PersonalInformation;
