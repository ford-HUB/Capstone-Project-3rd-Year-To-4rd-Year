import React from 'react';
import { Calendar } from 'lucide-react';
import {
    MONTH_NAMES,
    getCategoriesForCurrentMonth,
    getEventsForMonth,
    getCalendarDays,
} from '../../../utils/calendarUtils';
import { getCategoryColor } from '../../../utils/categoryUtils';

const CampaignCalendar = ({
    currentDate,
    onPrevMonth,
    onNextMonth,
    events,
}) => {
    const currentMonth = currentDate.getMonth();
    const currentYear = currentDate.getFullYear();

    const monthEvents = getEventsForMonth(events, currentYear, currentMonth);
    const calendarDays = getCalendarDays(currentYear, currentMonth, monthEvents);
    const currentMonthCategories = getCategoriesForCurrentMonth(
        events,
        currentYear,
        currentMonth
    );

    return (
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200">
            <div className="flex justify-between items-center mb-6">
                <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                    <Calendar className="w-5 h-5 text-purple-600" />
                    {MONTH_NAMES[currentMonth]} {currentYear}
                </h3>
                <div className="flex gap-1">
                    <button
                        onClick={onPrevMonth}
                        className="w-8 h-8 flex items-center justify-center text-gray-600 hover:bg-gray-100 rounded-lg transition"
                        aria-label="Previous month">
                        ‹
                    </button>
                    <button
                        onClick={onNextMonth}
                        className="w-8 h-8 flex items-center justify-center text-gray-600 hover:bg-gray-100 rounded-lg transition"
                        aria-label="Next month">
                        ›
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-7 gap-1 mb-3">
                {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((day, i) => (
                    <div
                        key={i}
                        className="text-center text-xs font-semibold text-gray-500 py-2">
                        {day}
                    </div>
                ))}
            </div>

            <div className="grid grid-cols-7 gap-1">
                {calendarDays.map((item, i) => (
                    <div
                        key={i}
                        className={`aspect-square flex items-center justify-center text-sm rounded-lg relative transition ${
                            item.day
                                ? `text-gray-700 hover:bg-gray-100 cursor-pointer ${
                                      item.isToday
                                          ? 'bg-purple-600 text-white font-semibold hover:bg-purple-700'
                                          : ''
                                  }`
                                : ''
                        }`}>
                        {item.day}
                        {item.hasEvent && item.day && (
                            <span
                                className={`absolute bottom-1 left-1/2 transform -translate-x-1/2 w-1.5 h-1.5 rounded-full ${
                                    item.isToday ? 'bg-white' : 'bg-purple-600'
                                }`}
                            />
                        )}
                    </div>
                ))}
            </div>

            <div className="mt-6 pt-6 border-t border-gray-200">
                <h4 className="text-sm font-bold text-gray-900 mb-4">
                    Campaign Categories{' '}
                    {currentMonthCategories.length > 0 &&
                        `(${currentMonthCategories.length})`}
                </h4>
                {currentMonthCategories.length > 0 ? (
                    <div className="space-y-3">
                        {currentMonthCategories.map((category) => (
                            <div
                                key={category}
                                className="flex items-center gap-3 text-sm">
                                <div
                                    className={`w-3 h-3 rounded-full ${getCategoryColor(
                                        category
                                    )}`}></div>
                                <span className="text-gray-700">{category}</span>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="text-xs text-gray-500 italic">
                        No campaigns this month
                    </div>
                )}
            </div>
        </div>
    );
};

export default CampaignCalendar;

