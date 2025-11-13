import React from 'react';
import dayjs from 'dayjs';
import { ChevronLeft, ChevronRight, Calendar, Clock } from 'lucide-react';
import { createPortal } from 'react-dom';
import { getEventCategoryColors } from '../../../../utils/eventCategoryColorPicker.js';

const BeneficiaryEventCalendar = ({ eventData = [] }) => {
    const [selectedDate, setSelectedDate] = React.useState(new Date());
    const [hoveredDate, setHoveredDate] = React.useState(null);
    const [tooltipPos, setTooltipPos] = React.useState(null);

    const currentMonth = selectedDate.getMonth();
    const currentYear = selectedDate.getFullYear();
    const today = new Date();
    const todayDate = today.getDate();
    const todayMonth = today.getMonth();
    const todayYear = today.getFullYear();

    const months = [
        'January', 'February', 'March', 'April', 'May', 'June',
        'July', 'August', 'September', 'October', 'November', 'December',
    ];

    const shortMonths = [
        'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
        'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec',
    ];

    const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
    const firstDay = new Date(currentYear, currentMonth, 1).getDay();

    const events = React.useMemo(() => {
        if (!eventData) return {};

        return eventData.reduce((acc, event) => {
            const dateObj = dayjs(event.event_started);
            if (
                dateObj.month() === currentMonth &&
                dateObj.year() === currentYear
            ) {
                const day = dateObj.date();
                const formattedTime = event.event_started
                    ? dateObj.format('h:mm A')
                    : 'All Day';

                if (!acc[day]) acc[day] = [];

                acc[day].push({
                    title: event.title,
                    time: formattedTime,
                    type: event.Categories?.[0]?.name || 'Assistance',
                });
            }
            return acc;
        }, {});
    }, [eventData, currentMonth, currentYear]);

    const getEventTypeColor = (type) => {
        return getEventCategoryColors(type).dot;
    };

    const navigateMonth = (direction) => {
        const newDate = new Date(selectedDate);
        newDate.setMonth(currentMonth + direction);
        setSelectedDate(newDate);
    };

    const handleMouseEnter = (day, ref) => {
        if (ref.current) {
            const rect = ref.current.getBoundingClientRect();
            setTooltipPos({
                top: rect.bottom + 8,
                left: rect.left + rect.width / 2,
            });
            setHoveredDate(day);
        }
    };

    const handleMouseLeave = () => {
        setHoveredDate(null);
        setTooltipPos(null);
    };

    const renderCalendarDays = () => {
        const days = [];

        for (let i = 0; i < firstDay; i++) {
            days.push(
                <div
                    key={`empty-${i}`}
                    className="w-10 h-10"></div>
            );
        }

        for (let day = 1; day <= daysInMonth; day++) {
            const isToday =
                day === todayDate &&
                currentMonth === todayMonth &&
                currentYear === todayYear;

            const hasEvents = events[day];
            const eventCount = hasEvents ? hasEvents.length : 0;
            const isHovered = hoveredDate === day;
            const cellRef = React.createRef();

            days.push(
                <div
                    key={day}
                    ref={cellRef}
                    className="relative group"
                    onMouseEnter={() => handleMouseEnter(day, cellRef)}
                    onMouseLeave={handleMouseLeave}>
                    <div
                        className={`w-10 h-10 flex items-center justify-center text-sm cursor-pointer rounded-lg transition-all duration-200 relative ${
                            isToday
                                ? 'bg-green-600 text-white font-bold shadow-lg'
                                : hasEvents
                                ? 'bg-gradient-to-br from-green-50 to-emerald-50 text-gray-800 font-medium hover:from-green-100 hover:to-emerald-100 border border-green-200'
                                : 'text-gray-700 hover:bg-gray-100'
                        } ${isHovered ? 'transform scale-105' : ''}`}>
                        {day}
                        {hasEvents && (
                            <div className="absolute bottom-1 left-1/2 transform -translate-x-1/2 flex gap-1">
                                {hasEvents.slice(0, 3).map((event, idx) => (
                                    <div
                                        key={idx}
                                        className={`w-1.5 h-1.5 rounded-full ${getEventTypeColor(
                                            event.type
                                        )}`}
                                    />
                                ))}
                                {eventCount > 3 && (
                                    <div className="w-1.5 h-1.5 rounded-full bg-gray-400" />
                                )}
                            </div>
                        )}
                    </div>
                </div>
            );
        }

        return days;
    };

    return (
        <div className="bg-white border-gray-200 p-4 max-w-sm">
            <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                    <Calendar className="w-5 h-5 text-green-600" />
                    <span className="text-lg font-bold text-gray-900">
                        {months[currentMonth]} {currentYear}
                    </span>
                </div>
                <div className="flex items-center gap-1">
                    <button
                        onClick={() => navigateMonth(-1)}
                        className="p-1.5 rounded-lg hover:bg-gray-100 transition-colors">
                        <ChevronLeft className="w-4 h-4 text-gray-600" />
                    </button>
                    <button
                        onClick={() => navigateMonth(1)}
                        className="p-1.5 rounded-lg hover:bg-gray-100 transition-colors">
                        <ChevronRight className="w-4 h-4 text-gray-600" />
                    </button>
                </div>
            </div>

            {/* Day headers */}
            <div className="grid grid-cols-7 gap-1 mb-2">
                {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(
                    (day, index) => (
                        <div
                            key={index}
                            className="w-10 h-4 flex items-center justify-center text-xs font-semibold text-gray-500 uppercase">
                            {day[0]}
                        </div>
                    )
                )}
            </div>

            <div className="grid grid-cols-7 gap-1 mb-4">
                {renderCalendarDays()}
            </div>
            
            {events[hoveredDate] &&
                hoveredDate &&
                tooltipPos &&
                createPortal(
                    <div
                        className="fixed z-[100] bg-gray-900 text-white text-xs rounded-lg p-2 shadow-xl min-w-32 border border-gray-700"
                        style={{
                            top: tooltipPos.top,
                            left: tooltipPos.left,
                            transform: 'translateX(-50%)',
                        }}>
                        <div className="font-semibold mb-1">
                            {shortMonths[currentMonth]} {hoveredDate}
                        </div>
                        {events[hoveredDate]?.map((event, idx) => (
                            <div
                                key={idx}
                                className="flex items-center gap-2 py-1">
                                <div
                                    className={`w-2 h-2 rounded-full ${getEventTypeColor(
                                        event.type
                                    )}`}
                                />
                                <div className="flex-1">
                                    <div className="font-medium">
                                        {event.title}
                                    </div>
                                    <div className="text-gray-300 text-xs flex items-center gap-1">
                                        <Clock className="w-3 h-3" />
                                        {event.time}
                                    </div>
                                </div>
                            </div>
                        ))}
                        <div className="absolute -top-1 left-1/2 transform -translate-x-1/2 w-2 h-2 bg-gray-900 border-l border-t border-gray-700 rotate-45"></div>
                    </div>,
                    document.body
                )}

            <div className="border-t border-gray-200 pt-3">
                <div className="text-xs font-medium text-gray-700 mb-3">
                    Event Categories
                </div>
                <div className="space-y-2">
                    {[
                        ...new Map(
                            eventData.map((item) => [item.Categories?.[0]?.name || 'Assistance', item])
                        ).values(),
                    ].map((event) => {
                        const eventType = event.Categories?.[0]?.name || 'Assistance';
                        const colors = getEventCategoryColors(eventType);
                        return (
                            <div
                                key={event.event_id}
                                className={`flex items-center justify-between px-3 py-2 rounded-lg border ${colors.bg} ${colors.border} transition-all duration-200 hover:shadow-sm`}>
                                <div className="flex items-center space-x-2">
                                    <div className={`w-2 h-2 rounded-full ${colors.dot}`}></div>
                                    <span className={`text-xs font-medium ${colors.text}`}>
                                        {eventType}
                                    </span>
                                </div>
                                <div className={`text-xs ${colors.text} opacity-70`}>
                                    {eventData.filter(e => (e.Categories?.[0]?.name || 'Assistance') === eventType).length}
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
};

export default BeneficiaryEventCalendar;
