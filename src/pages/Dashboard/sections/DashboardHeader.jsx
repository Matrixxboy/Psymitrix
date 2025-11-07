import React from 'react';
import { FiSunrise, FiSun, FiMoon } from 'react-icons/fi';

const motivationalQuotes = [
    "The secret of getting ahead is getting started.",
    "Your limitation is only your imagination.",
    "The best way to predict the future is to create it.",
    "You are stronger than you think.",
    "Every day is a new beginning. Take a deep breath and start again."
];

const DashboardHeader = ({ user }) => {
    // Logic for picking a quote is now encapsulated here
    const quote = motivationalQuotes[new Date().getDate() % motivationalQuotes.length];

    const capitalize = (str) => {
        if (!str) return '';
        return str.charAt(0).toUpperCase() + str.slice(1);
    }

    const getGreeting = () => {
        const hour = new Date().getHours();
        if (hour < 12) {
            return {
                text: 'Good morning',
                icon: <FiSunrise className="mr-2 text-warning" />
            };
        } else if (hour < 18) {
            return {
                text: 'Good afternoon',
                icon: <FiSun className="mr-2 text-warning" />
            };
        } else {
            return {
                text: 'Good evening',
                icon: <FiMoon className="mr-2 text-warning" />
            };
        }
    }

    const greeting = getGreeting();

    return (
        <header className="mb-8">
            <h1 className="text-3xl md:text-4xl font-bold text-light-headings dark:text-dark-headings">
                {greeting.text}, {capitalize(user?.firstName) || 'User'}!
            </h1>
            <p className="mt-2 text-md md:text-lg text-light-body dark:text-dark-body flex items-center">
                {greeting.icon}
                <span>{quote}</span>
            </p>
        </header>
    );
};

export default DashboardHeader;